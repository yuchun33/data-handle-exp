import time

import paho.mqtt.client as mqtt


BROKER = "192.168.56.10"  # 這裡改成 VM 的 IP
PORT = 1883
TOPIC = "iot-data"


# Callback when connected to MQTT broker
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(TOPIC)


# Callback when message is received
def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()}")


# Create MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to broker
client.connect(BROKER, PORT, 60)

# Start the loop
client.loop_start()

# Publish message every 5 seconds
while True:
    # client.publish(TOPIC, "Hello MQTT!")
    time.sleep(5)
