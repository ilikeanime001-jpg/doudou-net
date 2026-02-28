#!/usr/bin/env node
/**
 * 综合仪表板
 */

const fs = require('fs');

function generateDashboard() {
  const knowledge = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));
  
  const stats = {
    total: knowledge.length,
    topics: {},
    avgConfidence: 0,
    nodes: 2 // 简化
  };
  
  knowledge.forEach(k => {
    stats.topics[k.topic] = (stats.topics[k.topic] || 0) + 1;
    stats.avgConfidence += k.metadata?.confidence || 0.5;
  });
  stats.avgConfidence /= knowledge.length;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pandora Dashboard</title>
  <style>
    body { font-family: -apple-system; padding: 20px; background: #f5f5f5; }
    .card { background: white; padding: 20px; margin: 10px 0; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; }
    .stat { font-size: 36px; color: #007bff; font-weight: bold; }
    .topic { display: inline-block; background: #e9ecef; padding: 5px 10px; margin: 5px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>🎭 Pandora Dashboard</h1>
  
  <div class="card">
    <h2>概览</h2>
    <div class="stat">${stats.total}</div>
    <p>知识总数</p>
  </div>
  
  <div class="card">
    <h2>主题分布</h2>
    ${Object.entries(stats.topics).map(([t, c]) => `<span class="topic">${t}: ${c}</span>`).join('')}
  </div>
  
  <div class="card">
    <h2>质量</h2>
    <div class="stat">${(stats.avgConfidence * 100).toFixed(1)}%</div>
    <p>平均置信度</p>
  </div>
  
  <div class="card">
    <h2>连接</h2>
    <div class="stat">${stats.nodes}</div>
    <p>活跃节点</p>
  </div>
</body>
</html>`;
  
  fs.writeFileSync('dashboard.html', html);
  console.log('✅ 仪表板已生成: dashboard.html');
}

generateDashboard();
