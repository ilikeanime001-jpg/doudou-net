#!/usr/bin/env node
/**
 * DoudouNet 状态监控
 */

const fs = require('fs');
const { exec } = require('child_process');

console.log('🎭 DoudouNet 状态监控');
console.log('==================\n');

// 1. 检查知识库
console.log('📚 知识库状态:');
try {
  const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));
  console.log(`   知识包: ${packets.length} 个`);
  
  const topics = {};
  packets.forEach(p => { topics[p.topic] = (topics[p.topic] || 0) + 1; });
  console.log('   主题分布:');
  for (const [t, c] of Object.entries(topics)) {
    console.log(`     - ${t}: ${c}`);
  }
} catch(e) {
  console.log('   ❌ 未找到知识包');
}

// 2. 检查节点身份
console.log('\n🔑 节点身份:');
try {
  const id = JSON.parse(fs.readFileSync('config/identity.json', 'utf-8'));
  console.log(`   Node ID: ${id.node_id}`);
  console.log(`   创建时间: ${id.created_at}`);
} catch(e) {
  console.log('   ❌ 未找到身份');
}

// 3. 检查网络连接
console.log('\n🌐 网络连接:');
exec('netstat -an | grep 8765 | grep ESTABLISHED', (err, stdout) => {
  const lines = stdout.trim().split('\n').filter(l => l);
  console.log(`   活跃连接: ${lines.length}`);
  
  if (lines.length > 0) {
    lines.forEach(l => {
      const parts = l.split(/\s+/);
      const local = parts[3];
      const remote = parts[4];
      console.log(`   - ${remote.split(':').slice(0,2).join(':')}`);
    });
  }
  
  console.log('\n✅ 监控完成');
});
