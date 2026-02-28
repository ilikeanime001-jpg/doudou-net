#!/usr/bin/env node
/**
 * Web服务器 - 提供简单的网页界面
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv.includes('--port')
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1])
  : 8080;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pandora 知识网络</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .card { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    .btn:active { background: #0056b3; }
    #log { background: #f9f9f9; padding: 10px; border-radius: 5px; max-height: 300px; overflow-y: auto; font-size: 12px; }
    .received { color: #28a745; }
  </style>
</head>
<body>
  <h1>🎭 Pandora 知识网络</h1>
  
  <div class="card">
    <h3>连接状态</h3>
    <p>服务器: <input type="text" id="server" value="ws://192.168.1.156:8765" style="width:200px"></p>
    <button class="btn" onclick="connect()">连接</button>
    <button class="btn" onclick="disconnect()" style="background:#dc3545">断开</button>
  </div>
  
  <div class="card">
    <h3>已接收知识: <span id="count">0</span></h3>
    <div id="log"></div>
  </div>

  <script>
    let ws = null;
    let received = [];
    
    function log(msg, type='info') {
      const div = document.getElementById('log');
      div.innerHTML = '<div class="'+type+'">'+msg+'</div>' + div.innerHTML;
    }
    
    function connect() {
      const server = document.getElementById('server').value;
      log('连接中: ' + server);
      
      ws = new WebSocket(server);
      
      ws.onopen = () => {
        log('✅ 连接成功', 'received');
      };
      
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'knowledge_share') {
            received.push(msg.payload);
            document.getElementById('count').innerText = received.length;
            log('📥 ' + msg.payload.title, 'received');
          }
        } catch(e) {}
      };
      
      ws.onclose = () => log('❌ 连接断开');
      ws.onerror = (e) => log('❌ 错误');
    }
    
    function disconnect() {
      if (ws) ws.close();
    }
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(\`
🎭 Pandora Web 界面
http://localhost:\${PORT}
Windows 访问: http://192.168.1.156:\${PORT}
  \`);
});
