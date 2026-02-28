#!/usr/bin/env node
/**
 * 2.1 本地知识扫描
 * 扫描本地知识库，提取可共享的知识
 */

const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIRS = [
  '/Users/doudou/.openclaw/workspace/knowledge',
  '/Users/doudou/.openclaw/workspace/knowledge/investment',
  '/Users/doudou/.openclaw/workspace/knowledge/study',
  '/Users/doudou/.openclaw/workspace/memory'
];

// 知识类型映射
const TOPIC_MAP = {
  'investment': '投资',
  'study': '学习',
  'memory': '记忆',
  'preferences': '偏好',
  'goals': '目标',
  'operations': '操作'
};

function scanDirectory(dirPath, basePath = '') {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    return results;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 递归扫描子目录
      results.push(...scanDirectory(fullPath, path.join(basePath, file)));
    } else if (file.endsWith('.md') || file.endsWith('.html')) {
      // 读取文件内容
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = path.join(basePath, file);
        
        // 提取标题（从第一个 # 或 <title>）
        let title = file.replace(/\.(md|html)$/, '');
        const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/<title>(.+?)<\/title>/i);
        if (titleMatch) {
          title = titleMatch[1];
        }
        
        // 生成摘要 (前200字)
        const summary = content.substring(0, 200).replace(/[#*`\n]/g, ' ').trim() + '...';
        
        // 确定主题
        let topic = 'general';
        for (const [key, value] of Object.entries(TOPIC_MAP)) {
          if (relativePath.toLowerCase().includes(key)) {
            topic = value;
            break;
          }
        }
        
        results.push({
          id: Buffer.from(fullPath).toString('base64').substring(0, 16),
          title,
          summary,
          topic,
          tags: extractTags(content),
          source_file: relativePath,
          created_at: stat.birthtime.getTime(),
          updated_at: stat.mtime.getTime()
        });
      } catch (e) {
        // 忽略读取错误
      }
    }
  }
  
  return results;
}

function extractTags(content) {
  const tags = [];
  
  // 从 #标签 中提取
  const hashTags = content.match(/#[a-zA-Z0-9_]+/g) || [];
  tags.push(...hashTags.map(t => t.substring(1)));
  
  // 从 frontmatter 提取
  const yamlMatch = content.match(/tags:\s*\[(.*?)\]/);
  if (yamlMatch) {
    tags.push(...yamlMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')));
  }
  
  return [...new Set(tags)].slice(0, 5); // 最多5个标签
}

// 扫描本地知识库
function scanKnowledge() {
  console.log('🔍 扫描本地知识库...\n');
  
  const allKnowledge = [];
  
  for (const dir of KNOWLEDGE_DIRS) {
    if (fs.existsSync(dir)) {
      console.log(`📂 扫描: ${dir}`);
      const results = scanDirectory(dir, dir.split('/').pop());
      console.log(`   找到 ${results.length} 个文件`);
      allKnowledge.push(...results);
    }
  }
  
  console.log(`\n✅ 共扫描到 ${allKnowledge.length} 个知识条目`);
  
  return allKnowledge;
}

// 导出
module.exports = { scanKnowledge, scanDirectory };

// 命令行运行
if (require.main === module) {
  const basePath = path.join(__dirname, '..');
  const knowledge = scanKnowledge(basePath);
  
  // 保存到文件
  const outputPath = path.join(__dirname, '..', 'config', 'knowledge_index.json');
  fs.writeFileSync(outputPath, JSON.stringify(knowledge, null, 2));
  console.log(`\n💾 知识索引已保存到: ${outputPath}`);
}
