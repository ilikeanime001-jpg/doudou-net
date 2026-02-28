#!/usr/bin/env node
/**
 * 知识导出工具
 */

const fs = require('fs');
const path = require('path');

const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));

// 导出为 Markdown
function exportMarkdown() {
  let md = '# Pandora 知识库\n\n';
  
  const topics = {};
  packets.forEach(p => {
    if (!topics[p.topic]) topics[p.topic] = [];
    topics[p.topic].push(p);
  });
  
  for (const [topic, items] of Object.entries(topics)) {
    md += `\n## ${topic}\n\n`;
    items.forEach(k => {
      md += `### ${k.title}\n\n`;
      md += `${k.summary || ''}\n\n`;
      md += `---\n\n`;
    });
  }
  
  fs.writeFileSync('exports/knowledge.md', md);
  console.log('✅ 导出为 Markdown: exports/knowledge.md');
}

// 导出为 JSON
function exportJSON() {
  fs.writeFileSync('exports/knowledge.json', JSON.stringify(packets, null, 2));
  console.log('✅ 导出为 JSON: exports/knowledge.json');
}

// 导出为 CSV
function exportCSV() {
  let csv = '标题,主题,标签,来源,置信度\n';
  packets.forEach(p => {
    const tags = (p.tags || []).join(';');
    csv += `"${p.title}","${p.topic}","${tags}","${p.source?.node_name || ''}",${p.metadata?.confidence || 0}\n`;
  });
  fs.writeFileSync('exports/knowledge.csv', csv);
  console.log('✅ 导出为 CSV: exports/knowledge.csv');
}

// 创建导出目录
if (!fs.existsSync('exports')) {
  fs.mkdirSync('exports');
}

exportMarkdown();
exportJSON();
exportCSV();
