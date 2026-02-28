#!/usr/bin/env node
/**
 * DoudouNet 知识广播服务器
 * 自动向连接的客户端发送知识
 */

const WebSocket = require('ws');
const fs = require('fs');

const PORT = process.argv.includes('--port')
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1])
  : 8765;

// 加载知识包
const packetsFile = '/Users/doudou/.openclaw/workspace/projects/pandora/config/knowledge_packets.json';
let packets = [];
try {
  packets = JSON.parse(fs.readFileSync(packetsFile, 'utf-8'));
  console.log(`📚 加载了 ${packets.length} 个知识包`);
} catch(e) {
  console.log('⚠️ 未找到知识包，请先运行: node src/knowledge/index.js');
  process.exit(1);
}

const wss = new WebSocket.Server({ port: PORT });

console.log(`
╔════════════════════════════════════════╗
║     🎭 DoudouNet 知识广播服务器          ║
╠════════════════════════════════════════╣
║  端口: ${PORT}                         
║  知识: ${packets.length} 个                   
║  状态: 等待连接...                     
╚════════════════════════════════════════╝
`);

let clientCount = 0;

wss.on('connection', (ws) => {
  clientCount++;
  console.log(`🔗 客户端 #${clientCount} 已连接`);
  
  // 发送握手
  ws.send(JSON.stringify({
    type: 'handshake',
    payload: { node_id: 'broadcast-server', name: 'DoudouNet Knowledge Hub', version: '1.0.0' }
  }));
  
  // 自动广播知识
  let sent = 0;
  console.log(`📤 开始向客户端 #${clientCount} 发送知识...`);
  
  packets.forEach((p, i) => {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'knowledge_share',
        sender: 'pandora-hub',
        payload: p
      }));
      sent++;
      
      if (sent === packets.length) {
        console.log(`✅ 已向客户端 #${clientCount} 发送 ${sent} 个知识包`);
      }
    }, i * 50);
  });
  
  ws.on('close', () => {
    console.log(`👋 客户端 #${clientCount} 断开连接`);
  });
  
  ws.on('error', (e) => {
    console.log(`❌ 客户端 #${clientCount} 错误: ${e.message}`);
  });
});

wss.on('error', (e) => {
  console.log(`❌ 服务器错误: ${e.message}`);
});
