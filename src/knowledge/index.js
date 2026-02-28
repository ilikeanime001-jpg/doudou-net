#!/usr/bin/env node
/**
 * 知识管理器
 * 整合扫描、蒸馏、打包、广播功能
 */

const fs = require('fs');
const path = require('path');

class KnowledgeManager {
  constructor() {
    // Use pandora config directory
    const configDir = '/Users/doudou/.openclaw/workspace/projects/pandora/config';
    this.configDir = configDir;
    this.indexPath = path.join(configDir, 'knowledge_index.json');
    this.distilledPath = path.join(configDir, 'knowledge_distilled.json');
    this.packetsPath = path.join(configDir, 'knowledge_packets.json');
    this.receivedPath = path.join(configDir, 'knowledge_received.json');
    
    this.localKnowledge = [];
    this.receivedKnowledge = [];
    this.sharedPackets = [];
  }
  
  // 扫描本地知识库
  async scan() {
    console.log('🔍 扫描本地知识库...');
    
    const { scanKnowledge } = require('./scanner.js');
    this.localKnowledge = scanKnowledge();
    
    // 保存索引
    fs.writeFileSync(this.indexPath, JSON.stringify(this.localKnowledge, null, 2));
    
    return this.localKnowledge;
  }
  
  // 蒸馏知识
  async distil() {
    console.log('🔬 蒸馏知识...');
    
    const { distilKnowledgeBase } = require('./distiller.js');
    this.localKnowledge = distilKnowledgeBase(this.localKnowledge);
    
    // 保存蒸馏后的知识
    fs.writeFileSync(this.distilledPath, JSON.stringify(this.localKnowledge, null, 2));
    
    return this.localKnowledge;
  }
  
  // 打包知识
  async package(senderNode) {
    console.log('📦 打包知识...');
    
    const { packageKnowledgeForSharing } = require('./packager.js');
    this.sharedPackets = packageKnowledgeForSharing(this.localKnowledge, senderNode);
    
    // 保存知识包
    fs.writeFileSync(this.packetsPath, JSON.stringify(this.sharedPackets, null, 2));
    
    return this.sharedPackets;
  }
  
  // 加载已接收的知识
  loadReceived() {
    if (fs.existsSync(this.receivedPath)) {
      this.receivedKnowledge = JSON.parse(fs.readFileSync(this.receivedPath, 'utf-8'));
    }
    return this.receivedKnowledge;
  }
  
  // 保存接收的知识
  saveReceived() {
    fs.writeFileSync(this.receivedPath, JSON.stringify(this.receivedKnowledge, null, 2));
  }
  
  // 处理接收到的知识包
  receive(packet) {
    const { handleKnowledgeReceived } = require('./packager.js');
    const result = handleKnowledgeReceived(packet, this.receivedKnowledge);
    
    if (result.status === 'new') {
      this.saveReceived();
      console.log(`📥 新知识: ${packet.title}`);
    }
    
    return result;
  }
  
  // 搜索知识 (本地 + 接收)
  search(query, topic = null) {
    const { searchKnowledge, filterByTopic } = require('./packager.js');
    
    let results = [...this.localKnowledge, ...this.receivedKnowledge];
    
    if (topic) {
      results = filterByTopic(results, topic);
    }
    
    if (query) {
      results = searchKnowledge(results, query);
    }
    
    return results;
  }
  
  // 获取统计信息
  getStats() {
    return {
      local: this.localKnowledge.length,
      received: this.receivedKnowledge.length,
      topics: [...new Set([
        ...this.localKnowledge.map(k => k.topic),
        ...this.receivedKnowledge.map(k => k.topic)
      ])]
    };
  }
  
  // 完整流程
  async fullProcess(senderNode) {
    console.log('='.repeat(40));
    console.log('🎯 知识共享完整流程');
    console.log('='.repeat(40));
    
    await this.scan();
    await this.distil();
    await this.package(senderNode);
    
    console.log('='.repeat(40));
    console.log('📊 知识统计:');
    const stats = this.getStats();
    console.log(`   本地知识: ${stats.local}`);
    console.log(`   接收知识: ${stats.received}`);
    console.log(`   主题: ${stats.topics.join(', ')}`);
    console.log('='.repeat(40));
    
    return this.sharedPackets;
  }
}

// 导出
module.exports = { KnowledgeManager };

// 命令行运行
if (require.main === module) {
  const km = new KnowledgeManager();
  km.fullProcess('test-node').then(packets => {
    console.log(`\n✅ 知识准备完成! ${packets.length} 个知识包待分享`);
  }).catch(e => {
    console.error('错误:', e.message);
  });
}
