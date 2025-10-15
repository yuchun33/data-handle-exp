# install_kafka.sh
#!/bin/bash
docker network create kafka-net || true

docker run -d --name zookeeper --network kafka-net \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  confluentinc/cp-zookeeper:7.6.0

docker run -d --name kafka --network kafka-net \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.56.10:9092 \
  confluentinc/cp-kafka:7.6.0
