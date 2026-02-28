#!/usr/bin/env node
/**
 * 日志系统
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(dir = 'logs') {
    this.dir = dir;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }
  
  log(level, msg, data = {}) {
    const entry = {
      time: new Date().toISOString(),
      level,
      msg,
      ...data
    };
    
    const file = path.join(this.dir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(file, JSON.stringify(entry) + '\n');
    
    console.log(`[${level}] ${msg}`);
  }
  
  info(msg) { this.log('INFO', msg); }
  warn(msg) { this.log('WARN', msg); }
  error(msg) { this.log('ERROR', msg); }
}

module.exports = new Logger();
