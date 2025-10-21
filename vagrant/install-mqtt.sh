sudo mkdir -p $PWD/mosquitto/config
echo -e "listener 1883 \nallow_anonymous true" | sudo tee $PWD/mosquitto/config/mosquitto.conf

sudo docker run -d \
  --name mqtt-broker \
  -v "$PWD/mosquitto/config:/mosquitto/config" \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto