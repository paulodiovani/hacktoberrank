const Redis = require('ioredis')

const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379')

module.exports = redisClient
