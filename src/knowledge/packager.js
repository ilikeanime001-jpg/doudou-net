#!/usr/bin/env node
/**
 * 2.3 知识打包
 * 将知识打包成标准格式用于网络传输
 */

const crypto = require('crypto');

// 标准知识包格式
function createKnowledgePacket(knowledge, senderNode) {
  return {
    id: knowledge.id || crypto.randomUUID(),
    type: 'knowledge_share',
    topic: knowledge.topic || 'general',
    title: knowledge.title,
    content: knowledge.content || '',
    summary: knowledge.summary || generateSummary(knowledge.content),
    tags: knowledge.tags || [],
    source: {
      node_id: senderNode,
      node_name: getNodeName(),
      original_source: knowledge.source_file || 'unknown'
    },
    metadata: {
      created_at: knowledge.created_at || Date.now(),
      updated_at: knowledge.updated_at || Date.now(),
      distilled_at: knowledge.distilled_at || Date.now(),
      version: '1.0',
      language: 'zh-CN',
      confidence: knowledge.confidence || 0.5,
      verified: false
    },
    license: 'CC-BY-4.0'
  };
}

function generateSummary(content) {
  if (!content) return '';
  
  // 移除 markdown 格式
  let summary = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
  
  // 截取前200字
  if (summary.length > 200) {
    summary = summary.substring(0, 200) + '...';
  }
  
  return summary;
}

function getNodeName() {
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, '..', 'config', 'identity.json');
    if (fs.existsSync(configPath)) {
      const identity = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return identity.name || 'Pandora Node';
    }
  } catch (e) {}
  return 'Pandora Node';
}

// 打包要分享的知识
function packageKnowledgeForSharing(knowledgeList, senderNode) {
  console.log('📦 打包知识...\n');
  
  const packets = knowledgeList.map(knowledge => 
    createKnowledgePacket(knowledge, senderNode)
  );
  
  console.log(`✅ 打包完成: ${packets.length} 个知识包`);
  
  return packets;
}

// 从知识包中提取信息
function parseKnowledgePacket(packet) {
  return {
    id: packet.id,
    title: packet.title,
    summary: packet.summary,
    topic: packet.topic,
    tags: packet.tags,
    source: packet.source,
    confidence: packet.metadata?.confidence || 0.5,
    received_at: Date.now()
  };
}

// 按主题筛选知识
function filterByTopic(packets, topic) {
  if (!topic) return packets;
  return packets.filter(p => p.topic === topic);
}

// 按标签搜索知识
function searchByTag(packets, tag) {
  if (!tag) return packets;
  return packets.filter(p => 
    p.tags && p.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

// 搜索知识
function searchKnowledge(packets, query) {
  if (!query) return packets;
  
  const lowerQuery = query.toLowerCase();
  return packets.filter(p => 
    p.title?.toLowerCase().includes(lowerQuery) ||
    p.summary?.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(t => t.toLowerCase().includes(lowerQuery)) ||
    p.topic?.toLowerCase().includes(lowerQuery)
  );
}

// 导出
module.exports = {
  createKnowledgePacket,
  packageKnowledgeForSharing,
  parseKnowledgePacket,
  filterByTopic,
  searchByTag,
  searchKnowledge
};

// 命令行测试
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  
  // 读取蒸馏后的知识
  const inputPath = path.join(__dirname, '..', 'config', 'knowledge_distilled.json');
  
  if (fs.existsSync(inputPath)) {
    const knowledge = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    
    // 读取节点ID
    let nodeId = 'test-node';
    try {
      const identityPath = path.join(__dirname, '..', 'config', 'identity.json');
      if (fs.existsSync(identityPath)) {
        nodeId = JSON.parse(fs.readFileSync(identityPath, 'utf-8')).node_id;
      }
    } catch (e) {}
    
    // 打包
    const packets = packageKnowledgeForSharing(knowledge, nodeId);
    
    // 保存
    const outputPath = path.join(__dirname, '..', 'config', 'knowledge_packets.json');
    fs.writeFileSync(outputPath, JSON.stringify(packets, null, 2));
    console.log(`\n💾 知识包已保存到: ${outputPath}`);
    console.log(`📊 总大小: ${JSON.stringify(packets).length} bytes`);
  } else {
    console.log('❌ 请先运行: node src/knowledge/scanner.js && node src/knowledge/distiller.js');
  }
}
