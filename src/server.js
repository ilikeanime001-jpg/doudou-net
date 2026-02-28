#!/usr/bin/env node
/**
 * 1.2 & 1.3 WebSocket 服务器 + 握手协议
 * DoudouNet 节点通信核心
 * 
 * 使用: 
 *   node scripts/server.js              # 启动服务器
 *   node scripts/server.js --port 8766  # 指定端口
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

// 配置
const PORT = process.argv.includes('--port') 
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1]) 
  : 8765;

// 节点状态
const peers = new Map(); // peerId -> { ws, info, lastSeen }
const messageHandlers = new Set();

// 消息类型
const MSG_TYPES = {
  HANDSHAKE: 'handshake',
  HANDSHAKE_ACK: 'handshake_ack',
  HEARTBEAT: 'heartbeat',
  HEARTBEAT_ACK: 'heartbeat_ack',
  KNOWLEDGE_SHARE: 'knowledge_share',
  KNOWLEDGE_REQUEST: 'knowledge_request',
  TASK_REQUEST: 'task_request',
  TASK_RESPONSE: 'task_response',
  DISCONNECT: 'disconnect'
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

// 生成握手消息
function createHandshake() {
  return createMessage(MSG_TYPES.HANDSHAKE, {
    node_id: identity.node_id,
    name: identity.name || 'DoudouNet Node',
    version: '1.0.0',
    capabilities: ['task', 'knowledge', 'relay'],
    port: PORT
  });
}

// 处理握手
function handleHandshake(data, ws) {
  console.log(`🤝 收到握手: ${data.node_id} (${data.name})`);
  
  // 发送握手响应
  const ack = createMessage(MSG_TYPES.HANDSHAKE_ACK, {
    node_id: identity.node_id,
    name: identity.name || 'DoudouNet Node',
    version: '1.0.0',
    capabilities: ['task', 'knowledge', 'relay']
  });
  
  ws.send(JSON.stringify(ack));
  
  // 保存 peer
  peers.set(data.node_id, {
    ws,
    info: data,
    lastSeen: Date.now()
  });
  
  console.log(`✅ 已连接: ${data.node_id}`);
  broadcastPeers();
}

// 处理心跳
function handleHeartbeat(data, ws) {
  const peer = peers.get(data.node_id);
  if (peer) {
    peer.lastSeen = Date.now();
  }
  
  // 响应心跳
  ws.send(JSON.stringify(createMessage(MSG_TYPES.HEARTBEAT_ACK, {
    node_id: identity.node_id
  })));
}

// 广播当前 peers 列表
function broadcastPeers() {
  const peerList = Array.from(peers.keys());
  const msg = createMessage('peers_update', { peers: peerList });
  
  peers.forEach(peer => {
    if (peer.ws.readyState === WebSocket.OPEN) {
      peer.ws.send(JSON.stringify(msg));
    }
  });
}

// 消息分发
function dispatchMessage(message, ws) {
  const { type, payload } = message;
  
  switch (type) {
    case MSG_TYPES.HANDSHAKE:
      handleHandshake(payload, ws);
      break;
    case MSG_TYPES.HEARTBEAT:
      handleHeartbeat(payload, ws);
      break;
    case MSG_TYPES.KNOWLEDGE_SHARE:
      console.log(`📚 收到知识分享: ${payload.title}`);
      messageHandlers.forEach(h => h(message));
      break;
    case MSG_TYPES.TASK_REQUEST:
      console.log(`📝 收到任务: ${payload.task}`);
      messageHandlers.forEach(h => h(message));
      break;
    default:
      console.log(`📨 收到消息: ${type}`);
  }
}

// 启动服务器
function startServer() {
  const wss = new WebSocket.Server({ port: PORT });
  
  console.log(`
╔════════════════════════════════════════╗
║         🎭 DoudouNet Node               ║
║         WebSocket 服务器              ║
╠════════════════════════════════════════╣
║  节点ID: ${identity.node_id}   
║  端口: ${PORT}                          
║  状态: 等待连接...                     
╚════════════════════════════════════════╝
  `);
  
  wss.on('connection', (ws, req) => {
    console.log(`🔗 新连接: ${req.socket.remoteAddress}`);
    
    // 发送握手
    ws.send(JSON.stringify(createHandshake()));
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        dispatchMessage(message, ws);
      } catch (e) {
        console.error('❌ 消息解析错误:', e.message);
      }
    });
    
    ws.on('close', () => {
      // 移除断开的 peer
      peers.forEach((peer, id) => {
        if (peer.ws === ws) {
          peers.delete(id);
          console.log(`👋 节点断开: ${id}`);
        }
      });
      broadcastPeers();
    });
    
    ws.on('error', (err) => {
      console.error('❌ 连接错误:', err.message);
    });
  });
  
  // 心跳检查 (每30秒)
  setInterval(() => {
    const now = Date.now();
    peers.forEach((peer, id) => {
      if (now - peer.lastSeen > 90000) { // 90秒超时
        console.log(`⚠️ 节点超时: ${id}`);
        peers.delete(id);
      }
    });
  }, 30000);
  
  return wss;
}

// 导出
module.exports = {
  MSG_TYPES,
  createMessage,
  peers,
  onMessage: (handler) => messageHandlers.add(handler),
  send: (nodeId, message) => {
    const peer = peers.get(nodeId);
    if (peer && peer.ws.readyState === WebSocket.OPEN) {
      peer.ws.send(JSON.stringify(message));
    }
  },
  broadcast: (message) => {
    peers.forEach(peer => {
      if (peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(JSON.stringify(message));
      }
    });
  }
};

// 主入口
if (require.main === module) {
  startServer();
}
