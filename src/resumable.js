#!/usr/bin/env node
/**
 * 断点续传支持
 */

const fs = require('fs');

class ResumableTransfer {
  constructor(tempDir = 'temp') {
    this.tempDir = tempDir;
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  }
  
  saveProgress(id, progress) {
    fs.writeFileSync(`${this.tempDir}/${id}.json`, JSON.stringify(progress));
  }
  
  loadProgress(id) {
    try {
      return JSON.parse(fs.readFileSync(`${this.tempDir}/${id}.json`, 'utf-8'));
    } catch(e) { return null; }
  }
  
  clearProgress(id) {
    try {
      fs.unlinkSync(`${this.tempDir}/${id}.json`);
    } catch(e) {}
  }
}

module.exports = ResumableTransfer;
