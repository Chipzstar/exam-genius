const Redis = require("ioredis");

export const redis = new Redis(process.env.REDIS_URL);
