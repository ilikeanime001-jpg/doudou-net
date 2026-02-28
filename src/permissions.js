#!/usr/bin/env node
/**
 * 权限系统
 */

const PERMISSIONS = {
  READ_KNOWLEDGE: 'read:knowledge',
  WRITE_KNOWLEDGE: 'write:knowledge',
  READ_NODES: 'read:nodes',
  WRITE_NODES: 'write:nodes',
  EXECUTE_TASK: 'execute:task',
  ADMIN: 'admin'
};

class PermissionSystem {
  constructor() {
    this.roles = new Map();
    this.assignments = new Map();
    
    // 默认角色
    this.roles.set('admin', Object.values(PERMISSIONS));
    this.roles.set('user', [PERMISSIONS.READ_KNOWLEDGE, PERMISSIONS.EXECUTE_TASK]);
    this.roles.set('guest', [PERMISSIONS.READ_KNOWLEDGE]);
  }
  
  assignRole(nodeId, role) {
    this.assignments.set(nodeId, role);
  }
  
  hasPermission(nodeId, permission) {
    const role = this.assignments.get(nodeId) || 'guest';
    const perms = this.roles.get(role) || [];
    return perms.includes(permission) || perms.includes(PERMISSIONS.ADMIN);
  }
  
  getRole(nodeId) {
    return this.assignments.get(nodeId) || 'guest';
  }
}

module.exports = { PermissionSystem, PERMISSIONS };
