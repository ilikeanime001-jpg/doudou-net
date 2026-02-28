#!/usr/bin/env node
/**
 * 快速连接客户端 - 自动保存知识
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/Users/doudou/.openclaw/workspace/projects/pandora/config';
const RECEIVED_FILE = path.join(DATA_DIR, 'knowledge_received.json');

let received = [];
try {
  if (fs.existsSync(RECEIVED_FILE)) {
    received = JSON.parse(fs.readFileSync(RECEIVED_FILE, 'utf-8'));
  }
} catch(e) {}

// 命令行参数
const serverAddr = process.argv[2] || 'ws://192.168.1.95:8765';

console.log(`🔗 连接到: ${serverAddr}`);
console.log(`📂 已加载: ${received.length} 条知识`);

const ws = new WebSocket(serverAddr);

ws.on('open', () => {
  console.log('✅ 连接成功!');
  
  ws.send(JSON.stringify({
    type: 'handshake',
    payload: { node_id: 'quick-client', name: 'Quick Client', version: '1.0.0' }
  }));
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString());
    
    if (msg.type === 'knowledge_share') {
      const k = msg.payload;
      const exists = received.some(r => r.id === k.id);
      
      if (!exists) {
        received.push({
          id: k.id,
          title: k.title,
          summary: k.summary,
          topic: k.topic,
          source_name: k.source?.node_name,
          received_at: Date.now()
        });
        
        console.log(`📥 ${k.title}`);
        
        // 自动保存
        fs.writeFileSync(RECEIVED_FILE, JSON.stringify(received, null, 2));
      }
    }
  } catch(e) {}
});

ws.on('close', () => {
  console.log(`\n👋 连接断开`);
  console.log(`💾 共收到 ${received.length} 条知识`);
});

ws.on('error', (e) => {
  console.error(`❌ 错误: ${e.message}`);
});
