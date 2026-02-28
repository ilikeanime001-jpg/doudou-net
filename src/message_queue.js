#!/usr/bin/env node
/**
 * 消息队列 - 离线消息存储
 */

const fs = require('fs');

class MessageQueue {
  constructor(file = 'config/message_queue.json') {
    this.file = file;
    this.queue = this.load();
  }
  
  load() {
    try {
      return JSON.parse(fs.readFileSync(this.file, 'utf-8'));
    } catch(e) { return []; }
  }
  
  save() {
    fs.writeFileSync(this.file, JSON.stringify(this.queue, null, 2));
  }
  
  add(msg) {
    this.queue.push({ ...msg, timestamp: Date.now() });
    this.save();
  }
  
  get(peerId) {
    return this.queue.filter(m => m.to === peerId);
  }
  
  remove(id) {
    this.queue = this.queue.filter(m => m.id !== id);
    this.save();
  }
}

module.exports = MessageQueue;
