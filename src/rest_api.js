#!/usr/bin/env node
/**
 * REST API 服务器 - 提供HTTP接口
 */

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.argv.includes('--port') 
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1]) 
  : 3000;

// 加载知识
let knowledge = [];
try {
  knowledge = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));
} catch(e) {}

const routes = {
  'GET /api/knowledge': () => knowledge,
  'GET /api/knowledge/:id': (id) => knowledge.find(k => k.id === id),
  'GET /api/stats': () => ({
    total: knowledge.length,
    topics: knowledge.reduce((a, k) => { a[k.topic] = (a[k.topic] || 0) + 1; return a; }, {})
  }),
  'GET /health': () => ({ status: 'ok', time: Date.now() })
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  // 路由匹配
  for (const [route, handler] of Object.entries(routes)) {
    const [method, routePath] = route.split(' ');
    
    if (req.method === method && path === routePath) {
      res.end(JSON.stringify(handler()));
      return;
    }
    
    // 参数路由
    if (method === 'GET' && routePath.includes(':')) {
      const base = routePath.replace('/:id', '');
      if (path.startsWith(base)) {
        const id = path.split('/').pop();
        res.end(JSON.stringify(handler(id)));
        return;
      }
    }
  }
  
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🎭 REST API: http://localhost:${PORT}`);
  console.log('   /api/knowledge - 知识列表');
  console.log('   /api/stats     - 统计');
  console.log('   /health       - 健康检查');
});
