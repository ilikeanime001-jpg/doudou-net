#!/usr/bin/env node
/**
 * 批量分析知识
 */

const fs = require('fs');

const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));

console.log('📊 知识分析报告');
console.log('================\n');

console.log(`总数: ${packets.length}\n`);

// 按主题
const topics = {};
packets.forEach(p => { topics[p.topic] = (topics[p.topic] || 0) + 1; });
console.log('按主题:');
for (const [t, c] of Object.entries(topics)) {
  console.log(`  ${t}: ${c}`);
}

// 按标签
const tags = {};
packets.forEach(p => {
  (p.tags || []).forEach(t => { tags[t] = (tags[t] || 0) + 1; });
});
console.log('\n热门标签:');
Object.entries(tags).sort((a,b) => b[1]-a[1]).slice(0,10).forEach(([t,c]) => {
  console.log(`  #${t}: ${c}`);
});

// 置信度分布
const confidence = { high: 0, mid: 0, low: 0 };
packets.forEach(p => {
  const c = p.metadata?.confidence || 0.5;
  if (c >= 0.7) confidence.high++;
  else if (c >= 0.4) confidence.mid++;
  else confidence.low++;
});
console.log('\n置信度:');
console.log(`  高(>0.7): ${confidence.high}`);
console.log(`  中(0.4-0.7): ${confidence.mid}`);
console.log(`  低(<0.4): ${confidence.low}`);
