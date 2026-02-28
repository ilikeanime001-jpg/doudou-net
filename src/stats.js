#!/usr/bin/env node
/**
 * 知识统计报告
 */

const fs = require('fs');

const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));

console.log('═'.repeat(50));
console.log('🎭 DoudouNet 知识统计报告');
console.log('═'.repeat(50));

console.log(`\n📚 总知识: ${packets.length}`);

// 主题统计
const topics = {};
packets.forEach(p => { topics[p.topic] = (topics[p.topic] || 0) + 1; });

console.log('\n📂 主题分布:');
Object.entries(topics).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => {
  const pct = Math.round(c/packets.length*100);
  console.log(`  ${t}: ${c} (${pct}%)`);
});

// 时间分布
const months = {};
packets.forEach(p => {
  const m = new Date(p.metadata?.created_at || Date.now()).toLocaleString('zh-CN', { year: 'numeric', month: 'short' });
  months[m] = (months[m] || 0) + 1;
});

console.log('\n📅 时间分布:');
Object.entries(months).forEach(([m,c]) => console.log(`  ${m}: ${c}`));

// 质量
const avgConf = packets.reduce((s,p) => s + (p.metadata?.confidence||0), 0) / packets.length;
console.log(`\n⭐ 平均质量: ${(avgConf*100).toFixed(1)}%`);

console.log('\n' + '═'.repeat(50));
