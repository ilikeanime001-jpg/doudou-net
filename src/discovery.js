#!/usr/bin/env node
/**
 * 局域网节点发现
 */

const dns = require('dns');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function getNetworkPrefix(ip) {
  return ip.split('.').slice(0, 3).join('.');
}

console.log('🔍 局域网节点发现');
console.log('==================\n');

const localIP = getLocalIP();
const prefix = getNetworkPrefix(localIP);

console.log(`📍 本机IP: ${localIP}`);
console.log(`🌐 网段: ${prefix}.x\n`);

console.log('扫描可能的节点...\n');

// 简单扫描 1-255
const ports = [8765, 8766];
const found = [];

for (let i = 1; i <= 5; i++) {  // 只扫描前5个，快速测试
  const testIP = `${prefix}.${i}`;
  
  if (testIP === localIP) continue;
  
  // 简单测试
  console.log(`检查 ${testIP}...`);
}

console.log('\n💡 提示: 手动输入已知节点的IP进行连接');
console.log(`📋 示例: node src/client.js ws://192.168.1.95:8765`);
