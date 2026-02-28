#!/usr/bin/env node
/**
 * 配置管理器
 */

const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor(defaults = {}) {
    this.defaults = defaults;
    this.config = { ...defaults };
  }
  
  load(file = 'config/default.json') {
    try {
      const user = JSON.parse(fs.readFileSync(file, 'utf-8'));
      this.config = { ...this.defaults, ...user };
    } catch(e) {
      this.config = { ...this.defaults };
    }
    return this.config;
  }
  
  save(file = 'config/user.json') {
    fs.writeFileSync(file, JSON.stringify(this.config, null, 2));
  }
  
  get(key) { return this.config[key]; }
  set(key, value) { this.config[key] = value; }
}

module.exports = ConfigManager;
