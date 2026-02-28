#!/usr/bin/env node
/**
 * 简单缓存系统
 */

class Cache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl; // 过期时间(毫秒)
  }
  
  set(key, value) {
    this.cache.set(key, { value, time: Date.now() });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.time > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) { return this.get(key) !== null; }
  clear() { this.cache.clear(); }
}

module.exports = Cache;
