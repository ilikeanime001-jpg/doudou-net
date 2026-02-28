#!/usr/bin/env node
/**
 * 知识蒸馏系统 V2.1
 * Enhanced Knowledge Distiller V2.1
 */

const crypto = require('crypto');
const fs = require('fs');

const CONFIG = {
  SENSITIVE_PATTERNS: {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+?41|0)[0-9]{9,10}/g,
    mobile: /\+?[0-9]{10,15}/g,
    password: /password[=:]\s*\S+/gi,
    apiKey: /api[_-]?key[=:]\s*\S+/gi,
    ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  },
  REMOVE_SECTIONS: ['偏好历史', '禁忌事项', '个人敏感', '私人日记'],
  LEVELS: { BRIEF: 'brief', STANDARD: 'standard', DETAILED: 'detailed' },
};

function anonymize(text) {
  if (!text) return '';
  let result = text;
  result = result.replace(CONFIG.SENSITIVE_PATTERNS.email, '[邮箱]');
  result = result.replace(CONFIG.SENSITIVE_PATTERNS.phone, '[电话]');
  result = result.replace(CONFIG.SENSITIVE_PATTERNS.mobile, '[电话]');
  result = result.replace(CONFIG.SENSITIVE_PATTERNS.ipAddress, '[IP]');
  result = result.replace(CONFIG.SENSITIVE_PATTERNS.password, 'password: [已隐藏]');
  result = result.replace(CONFIG.SENSITIVE_PATTERNS.apiKey, 'api_key: [已隐藏]');
  return result;
}

function removeSensitiveSections(text) {
  if (!text) return '';
  let result = text;
  for (const section of CONFIG.REMOVE_SECTIONS) {
    const pattern = new RegExp(`##\\s*${section}[\\s\\S]*?(?=##\\s|\\n##|$)`, 'gi');
    result = result.replace(pattern, '');
  }
  return result;
}

