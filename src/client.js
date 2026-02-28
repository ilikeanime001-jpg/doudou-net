#!/usr/bin/env node
/**
 * 1.2 客户端连接
 * 连接到其他 Pandora 节点
 * 
 * 使用: 
 *   node scripts/client.js <服务器地址>
 *   node scripts/client.js ws://localhost:8765
 */

const WebSocket = require('ws');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 加载节点身份
let identity = { node_id: 'unknown' };
try {
  const idPath = path.join(__dirname, '..', 'config', 'identity.json');
  if (fs.existsSync(idPath)) {
    identity = JSON.parse(fs.readFileSync(idPath, 'utf-8'));
  }
} catch (e) {
  console.log('⚠️ 未找到身份文件，请先运行 generate_keys.js');
}

// 服务器地址
const serverUrl = process.argv[2] || 'ws://localhost:8765';

// 消息类型
const MSG_TYPES = {
  HANDSHAKE: 'handshake',
  HANDSHAKE_ACK: 'handshake_ack',
  HEARTBEAT: 'heartbeat',
  HEARTBEAT_ACK: 'heartbeat_ack',
  PEERS_UPDATE: 'peers_update',
  KNOWLEDGE_SHARE: 'knowledge_share',
  TASK_REQUEST: 'task_request'
};

// 创建消息
function createMessage(type, payload) {
  return {
    id: crypto.randomUUID(),
    type,
    sender: identity.node_id,
    timestamp: Date.now(),
    payload
  };
}

// 消息处理
const messageHandlers = new Set();

// 连接服务器
console.log(`🔗 连接到: ${serverUrl}...`);
const ws = new WebSocket(serverUrl);

ws.on('open', () => {
  console.log('✅ 已连接!');
  
  // 发送握手
  ws.send(JSON.stringify(createMessage(MSG_TYPES.HANDSHAKE, {
    node_id: identity.node_id,
    name: identity.name || 'Pandora Node',
    version: '1.0.0',
    capabilities: ['task', 'knowledge', 'relay']
  })));
  
  // 启动心跳
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(createMessage(MSG_TYPES.HEARTBEAT, {
        node_id: identity.node_id,
        status: 'online'
      })));
    }
  }, 30000);
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString());
    
    switch (msg.type) {
      case MSG_TYPES.HANDSHAKE:
        console.log(`🤝 收到握手: ${msg.sender}`);
        // 响应握手
        ws.send(JSON.stringify(createMessage(MSG_TYPES.HANDSHAKE_ACK, {
          node_id: identity.node_id,
          name: identity.name || 'Pandora Node'
        })));
        break;
        
      case MSG_TYPES.HANDSHAKE_ACK:
        console.log(`✅ 握手成功! 远程节点: ${msg.payload.node_id}`);
        break;
        
      case MSG_TYPES.HEARTBEAT_ACK:
        // 心跳响应
        break;
        
      case MSG_TYPES.PEERS_UPDATE:
        console.log(`👥 已知节点: ${msg.payload.peers.join(', ') || '无'}`);
        break;
        
      case MSG_TYPES.KNOWLEDGE_SHARE:
        console.log(`📚 收到知识: ${msg.payload.title}`);
        messageHandlers.forEach(h => h(msg));
        break;
        
      case MSG_TYPES.TASK_REQUEST:
        console.log(`📝 收到任务: ${msg.payload.task}`);
        messageHandlers.forEach(h => h(msg));
        break;
        
      default:
        console.log(`📨 收到: ${msg.type}`);
    }
  } catch (e) {
    console.error('❌ 消息解析错误:', e.message);
  }
});

ws.on('close', () => {
  console.log('👋 连接断开');
});

ws.on('error', (err) => {
  console.error('❌ 连接错误:', err.message);
});

// 导出发送函数
module.exports = {
  send: (type, payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(createMessage(type, payload)));
    }
  },
  onMessage: (handler) => messageHandlers.add(handler),
  isConnected: () => ws.readyState === WebSocket.OPEN
};
