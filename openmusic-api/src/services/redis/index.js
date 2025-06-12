import redis from 'redis';

import config from '../../utils/config.js';

export default class CacheService {
  constructor() {
    this.client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this.client.on('error', (error) => {
      console.error('Redis Client Error', error);
    });

    this.client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this.client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this.client.get(key);

    if (result === null) throw new Error(`Cache key "${key}" not found`);

    return result;
  }

  async delete(key) {
    return this.client.del(key);
  }
}
