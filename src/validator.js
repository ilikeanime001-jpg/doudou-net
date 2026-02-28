#!/usr/bin/env node
/**
 * 数据验证器
 */

const validator = {
  // 验证知识包
  knowledgePacket(data) {
    const errors = [];
    
    if (!data.id) errors.push('缺少id');
    if (!data.title) errors.push('缺少title');
    if (!data.topic) errors.push('缺少topic');
    if (data.topic && !['投资', '学习', '记忆', '偏好', '目标', 'general'].includes(data.topic)) {
      errors.push('未知topic');
    }
    if (data.confidence && (data.confidence < 0 || data.confidence > 1)) {
      errors.push('confidence应在0-1之间');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  // 验证节点
  node(data) {
    const errors = [];
    
    if (!data.node_id) errors.push('缺少node_id');
    if (data.node_id && data.node_id.length < 8) {
      errors.push('node_id太短');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

module.exports = validator;