function extractKeySentences(text, maxSentences = 3) {
  if (!text) return [];
  const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 10);
  const scored = sentences.map(sentence => {
    let score = 0;
    if (/\d+/.test(sentence)) score += 1;
    if (/投资|股票|分析|风险|收益|策略|框架|重要|核心/.test(sentence)) score += 2;
    if (sentence.length > 20 && sentence.length < 100) score += 1;
    return { sentence: sentence.trim(), score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, maxSentences).map(s => s.sentence);
}

function distill(text, level = CONFIG.LEVELS.STANDARD) {
  if (!text || text.trim() === '') return '';
  let cleaned = anonymize(text);
  cleaned = removeSensitiveSections(cleaned);
  if (level === CONFIG.LEVELS.BRIEF) {
    const keySentences = extractKeySentences(cleaned, 2);
    let distilled = keySentences.join('。') + '。';
    if (distilled.length > 100) distilled = distilled.substring(0, 100) + '...';
    return distilled;
  }
  if (level === CONFIG.LEVELS.STANDARD) {
    const paragraphs = cleaned.split(/\n\n+/).filter(p => p.trim().length > 20);
    const important = paragraphs.filter(p => /投资|股票|分析|风险|收益|策略|框架/.test(p));
    return important.length > 0 ? important.slice(0, 2).join('\n\n') : paragraphs.slice(0, 2).join('\n\n');
  }
  return cleaned;
}

function generateTags(text, existingTags = []) {
  const tags = new Set(existingTags);
  const rules = [
    { pattern: /股票|A股|港股|美股/g, tag: '股票' },
    { pattern: /投资|理财|资产/g, tag: '投资' },
    { pattern: /风险|风控|止损/g, tag: '风险管理' },
    { pattern: /财报|现金流|利润/g, tag: '财务分析' },
    { pattern: /技术|图形|K线/g, tag: '技术分析' },
    { pattern: /AI|人工智能|机器学习/g, tag: 'AI' },
    { pattern: /代码|编程|开发/g, tag: '编程' },
    { pattern: /学习|笔记|研究/g, tag: '学习' },
    { pattern: /项目|产品|设计/g, tag: '产品' },
  ];
  for (const rule of rules) {
    if (rule.pattern.test(text || '')) tags.add(rule.tag);
  }
  return [...tags];
}

function assessQuality(knowledge) {
  const scores = { completeness: 0, clarity: 0, usefulness: 0, reliability: 0 };
  if (knowledge.title) scores.completeness += 0.3;
  if (knowledge.summary) scores.completeness += 0.3;
  if ((knowledge.content && knowledge.content.length > 0) || (knowledge.summary && knowledge.summary.length > 50)) scores.completeness += 0.4;
  if (knowledge.summary && knowledge.summary.length < 200) scores.clarity += 0.5;
  if ((knowledge.content && knowledge.content.length > 100) || (knowledge.summary && knowledge.summary.length > 100)) scores.clarity += 0.5;
  if (knowledge.topic) scores.usefulness += 0.4;
  if (knowledge.tags && knowledge.tags.length >= 3) scores.usefulness += 0.3;
  if (knowledge.metadata && knowledge.metadata.confidence) scores.usefulness += 0.3 * knowledge.metadata.confidence;
  if (knowledge.source) scores.reliability += 0.4;
  if (knowledge.metadata && knowledge.metadata.source) scores.reliability += 0.3;
  if (knowledge.metadata && knowledge.metadata.confidence) scores.reliability += 0.3 * knowledge.metadata.confidence;
  const totalScore = (scores.completeness * 0.25 + scores.clarity * 0.25 + scores.usefulness * 0.25 + scores.reliability * 0.25);
  return { scores, totalScore: Math.round(totalScore * 100) / 100, level: totalScore >= 0.8 ? '优秀' : totalScore >= 0.6 ? '良好' : totalScore >= 0.4 ? '一般' : '需改进' };
}

function fullDistill(knowledgeItem) {
  const distilled = { id: knowledgeItem.id || crypto.randomUUID(), title: knowledgeItem.title, topic: knowledgeItem.topic, source: knowledgeItem.source, metadata: { ...knowledgeItem.metadata, distilled_at: Date.now() } };
  const sourceText = knowledgeItem.content || knowledgeItem.summary || '';
  if (sourceText) {
    distilled.content = { brief: distill(sourceText, CONFIG.LEVELS.BRIEF), standard: distill(sourceText, CONFIG.LEVELS.STANDARD), detailed: distill(sourceText, CONFIG.LEVELS.DETAILED) };
    distilled.original_length = sourceText.length;
  }
  if (knowledgeItem.summary) {
    distilled.summary = knowledgeItem.summary.substring(0, 150);
  } else {
    const keySentences = extractKeySentences(sourceText, 1);
    distilled.summary = keySentences.join(' ').substring(0, 150);
  }
  distilled.tags = generateTags(sourceText, knowledgeItem.tags || []);
  distilled.quality = assessQuality(knowledgeItem);
  return distilled;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === '--batch') {
    console.log('📦 批量蒸馏知识...\n');
    const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));
    const distilled = packets.map(item => fullDistill(item));
    fs.writeFileSync('config/knowledge_distilled_v2.json', JSON.stringify(distilled, null, 2));
    const qualityStats = { 优秀: 0, 良好: 0, 一般: 0, 需改进: 0 };
    distilled.forEach(k => qualityStats[k.quality.level]++);
    console.log('✅ 蒸馏完成!');
    console.log(`\n📊 统计:`);
    console.log(`   总数: ${distilled.length}`);
    console.log(`   优秀: ${qualityStats.优秀}`);
    console.log(`   良好: ${qualityStats.良好}`);
    console.log(`   一般: ${qualityStats.一般}`);
    console.log(`   需改进: ${qualityStats.需改进}`);
    console.log(`\n📁 已保存到: config/knowledge_distilled_v2.json`);
  }
}

module.exports = { CONFIG, anonymize, removeSensitiveSections, extractKeySentences, distill, generateTags, assessQuality, fullDistill };
