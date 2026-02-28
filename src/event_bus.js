#!/usr/bin/env node
/**
 * 事件总线
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
  
  off(event, callback) {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const callbacks = this.listeners.get(event) || [];
      this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
}

module.exports = new EventBus();
