#!/usr/bin/env node
/**
 * DoudouNet 知识广播服务器 V2
 * 使用蒸馏后的知识
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = process.argv.includes('--port') 
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1]) 
  : 8767;

// 支持两种格式
const distilledFile = '/Users/doudou/.openclaw/workspace/projects/pandora/config/knowledge_distilled_v2.json';
const originalFile = '/Users/doudou/.openclaw/workspace/projects/pandora/config/knowledge_packets.json';

let packets = [];

// 优先使用蒸馏版本
try {
  if (fs.existsSync(distilledFile)) {
    packets = JSON.parse(fs.readFileSync(distilledFile, 'utf-8'));
    console.log(`📚 加载蒸馏知识: ${packets.length} 条 (V2)`);
  }
} catch(e) {
  console.log('⚠️ 蒸馏版本加载失败，尝试原始版本...');
  try {
    packets = JSON.parse(fs.readFileSync(originalFile, 'utf-8'));
    console.log(`📚 加载原始知识: ${packets.length} 条`);
  } catch(e2) {
    console.log('❌ 无法加载知识包');
    process.exit(1);
  }
}

const wss = new WebSocket.Server({ port: PORT });

console.log(`
╔════════════════════════════════════════╗
║   🎯 DoudouNet 知识广播服务器 V2       ║
╠════════════════════════════════════════╣
║  端口: ${PORT}
║  知识: ${packets.length} 条
║  版本: 蒸馏 V2.1
╚════════════════════════════════════════╝
`);

const clients = new Set();

wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  clients.add(ws);
  console.log(`✅ 客户端连接: ${clientIP} (总计: ${clients.size})`);
  
  // 立即广播所有知识
  let sent = 0;
  for (const packet of packets) {
    ws.send(JSON.stringify({
      type: 'knowledge_share',
      payload: packet
    }));
    sent++;
  }
  console.log(`📤 已发送 ${sent} 条知识到 ${clientIP}`);
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`❌ 客户端断开: ${clientIP} (剩余: ${clients.size})`);
  });
  
  ws.on('error', (err) => {
    console.error(`❌ 错误: ${err.message}`);
  });
});

console.log('🎯 等待连接...');
