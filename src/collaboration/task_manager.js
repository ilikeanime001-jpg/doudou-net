#!/usr/bin/env node
/**
 * 任务管理器 - Task Manager
 */

const crypto = require('crypto');

class TaskManager {
  constructor() {
    this.tasks = new Map();
    this.projects = new Map();
  }
  
  createProject(name, description, owner) {
    const project = {
      id: crypto.randomUUID(),
      name,
      description,
      owner,
      tasks: [],
      createdAt: Date.now(),
      status: 'active'
    };
    this.projects.set(project.id, project);
    return project;
  }
  
  addTask(projectId, title, description, assignee, deadline) {
    const task = {
      id: crypto.randomUUID(),
      projectId,
      title,
      description,
      assignee,
      deadline,
      status: 'pending',
      progress: 0,
      createdAt: Date.now()
    };
    
    const project = this.projects.get(projectId);
    if (project) {
      project.tasks.push(task.id);
      this.tasks.set(task.id, task);
    }
    return task;
  }
  
  updateTask(taskId, progress, status) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.progress = progress || task.progress;
      task.status = status || task.status;
      task.updatedAt = Date.now();
    }
    return task;
  }
  
  getProjectTasks(projectId) {
    const project = this.projects.get(projectId);
    if (!project) return [];
    return project.tasks.map(id => this.tasks.get(id)).filter(Boolean);
  }
  
  createReview(projectId, items) {
    return {
      id: crypto.randomUUID(),
      projectId,
      type: 'review',
      items,
      createdAt: Date.now()
    };
  }
}

module.exports = TaskManager;
