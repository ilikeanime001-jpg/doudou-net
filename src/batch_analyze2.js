#!/usr/bin/env node
/**
 * 知识分析 - 过滤颜色标签
 */

const fs = require('fs');

const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));

console.log('📊 Pandora 知识分析报告');
console.log('='.repeat(40));
console.log(`\n总数: ${packets.length} 条知识\n`);

// 按主题
console.log('📂 主题分布:');
const topics = {};
packets.forEach(p => { topics[p.topic] = (topics[p.topic] || 0) + 1; });
Object.entries(topics).sort((a,b) => b[1]-a[1]).forEach(([t, c]) => {
  const bar = '█'.repeat(Math.ceil(c/10));
  console.log(`  ${t}: ${c} ${bar}`);
});

// 有效标签 (过滤颜色代码)
console.log('\n🏷️ 热门标签:');
const tags = {};
packets.forEach(p => {
  (p.tags || []).forEach(t => {
    // 过滤颜色代码
    if (!t.match(/^#[0-9a-fA-F]{3,6}$/) && t.length > 1) {
      tags[t] = (tags[t] || 0) + 1;
    }
  });
});
Object.entries(tags).sort((a,b) => b[1]-a[1]).slice(0,15).forEach(([t,c]) => {
  console.log(`  #${t}: ${c}`);
});

// 来源分析
console.log('\n👤 来源:');
const sources = {};
packets.forEach(p => {
  const s = p.source?.node_name || '未知';
  sources[s] = (sources[s] || 0) + 1;
});
Object.entries(sources).forEach(([s,c]) => console.log(`  ${s}: ${c}`));

// 置信度
console.log('\n📈 质量分布:');
const q = { h: 0, m: 0, l: 0 };
packets.forEach(p => {
  const c = p.metadata?.confidence || 0.5;
  if (c >= 0.7) q.h++;
  else if (c >= 0.4) q.m++;
  else q.l++;
});
console.log(`  高质量: ${q.h} (${Math.round(q.h/packets.length*100)}%)`);
console.log(`  中质量: ${q.m} (${Math.round(q.m/packets.length*100)}%)`);
console.log(`  低质量: ${q.l} (${Math.round(q.l/packets.length*100)}%)`);

console.log('\n' + '='.repeat(40));
