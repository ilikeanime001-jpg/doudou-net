#!/usr/bin/env node
/**
 * DoudouNet 简单服务器示例
 * A simple server example for DoudouNet
 */

const WebSocket = require('ws');

const PORT = process.argv.includes('--port') 
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1]) 
  : 8765;

const wss = new WebSocket.Server({ port: PORT });

console.log(`
🎯 DoudouNet 简单服务器
   端口: ${PORT}
   按 Ctrl+C 停止
`);

wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log(`✅ 新连接: ${clientIP}`);
  
  ws.on('message', (message) => {
    console.log(`📩 收到: ${message}`);
    
    // 回应
    ws.send(JSON.stringify({
      type: 'welcome',
      message: '欢迎连接到 DoudouNet!',
      time: Date.now()
    }));
  });
  
  ws.on('close', () => {
    console.log(`❌ 断开: ${clientIP}`);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 停止服务器');
  wss.close();
  process.exit(0);
});
