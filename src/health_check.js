#!/usr/bin/env node
/**
 * 健康检查系统
 */

const os = require('os');

function healthCheck() {
  return {
    status: 'healthy',
    uptime: process.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    },
    cpu: os.loadavg(),
    timestamp: Date.now()
  };
}

module.exports = healthCheck;
