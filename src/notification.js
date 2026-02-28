#!/usr/bin/env node
/**
 * 通知系统
 */

class Notification {
  constructor() {
    this.handlers = [];
  }
  
  subscribe(fn) {
    this.handlers.push(fn);
    return () => {
      this.handlers = this.handlers.filter(h => h !== fn);
    };
  }
  
  notify(type, data) {
    this.handlers.forEach(fn => fn(type, data));
  }
  
  // 预设通知类型
  nodeConnected(nodeId) { this.notify('node:connected', { nodeId, time: Date.now() }); }
  nodeDisconnected(nodeId) { this.notify('node:disconnected', { nodeId, time: Date.now() }); }
  knowledgeReceived(count) { this.notify('knowledge:received', { count, time: Date.now() }); }
  error(err) { this.notify('error', { error: err, time: Date.now() }); }
}

module.exports = new Notification();
