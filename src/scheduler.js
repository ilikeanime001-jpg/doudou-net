#!/usr/bin/env node
/**
 * 定时任务调度器
 */

class Scheduler {
  constructor() {
    this.tasks = new Map();
  }
  
  schedule(cron, fn, name) {
    // 简单实现: 每分钟检查
    const interval = setInterval(fn, 60000);
    this.tasks.set(name, interval);
    console.log(`📅 任务已安排: ${name}`);
  }
  
  cancel(name) {
    const interval = this.tasks.get(name);
    if (interval) {
      clearInterval(interval);
      this.tasks.delete(name);
    }
  }
  
  stopAll() {
    this.tasks.forEach((interval, name) => {
      clearInterval(interval);
    });
    this.tasks.clear();
  }
}

module.exports = Scheduler;
