#!/usr/bin/env node
/**
 * 复盘系统 - Review System
 */

const crypto = require('crypto');

class ReviewSystem {
  constructor() {
    this.reviews = new Map();
  }
  
  // 创建复盘
  create(projectId, data) {
    const review = {
      id: crypto.randomUUID(),
      projectId,
      what: data.what || '',      // 成果
      how: data.how || '',        // 过程
      why: data.why || '',        // 原因
      learn: data.learn || [],    // 经验
      action: data.action || [],   // 改进行动
      participants: data.participants || [],
      createdAt: Date.now()
    };
    this.reviews.set(review.id, review);
    return review;
  }
  
  // 获取项目复盘
  getProjectReviews(projectId) {
    return [...this.reviews.values()].filter(r => r.projectId === projectId);
  }
  
  // 提取经验到知识库
  extractLearnings(reviewId) {
    const review = this.reviews.get(reviewId);
    if (!review) return null;
    
    return {
      type: 'learnings',
      content: review.learn,
      source: review.id,
      tags: ['复盘', '经验', review.projectId]
    };
  }
}

module.exports = ReviewSystem;
