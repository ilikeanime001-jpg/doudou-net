#!/usr/bin/env node
/**
 * 带自动重连的客户端
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/Users/doudou/.openclaw/workspace/projects/pandora/config';
const RECEIVED_FILE = path.join(DATA_DIR, 'knowledge_received.json');

let received = [];
try {
  received = JSON.parse(fs.readFileSync(RECEIVED_FILE, 'utf-8'));
} catch(e) {}

// 配置
const serverAddr = process.argv[2] || 'ws://192.168.1.95:8765';
const RECONNECT_DELAY = 5000; // 5秒重连

let ws = null;
let connected = false;

function connect() {
  console.log(`🔗 连接到: ${serverAddr}`);
  ws = new WebSocket(serverAddr);
  
  ws.on('open', () => {
    connected = true;
    console.log('✅ 已连接');
    
    ws.send(JSON.stringify({
      type: 'handshake',
      payload: { node_id: 'auto-client', name: 'Auto Client', version: '1.0.0' }
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
            topic: k.topic,
            received_at: Date.now()
          });
          
          console.log(`📥 ${k.title}`);
          fs.writeFileSync(RECEIVED_FILE, JSON.stringify(received, null, 2));
        }
      }
      
      if (msg.type === 'handshake') {
        console.log(`🤝 节点: ${msg.payload.name}`);
      }
    } catch(e) {}
  });
  
  ws.on('close', () => {
    connected = false;
    console.log('❌ 连接断开，5秒后重连...');
    setTimeout(connect, RECONNECT_DELAY);
  });
  
  ws.on('error', (e) => {
    console.log(`⚠️ ${e.message}`);
  });
}

console.log('🎭 自动重连客户端');
console.log('==================\n');

connect();

// 保持进程
process.on('SIGINT', () => {
  console.log('\n👋 退出');
  fs.writeFileSync(RECEIVED_FILE, JSON.stringify(received, null, 2));
  console.log(`💾 已保存 ${received.length} 条知识`);
  process.exit(0);
});
