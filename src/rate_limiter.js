#!/usr/bin/env node
/**
 * 速率限制器
 */

class RateLimiter {
  constructor(max = 100, window = 60000) {
    this.max = max;
    this.window = window;
    this.requests = new Map();
  }
  
  isAllowed(key) {
    const now = Date.now();
    const keyRequests = this.requests.get(key) || [];
    
    // 清理过期请求
    const recent = keyRequests.filter(t => now - t < this.window);
    
    if (recent.length >= this.max) {
      return false;
    }
    
    recent.push(now);
    this.requests.set(key, recent);
    return true;
  }
  
  reset(key) {
    this.requests.delete(key);
  }
}

module.exports = RateLimiter;
