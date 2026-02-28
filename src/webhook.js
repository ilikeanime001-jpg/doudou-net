#!/usr/bin/env node
/**
 * Webhook 系统
 */

const https = require('https');
const http = require('http');

class Webhook {
  constructor() {
    this.hooks = new Map();
  }
  
  register(event, url) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push(url);
    console.log(`🪝 注册Webhook: ${event} -> ${url}`);
  }
  
  async trigger(event, data) {
    const urls = this.hooks.get(event) || [];
    const results = await Promise.allSettled(
      urls.map(url => this.send(url, { event, data, timestamp: Date.now() }))
    );
    return results;
  }
  
  send(url, payload) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }
}

module.exports = new Webhook();
