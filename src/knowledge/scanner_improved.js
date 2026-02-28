#!/usr/bin/env node
/**
 * 改进版知识扫描器 - 更好的标签提取
 */

const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIRS = [
  '/Users/doudou/.openclaw/workspace/knowledge',
  '/Users/doudou/.openclaw/workspace/knowledge/investment',
  '/Users/doudou/.openclaw/workspace/knowledge/study',
  '/Users/doudou/.openclaw/workspace/memory'
];

// 有效标签模式
const VALID_TAG_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{1,20}$/;

function extractTags(content) {
  const tags = new Set();
  
  // 从 #标签 提取 (排除颜色代码)
  const hashTags = content.match(/#[a-zA-Z][a-zA-Z0-9_]*/g) || [];
  hashTags.forEach(t => {
    const tag = t.substring(1);
    if (VALID_TAG_PATTERN.test(tag)) {
      tags.add(tag);
    }
  });
  
  // 从 frontmatter 提取
  const yamlMatch = content.match(/tags:\s*\[(.*?)\]/s);
  if (yamlMatch) {
    yamlMatch[1].split(',').forEach(t => {
      const tag = t.trim().replace(/['"]/g, '');
      if (VALID_TAG_PATTERN.test(tag)) {
        tags.add(tag);
      }
    });
  }
  
  // 从标题提取关键词
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    const words = titleMatch[1].split(/[,，、\s]+/);
    words.slice(0, 3).forEach(w => {
      if (w.length > 2 && VALID_TAG_PATTERN.test(w)) {
        tags.add(w);
      }
    });
  }
  
  return [...tags].slice(0, 5);
}

function scanImproved() {
  console.log('🔍 改进版扫描...\n');
  
  let count = 0;
  
  KNOWLEDGE_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    function walk(d, base = '') {
      const files = fs.readdirSync(d);
      files.forEach(f => {
        const full = path.join(d, f);
        const stat = fs.statSync(full);
        
        if (stat.isDirectory()) {
          walk(full, path.join(base, f));
        } else if (f.endsWith('.md') || f.endsWith('.html')) {
          try {
            const content = fs.readFileSync(full, 'utf-8');
            const tags = extractTags(content);
            if (tags.length > 0) {
              count++;
              if (count <= 5) {
                console.log(`  ${f}: ${tags.join(', ')}`);
              }
            }
          } catch(e) {}
        }
      });
    }
    walk(dir);
  });
  
  console.log(`\n✅ 共提取 ${count} 个有效标签`);
}

scanImproved();
