#!/usr/bin/env node
/**
 * 协作客户端
 */

const WebSocket = require('ws');

class CollaborationClient {
  constructor(serverUrl, nodeInfo) {
    this.serverUrl = serverUrl;
    this.nodeInfo = nodeInfo;
    this.ws = null;
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.serverUrl);
      this.ws.on('open', () => {
        console.log('✅ 已连接');
        this.send({ type: 'COLLAB_JOIN', payload: this.nodeInfo });
        resolve();
      });
      this.ws.on('message', (data) => this.handleMessage(JSON.parse(data)));
      this.ws.on('error', reject);
    });
  }
  
  send(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
  
  handleMessage(msg) {
    console.log(`📨 ${msg.type}:`, msg.payload);
  }
  
  invite(project) { this.send({ type: 'COLLAB_INVITE', payload: project }); }
  updateTask(taskId, progress) { this.send({ type: 'TASK_UPDATE', payload: { taskId, progress } }); }
  requestReview(projectId) { this.send({ type: 'REVIEW_REQUEST', payload: { projectId } }); }
  requestOptimize(projectId, issues) { this.send({ type: 'OPTIMIZE_REQUEST', payload: { projectId, issues } }); }
}

module.exports = CollaborationClient;
