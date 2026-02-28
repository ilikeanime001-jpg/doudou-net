#!/usr/bin/env node
/**
 * 2.4 知识广播
 * 将知识广播到网络中的其他节点
 */

const WebSocket = require('ws');
const crypto = require('crypto');

// 广播知识到指定节点
async function broadcastKnowledge(knowledgePackets, targetWs, senderNode) {
  let sentCount = 0;
  
  for (const packet of knowledgePackets) {
    const message = {
      id: crypto.randomUUID(),
      type: 'knowledge_share',
      sender: senderNode,
      timestamp: Date.now(),
      payload: packet
    };
    
    targetWs.send(JSON.stringify(message));
    sentCount++;
    
    // 每个包之间稍作延迟，避免网络拥塞
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return sentCount;
}

// 广播知识到多个节点
async function broadcastToNodes(knowledgePackets, nodes, senderNode) {
  const results = [];
  
  for (const node of nodes) {
    if (node.ws && node.ws.readyState === WebSocket.OPEN) {
      try {
        const count = await broadcastKnowledge(knowledgePackets, node.ws, senderNode);
        results.push({
          node_id: node.id,
          status: 'success',
          sent: count
        });
        console.log(`✅ 已发送到 ${node.id}: ${count} 个知识包`);
      } catch (e) {
        results.push({
          node_id: node.id,
          status: 'error',
          error: e.message
        });
        console.log(`❌ 发送到 ${node.id} 失败: ${e.message}`);
      }
    }
  }
  
  return results;
}

// 选择性广播 (按主题)
async function broadcastByTopic(knowledgePackets, nodes, topics, senderNode) {
  const filtered = knowledgePackets.filter(p => 
    topics.includes(p.topic)
  );
  
  console.log(`📤 按主题广播: ${topics.join(', ')} (${filtered.length} 个知识包)`);
  
  return broadcastToNodes(filtered, nodes, senderNode);
}

// 请求知识 (向其他节点请求)
function requestKnowledge(ws, topics, requesterNode) {
  const message = {
    id: crypto.randomUUID(),
    type: 'knowledge_request',
    sender: requesterNode,
    timestamp: Date.now(),
    payload: {
      topics: topics,
      requirements: {
        min_confidence: 0.5,
        limit: 20
      }
    }
  };
  
  ws.send(JSON.stringify(message));
  console.log(`📡 已发送知识请求: ${topics.join(', ')}`);
}

// 处理接收到的知识包
function handleKnowledgeReceived(packet, localStorage) {
  const parsed = {
    id: packet.id,
    title: packet.title,
    summary: packet.summary,
    topic: packet.topic,
    tags: packet.tags,
    source_node: packet.source?.node_id,
    source_name: packet.source?.node_name,
    confidence: packet.metadata?.confidence || 0.5,
    received_at: Date.now()
  };
  
  // 检查是否已存在
  const exists = localStorage.some(k => k.id === parsed.id);
  if (exists) {
    return { status: 'duplicate', data: parsed };
  }
  
  // 添加到本地存储
  localStorage.push(parsed);
  return { status: 'new', data: parsed };
}

// 创建知识分享命令
function createShareCommand() {
  return {
    usage: 'share [topic] [--all]',
    description: '分享知识到网络',
    examples: [
      'share 投资 - 分享投资相关知识',
      'share --all - 分享所有知识'
    ]
  };
}

// 导出
module.exports = {
  broadcastKnowledge,
  broadcastToNodes,
  broadcastByTopic,
  requestKnowledge,
  handleKnowledgeReceived,
  createShareCommand
};

// 命令行测试
if (require.main === module) {
  console.log('📡 知识广播模块');
  console.log('使用方法: 在 server.js 中引入并调用');
  console.log(createShareCommand());
}
