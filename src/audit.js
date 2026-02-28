#!/usr/bin/env node
/**
 * 审计日志
 */

const fs = require('fs');

class AuditLog {
  constructor(file = 'logs/audit.log') {
    this.file = file;
    const dir = file.split('/')[0];
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }
  
  log(action, actor, target, details = {}) {
    const entry = {
      id: Date.now(),
      action,
      actor,
      target,
      details,
      timestamp: new Date().toISOString()
    };
    
    fs.appendFileSync(this.file, JSON.stringify(entry) + '\n');
    return entry;
  }
  
  // 预设审计动作
  nodeJoined(nodeId) { this.log('node:joined', nodeId); }
  nodeLeft(nodeId) { this.log('node:left', nodeId); }
  knowledgeShared(from, to, knowledgeId) { this.log('knowledge:shared', from, to, { knowledgeId }); }
  taskExecuted(nodeId, taskId) { this.log('task:executed', nodeId, taskId); }
}

module.exports = AuditLog;
