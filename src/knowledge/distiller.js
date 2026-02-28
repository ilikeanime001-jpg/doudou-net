#!/usr/bin/env node
/**
 * 2.2 知识蒸馏
 * 移除敏感信息，提炼核心要点
 */

const crypto = require('crypto');

// 敏感信息模式
const SENSITIVE_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // 邮箱
  /(\+?41|0)[0-9]{9,10}/g, // 瑞士电话
  /\+?[0-9]{10,15}/g, // 电话号码
  /[0-9]{4,6}[-\s]?[0-9]{4,6}/g, // 信用卡/ID
  /password[=:]\s*\S+/gi, // 密码
  /api[_-]?key[=:]\s*\S+/gi, // API密钥
  /secret[=:]\s*\S+/gi, // 密钥
  /[A-Z]{1,2}[0-9]{2,}[A-Z]{2,}/g, // 车牌
];

// 需要移除的章节
const REMOVE_SECTIONS = [
  /## 📝 偏好历史[\s\S]*?(?=##|$)/,
  /## 🚫 禁忌事项[\s\S]*?(?=##|$)/,
  /## 💰 投资偏好[\s\S]*?(?=##|$)/, // 保留一般投资原则
];

function anonymizePhone(match) {
  return '[电话]';
}

function anonymizeEmail(match) {
  return '[邮箱]';
}

function distilKnowledge(knowledgeItem) {
  // 复制一份
  const distilled = { ...knowledgeItem };
  
  // 1. 移除敏感信息
  if (distilled.content) {
    let content = distilled.content;
    
    // 移除邮箱
    content = content.replace(SENSITIVE_PATTERNS[0], anonymizeEmail);
    // 移除电话
    content = content.replace(SENSITIVE_PATTERNS[1], anonymizePhone);
    content = content.replace(SENSITIVE_PATTERNS[2], anonymizePhone);
    // 移除其他敏感词
    for (let i = 3; i < SENSITIVE_PATTERNS.length; i++) {
      content = content.replace(SENSITIVE_PATTERNS[i], '[敏感]');
    }
    
    distilled.content = content;
  }
  
  // 2. 移除敏感章节
  if (distilled.summary) {
    for (const pattern of REMOVE_SECTIONS) {
      distilled.summary = distilled.summary.replace(pattern, '');
    }
  }
  
  // 3. 匿名化来源
  if (distilled.source_file) {
    // 只保留文件名，不保留完整路径
    distilled.source_file = distilled.source_file.split('/').pop();
  }
  
  // 4. 添加蒸馏标记
  distilled.distilled = true;
  distilled.distilled_at = Date.now();
  
  // 5. 生成信任分数 (基于内容质量)
  distilled.confidence = calculateConfidence(distilled);
  
  return distilled;
}

function calculateConfidence(item) {
  let score = 0.5; // 基础分
  
  // 有标题 +0.1
  if (item.title && item.title.length > 0) score += 0.1;
  
  // 有摘要 +0.1
  if (item.summary && item.summary.length > 50) score += 0.1;
  
  // 有标签 +0.1
  if (item.tags && item.tags.length > 0) score += 0.1;
  
  // 内容不太长不太短 +0.1
  if (item.content) {
    const len = item.content.length;
    if (len > 100 && len < 10000) score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

// 蒸馏整个知识库
function distilKnowledgeBase(knowledgeList) {
  console.log('🔬 知识蒸馏...\n');
  
  const distilled = knowledgeList.map(item => distilKnowledge(item));
  
  const removedCount = distilled.filter(i => 
    i.summary?.includes('[敏感]') || i.content?.includes('[敏感]')
  ).length;
  
  console.log(`✅ 蒸馏完成: ${distilled.length} 条知识`);
  if (removedCount > 0) {
    console.log(`   移除了 ${removedCount} 条敏感信息`);
  }
  
  return distilled;
}

// 导出
module.exports = { distilKnowledge, distilKnowledgeBase, anonymizeEmail, anonymizePhone };

// 命令行运行
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  
  // 读取知识索引
  const indexPath = path.join(__dirname, '..', 'config', 'knowledge_index.json');
  
  if (fs.existsSync(indexPath)) {
    const knowledge = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const distilled = distilKnowledgeBase(knowledge);
    
    // 保存蒸馏后的知识
    const outputPath = path.join(__dirname, '..', 'config', 'knowledge_distilled.json');
    fs.writeFileSync(outputPath, JSON.stringify(distilled, null, 2));
    console.log(`\n💾 蒸馏后的知识已保存到: ${outputPath}`);
  } else {
    console.log('❌ 请先运行知识扫描: node src/knowledge/scanner.js');
  }
}
