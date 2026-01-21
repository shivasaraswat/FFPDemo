// Simple in-memory cache for permissions
// In production, consider using Redis

class PermissionCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  getKey(roleId, moduleKey) {
    return `${roleId}:${moduleKey}`;
  }

  get(roleId, moduleKey) {
    const key = this.getKey(roleId, moduleKey);
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  set(roleId, moduleKey, value) {
    const key = this.getKey(roleId, moduleKey);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl
    });
  }

  invalidate(roleId = null, moduleKey = null) {
    if (roleId && moduleKey) {
      // Invalidate specific permission
      const key = this.getKey(roleId, moduleKey);
      this.cache.delete(key);
    } else if (roleId) {
      // Invalidate all permissions for a role
      for (const [key] of this.cache.entries()) {
        if (key.startsWith(`${roleId}:`)) {
          this.cache.delete(key);
        }
      }
    } else if (moduleKey) {
      // Invalidate all permissions for a module
      for (const [key] of this.cache.entries()) {
        if (key.endsWith(`:${moduleKey}`)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Invalidate all
      this.cache.clear();
    }
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new PermissionCache();


