#!/usr/bin/env node
/**
 * DoudouNet 简单客户端示例
 * A simple client example for DoudouNet
 */

const WebSocket = require('ws');

const SERVER = process.argv[2] || 'ws://localhost:8765';

console.log(`
🎯 DoudouNet 简单客户端
   连接: ${SERVER}
`);

const ws = new WebSocket(SERVER);

ws.on('open', () => {
  console.log('✅ 已连接!');
  
  // 发送消息
  ws.send(JSON.stringify({
    type: 'hello',
    message: '你好，DoudouNet!',
    time: Date.now()
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log(`📩 收到: ${JSON.stringify(msg)}`);
});

ws.on('close', () => {
  console.log('❌ 连接关闭');
});

ws.on('error', (err) => {
  console.error('❌ 错误:', err.message);
});
