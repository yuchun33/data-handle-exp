from kafka import KafkaProducer
import json, time, datetime, uuid

producer = KafkaProducer(
    bootstrap_servers=['192.168.56.10:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

topic = "test-topic"

while True:
    data = {
        "id": str(uuid.uuid4()),
        "ts": datetime.datetime.utcnow().isoformat(),
        "payload": {}
    }
    producer.send(topic, value=data)
    producer.flush()
    time.sleep(3)
