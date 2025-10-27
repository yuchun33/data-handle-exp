from kafka import KafkaProducer
import json
import time
import datetime
import uuid
import random
import threading

producer = KafkaProducer(
    bootstrap_servers=["192.168.56.10:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

topic = "iot-data"

# 建立 300 個 feeder id（F1..F300）
feeder_ids = [f"F{i}" for i in range(1, 301)]

# 產生一組可能重複的 pn 值池（pn 可以重複）
pn_pool = [f"PN-{random.randint(100000, 999999)}" for _ in range(100)]

# 為所有 feeder 產生不重複的 fifo 值（確保唯一）
fifo_numbers = random.sample(range(100000, 1000000), len(feeder_ids))

feeder_table = {}
for i, fid in enumerate(feeder_ids):
    pn = random.choice(pn_pool)
    fifo = f"FIFO-{fifo_numbers[i]}"
    feeder_table[fid] = {"pn": pn, "fifo": fifo}

# 選取 feeder_table 中的 50 隻作為要安裝的集合
selected_feeders = random.sample(list(feeder_table.keys()), 50)

# 準備所有可能的安裝位置（3 條 line，每條 6 個 module，每個 module 16 個 slot）
lines = [f"LINE-{i + 1}" for i in range(3)]
all_positions = [
    (line, module, slot) for line in lines for module in range(6) for slot in range(6)
]
print(all_positions)

# 從可用位置中隨機選出 200 個位置來安裝這些 feeder（因此不是每個 slot 都有 feeder）
chosen_positions = random.sample(all_positions, len(selected_feeders))

# 建立位置到 feeder 的映射，以及 feeder 到位置的反向查詢
installation = {}  # installation[line][module][slot] = feederId
feeder_position = {}  # feeder_position[feederId] = (line, module, slot)

for fid, (line, module, slot) in zip(selected_feeders, chosen_positions, strict=True):
    installation.setdefault(line, {}).setdefault(module, {})[slot] = fid
    feeder_position[fid] = (line, module, slot)


# 可選：方便查詢某位置是否有安裝 feeder 的小函式
def feeder_at(line, module, slot):
    return installation.get(line, {}).get(module, {}).get(slot)


# 方便在產生資料時取得 feederId、pn、fifo 的函式
def get_feeder_info():
    fid = random.choice(selected_feeders)
    info = feeder_table[fid]
    return fid, info["pn"], info["fifo"]


print("Starting to send data...")


def produce_line_data(lineId):
    while True:
        # productName = random.choice(["WidgetA", "WidgetB", "WidgetC", "WidgetD"])
        for moduleId in range(6):
            for slotId in range(6):
                fid = feeder_at(lineId, moduleId, slotId)
                if not fid:
                    continue  # skip sending if no feeder installed at this position
                info = feeder_table[fid]
                status = "NG" if random.random() < 0.1 else "OK"
                data = {
                    "id": str(uuid.uuid4()),
                    "ts": datetime.datetime.utcnow().isoformat(),
                    "lineId": lineId,
                    "module": moduleId,
                    "slot": slotId,
                    "feederId": fid,
                    "pn": info["pn"],
                    "fifo": info["fifo"],
                    # "productName": productName,
                    "status": status,
                }

                try:
                    producer.send(topic, value=data)
                    producer.flush()
                    print(f"Sent data: {data}")
                except Exception as e:
                    print(f"Error sending data: {e}")

                time.sleep(1)


threads = []
for lineId in lines:
    thread = threading.Thread(target=produce_line_data, args=(lineId,))
    thread.daemon = True  # 設置為守護執行緒
    threads.append(thread)
    thread.start()

# 保持主程序運行
try:
    while True:
        time.sleep(10)
except KeyboardInterrupt:
    print("Shutting down...")
