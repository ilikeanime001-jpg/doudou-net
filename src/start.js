#!/usr/bin/env node
/**
 * Pandora - 快速开始
 * 
 * 使用方法:
 *   node start.js                    # 启动节点
 *   node start.js --connect <addr>   # 连接其他节点
 *   node start.js --task <内容>      # 提交任务
 *   node start.js --share <知识>     # 分享知识
 */

const crypto = require('crypto');
const WebSocket = require('ws');

// 节点配置
const config = {
  node_id: crypto.randomBytes(8).toString('hex'),
  name: process.env.PANDORA_NAME || 'Doudou',
  port: 8765,
  topics: ['投资', '科技', '哲学', '生活']
};

// 消息处理
const handlers = {
  // 握手
  async handshake(data, ws) {
    console.log(`🤝 收到握手: ${data.node_id} (${data.name})`);
    return {
      type: 'handshake_response',
      payload: {
        node_id: config.node_id,
        name: config.name,
        version: '1.0.0'
      }
    };
  },
  
  // 心跳
  heartbeat(data) {
    console.log(`💓 心跳: ${data.node_id}`);
    return { type: 'heartbeat_ack' };
  },
  
  // 任务请求
  async task_request(data) {
    console.log(`📝 任务: ${data.payload.action} - ${data.payload.topic}`);
    // 这里可以接入实际处理逻辑
    return {
      type: 'task_response',
      payload: {
        task_id: data.payload.task_id,
        status: 'completed',
        result: { message: '处理完成' }
      }
    };
  },
  
  // 知识分享
  async knowledge_share(data) {
    console.log(`📚 收到知识: ${data.payload.title}`);
    return { type: 'knowledge_ack' };
  }
};

// WebSocket 服务器
function startServer() {
  const wss = new WebSocket.Server({ port: config.port });
  
  wss.on('connection', (ws) => {
    console.log(`🔗 新连接: ${ws.socket.remoteAddress}`);
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        const handler = handlers[data.type];
        
        if (handler) {
          const response = await handler(data, ws);
          if (response) {
            ws.send(JSON.stringify(response));
          }
        }
      } catch (e) {
        console.error('❌ 消息处理错误:', e.message);
      }
    });
    
    // 发送握手
    ws.send(JSON.stringify({
      type: 'handshake',
      payload: { node_id: config.node_id, name: config.name }
    }));
  });
  
  console.log(`
╔════════════════════════════════════════╗
║         🎭 Pandora Node               ║
╠════════════════════════════════════════╣
║  节点ID: ${config.node_id}     
║  名称: ${config.name}
║  端口: ${config.port}                      
║  主题: ${config.topics.join(', ')}
╚════════════════════════════════════════╝
  `);
}

// 连接到其他节点
function connectTo(address) {
  const ws = new WebSocket(address);
  
  ws.on('open', () => {
    console.log(`🔗 已连接到: ${address}`);
    ws.send(JSON.stringify({
      type: 'handshake',
      payload: { node_id: config.node_id, name: config.name }
    }));
  });
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log(`📨 收到: ${msg.type}`);
  });
}

// 提交任务
function submitTask(task) {
  const ws = new WebSocket('ws://localhost:8765');
  
  ws.on('open', () => {
    ws.send(JSON.stringify({
      type: 'task_request',
      sender: config.node_id,
      payload: {
        task_id: crypto.randomUUID(),
        action: 'analyze',
        topic: task,
        requirements: { min_trust: 0.5 }
      }
    }));
  });
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('📋 任务结果:', msg.payload);
    process.exit(0);
  });
}

// 分享知识
function shareKnowledge(knowledge) {
  console.log(`📤 分享知识: ${knowledge}`);
  // 实现知识广播逻辑
}

// 主入口
const args = process.argv.slice(2);
if (args.includes('--connect')) {
  const addr = args[args.indexOf('--connect') + 1];
  connectTo(addr);
} else if (args.includes('--task')) {
  const task = args[args.indexOf('--task') + 1];
  submitTask(task);
} else if (args.includes('--share')) {
  const knowledge = args[args.indexOf('--share') + 1];
  shareKnowledge(knowledge);
} else {
  startServer();
}
