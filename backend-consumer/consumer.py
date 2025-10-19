# backend/aggregator.py
from kafka import KafkaConsumer
from redis import Redis
import json, datetime, os

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "192.168.56.10:9092")
TOPIC = os.getenv("KAFKA_TOPIC", "iot-data")

redis_client = Redis(host="192.168.56.10", port=6379, decode_responses=True)

consumer = KafkaConsumer(
    TOPIC,
    bootstrap_servers=[KAFKA_BROKER],
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    auto_offset_reset="latest",
    enable_auto_commit=True,
    group_id="aggregator",
)


def get_key(machine_id):
    d = datetime.date.today().strftime("%Y%m%d")
    return f"agg:{machine_id}:{d}"


def get_slot_key(line_id, module_id, slot_id):
    """生成 Redis key"""
    return f"slot_counter:{line_id}:{module_id}:{slot_id}"


def update_slot_counter(message):
    """更新插槽的打件計數"""
    try:
        # 從消息中提取數據
        line_id = message["lineId"]
        module_id = message["module"]
        slot_id = message["slot"]
        status = message["status"]

        # 生成 Redis key
        slot_key = get_slot_key(line_id, module_id, slot_id)

        # 更新總計數
        redis_client.hincrby(slot_key, "total", 1)

        # 更新狀態計數
        if status == "OK":
            redis_client.hincrby(slot_key, "ok", 1)
        elif status == "NG":
            redis_client.hincrby(slot_key, "ng", 1)

        # 設置最後更新時間
        redis_client.hset(slot_key, "last_updated", datetime.datetime.utcnow().isoformat())

        # 讀取並印出累積數量
        counters = redis_client.hgetall(slot_key)
        total = counters.get("total", "0")
        ok_count = counters.get("ok", "0")
        ng_count = counters.get("ng", "0")
        print(f"Updated counter for {slot_key} - total={total}, ok={ok_count}, ng={ng_count}")

    except Exception as e:
        print(f"Error processing message: {e}")


print("Starting slot counter consumer...")
try:
    for message in consumer:
        update_slot_counter(message.value)
except KeyboardInterrupt:
    print("Shutting down...")
finally:
    consumer.close()
