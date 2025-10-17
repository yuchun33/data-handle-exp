import redis

r = redis.Redis(host='192.168.56.10', port=6379)
print(r.ping())