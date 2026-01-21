const pool = require('../config/database');

class Module {
  static async create(moduleData) {
    const { key, name, parentKey = null, order = 0, isActive = true } = moduleData;
    const [result] = await pool.execute(
      `INSERT INTO modules (\`key\`, name, parentKey, \`order\`, isActive) 
       VALUES (?, ?, ?, ?, ?)`,
      [key, name, parentKey, order, isActive]
    );
    return this.findByKey(key);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM modules WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByKey(key) {
    const [rows] = await pool.execute(
      'SELECT * FROM modules WHERE `key` = ?',
      [key]
    );
    return rows[0] || null;
  }

  static async findAll(hierarchical = false) {
    const [rows] = await pool.execute(
      'SELECT * FROM modules WHERE isActive = TRUE ORDER BY `order` ASC, name ASC'
    );

    if (!hierarchical) {
      return rows;
    }

    // Build hierarchical structure
    const moduleMap = new Map();
    const rootModules = [];

    // First pass: create map
    rows.forEach(module => {
      moduleMap.set(module.key, { ...module, children: [] });
    });

    // Second pass: build tree
    rows.forEach(module => {
      const moduleNode = moduleMap.get(module.key);
      if (module.parentKey) {
        const parent = moduleMap.get(module.parentKey);
        if (parent) {
          parent.children.push(moduleNode);
        }
      } else {
        rootModules.push(moduleNode);
      }
    });

    return rootModules;
  }

  static async findChildren(parentKey) {
    const [rows] = await pool.execute(
      'SELECT * FROM modules WHERE parentKey = ? AND isActive = TRUE ORDER BY `order` ASC',
      [parentKey]
    );
    return rows;
  }

  static async update(key, moduleData) {
    const allowedFields = ['name', 'parentKey', 'order', 'isActive'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (moduleData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(moduleData[field]);
      }
    }

    if (updates.length === 0) {
      return this.findByKey(key);
    }

    values.push(key);
    await pool.execute(
      `UPDATE modules SET ${updates.join(', ')} WHERE \`key\` = ?`,
      values
    );
    return this.findByKey(key);
  }

  static async delete(key) {
    // Check if module has children
    const children = await this.findChildren(key);
    if (children.length > 0) {
      throw new Error('Cannot delete module that has children');
    }

    await pool.execute('DELETE FROM modules WHERE `key` = ?', [key]);
    return true;
  }
}

module.exports = Module;


