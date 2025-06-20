// Mock Prisma Client for local development without binaries
const Database = require('better-sqlite3');
const path = require('path');

// Use existing SQLite database
const db = new Database(path.join(__dirname, 'prisma', 'dev.db'));

// Create a mock PrismaClient that uses the existing database
class MockPrismaClient {
  constructor() {
    this.user = {
      create: async ({ data }) => {
        const stmt = db.prepare('INSERT INTO User (email, username, password) VALUES (?, ?, ?)');
        const result = stmt.run(data.email, data.username, data.password);
        return { 
          id: result.lastInsertRowid, 
          ...data, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
      },
      findUnique: async ({ where }) => {
        if (where.email) {
          return db.prepare('SELECT * FROM User WHERE email = ?').get(where.email);
        }
        if (where.id) {
          return db.prepare('SELECT * FROM User WHERE id = ?').get(where.id);
        }
        return null;
      },
      findFirst: async ({ where }) => {
        if (where.OR) {
          for (const condition of where.OR) {
            if (condition.email) {
              const user = db.prepare('SELECT * FROM User WHERE email = ?').get(condition.email);
              if (user) return user;
            }
            if (condition.username) {
              const user = db.prepare('SELECT * FROM User WHERE username = ?').get(condition.username);
              if (user) return user;
            }
          }
        }
        return null;
      }
    };

    this.businessInfo = {
      findFirst: async () => {
        return db.prepare('SELECT * FROM BusinessInfo LIMIT 1').get();
      },
      create: async ({ data }) => {
        const stmt = db.prepare('INSERT INTO BusinessInfo (name, address, phone, hours, logoUrl) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(data.name, data.address, data.phone, data.hours, data.logoUrl);
        return { 
          id: result.lastInsertRowid, 
          ...data, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
      },
      update: async ({ where, data }) => {
        const stmt = db.prepare('UPDATE BusinessInfo SET name = ?, address = ?, phone = ?, hours = ?, logoUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(data.name, data.address, data.phone, data.hours, data.logoUrl, where.id);
        return db.prepare('SELECT * FROM BusinessInfo WHERE id = ?').get(where.id);
      }
    };

    this.menuCategory = {
      findMany: async ({ include, orderBy } = {}) => {
        const categories = db.prepare('SELECT * FROM MenuCategory ORDER BY sortOrder, name').all();
        if (include && include.items) {
          return categories.map(category => ({
            ...category,
            items: db.prepare('SELECT * FROM MenuItem WHERE menuCategoryId = ? ORDER BY sortOrder, name').all(category.id)
          }));
        }
        return categories;
      },
      findUnique: async ({ where, include }) => {
        const category = db.prepare('SELECT * FROM MenuCategory WHERE id = ?').get(where.id);
        if (!category) return null;
        if (include && include.items) {
          category.items = db.prepare('SELECT * FROM MenuItem WHERE menuCategoryId = ? ORDER BY sortOrder, name').all(category.id);
        }
        return category;
      },
      create: async ({ data }) => {
        const stmt = db.prepare('INSERT INTO MenuCategory (name, sortOrder) VALUES (?, ?)');
        const result = stmt.run(data.name, data.sortOrder || 0);
        return { 
          id: result.lastInsertRowid, 
          ...data, 
          sortOrder: data.sortOrder || 0,
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
      },
      update: async ({ where, data }) => {
        const stmt = db.prepare('UPDATE MenuCategory SET name = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(data.name, data.sortOrder, where.id);
        return db.prepare('SELECT * FROM MenuCategory WHERE id = ?').get(where.id);
      },
      delete: async ({ where }) => {
        db.prepare('DELETE FROM MenuCategory WHERE id = ?').run(where.id);
        return {};
      }
    };

    this.menuItem = {
      findMany: async ({ include, orderBy } = {}) => {
        let query = 'SELECT mi.* FROM MenuItem mi';
        if (include && include.category) {
          query = 'SELECT mi.*, mc.name as categoryName FROM MenuItem mi JOIN MenuCategory mc ON mi.menuCategoryId = mc.id';
        }
        query += ' ORDER BY mi.sortOrder, mi.name';
        const items = db.prepare(query).all();
        return items.map(item => ({
          ...item,
          visible: Boolean(item.visible),
          ...(include && include.category && { category: { name: item.categoryName } })
        }));
      },
      findUnique: async ({ where, include }) => {
        let query = 'SELECT mi.* FROM MenuItem mi WHERE mi.id = ?';
        if (include && include.category) {
          query = 'SELECT mi.*, mc.name as categoryName FROM MenuItem mi JOIN MenuCategory mc ON mi.menuCategoryId = mc.id WHERE mi.id = ?';
        }
        const item = db.prepare(query).get(where.id);
        if (!item) return null;
        return {
          ...item,
          visible: Boolean(item.visible),
          ...(include && include.category && { category: { name: item.categoryName } })
        };
      },
      create: async ({ data }) => {
        const stmt = db.prepare('INSERT INTO MenuItem (menuCategoryId, name, description, price, imageUrl, visible, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(
          data.menuCategoryId,
          data.name,
          data.description,
          data.price,
          data.imageUrl,
          data.visible !== false ? 1 : 0,
          data.sortOrder || 0
        );
        return { 
          id: result.lastInsertRowid, 
          ...data, 
          visible: data.visible !== false,
          sortOrder: data.sortOrder || 0,
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
      },
      update: async ({ where, data }) => {
        const updateData = {};
        if (data.menuCategoryId !== undefined) updateData.menuCategoryId = data.menuCategoryId;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.visible !== undefined) updateData.visible = data.visible ? 1 : 0;
        if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
        
        const stmt = db.prepare('UPDATE MenuItem SET menuCategoryId = ?, name = ?, description = ?, price = ?, imageUrl = ?, visible = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(updateData.menuCategoryId, updateData.name, updateData.description, updateData.price, updateData.imageUrl, updateData.visible, updateData.sortOrder, where.id);
        const item = db.prepare('SELECT * FROM MenuItem WHERE id = ?').get(where.id);
        return { ...item, visible: Boolean(item.visible) };
      },
      delete: async ({ where }) => {
        db.prepare('DELETE FROM MenuItem WHERE id = ?').run(where.id);
        return {};
      }
    };

    this.order = {
      findMany: async ({ where, include, orderBy } = {}) => {
        let query = 'SELECT * FROM "Order"';
        let params = [];
        
        if (where && where.status) {
          query += ' WHERE status = ?';
          params.push(where.status);
        }
        
        query += ' ORDER BY createdAt DESC';
        
        const orders = db.prepare(query).all(...params);
        
        if (include && include.items) {
          return orders.map(order => ({
            ...order,
            items: db.prepare('SELECT oi.*, mi.name as menuItemName FROM OrderItem oi JOIN MenuItem mi ON oi.menuItemId = mi.id WHERE oi.orderId = ?').all(order.id)
          }));
        }
        
        return orders;
      },
      findUnique: async ({ where, include }) => {
        const order = db.prepare('SELECT * FROM "Order" WHERE id = ?').get(where.id);
        if (!order) return null;
        
        if (include && include.items) {
          order.items = db.prepare('SELECT oi.*, mi.name as menuItemName FROM OrderItem oi JOIN MenuItem mi ON oi.menuItemId = mi.id WHERE oi.orderId = ?').all(order.id);
        }
        
        return order;
      },
      create: async ({ data, include }) => {
        const stmt = db.prepare('INSERT INTO "Order" (customerName, customerPhone, customerEmail, deliveryAddress, orderType, status, totalAmount, paymentMethod, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(
          data.customerName,
          data.customerPhone,
          data.customerEmail,
          data.deliveryAddress,
          data.orderType || 'to-go',
          data.status || 'pending',
          data.totalAmount,
          data.paymentMethod || 'cash',
          data.notes
        );
        
        const orderId = result.lastInsertRowid;
        
        // Create order items if provided
        if (data.items && data.items.create) {
          const itemStmt = db.prepare('INSERT INTO OrderItem (orderId, menuItemId, quantity, priceAtOrder, itemNameAtOrder, notes) VALUES (?, ?, ?, ?, ?, ?)');
          for (const item of data.items.create) {
            itemStmt.run(orderId, item.menuItemId, item.quantity, item.priceAtOrder, item.itemNameAtOrder, item.notes);
          }
        }
        
        const order = { 
          id: orderId, 
          ...data, 
          orderType: data.orderType || 'to-go',
          status: data.status || 'pending',
          paymentMethod: data.paymentMethod || 'cash',
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
        
        if (include && include.items) {
          order.items = db.prepare('SELECT oi.*, mi.name as menuItemName FROM OrderItem oi JOIN MenuItem mi ON oi.menuItemId = mi.id WHERE oi.orderId = ?').all(orderId);
        }
        
        return order;
      },
      update: async ({ where, data, include }) => {
        const stmt = db.prepare('UPDATE "Order" SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(data.status, where.id);
        
        const order = db.prepare('SELECT * FROM "Order" WHERE id = ?').get(where.id);
        
        if (include && include.items) {
          order.items = db.prepare('SELECT oi.*, mi.name as menuItemName FROM OrderItem oi JOIN MenuItem mi ON oi.menuItemId = mi.id WHERE oi.orderId = ?').all(where.id);
        }
        
        return order;
      }
    };

    this.post = {
      findMany: async ({ include, orderBy } = {}) => {
        let query = 'SELECT p.*, u.username, u.email FROM Post p JOIN User u ON p.authorId = u.id ORDER BY p.createdAt DESC';
        const posts = db.prepare(query).all();
        return posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          published: Boolean(post.published),
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          author: {
            id: post.authorId,
            username: post.username,
            email: post.email
          }
        }));
      },
      findUnique: async ({ where, include }) => {
        const post = db.prepare('SELECT p.*, u.username, u.email FROM Post p JOIN User u ON p.authorId = u.id WHERE p.id = ?').get(where.id);
        if (!post) return null;
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          published: Boolean(post.published),
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          author: {
            id: post.authorId,
            username: post.username,
            email: post.email
          }
        };
      },
      create: async ({ data, include }) => {
        const stmt = db.prepare('INSERT INTO Post (title, content, published, authorId) VALUES (?, ?, ?, ?)');
        const result = stmt.run(data.title, data.content, data.published ? 1 : 0, data.authorId);
        
        const post = db.prepare('SELECT p.*, u.username, u.email FROM Post p JOIN User u ON p.authorId = u.id WHERE p.id = ?').get(result.lastInsertRowid);
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          published: Boolean(post.published),
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          author: {
            id: post.authorId,
            username: post.username,
            email: post.email
          }
        };
      },
      update: async ({ where, data, include }) => {
        const stmt = db.prepare('UPDATE Post SET title = ?, content = ?, published = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(data.title, data.content, data.published ? 1 : 0, where.id);
        
        const post = db.prepare('SELECT p.*, u.username, u.email FROM Post p JOIN User u ON p.authorId = u.id WHERE p.id = ?').get(where.id);
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          published: Boolean(post.published),
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          author: {
            id: post.authorId,
            username: post.username,
            email: post.email
          }
        };
      },
      delete: async ({ where }) => {
        db.prepare('DELETE FROM Post WHERE id = ?').run(where.id);
        return {};
      }
    };
  }

  async $disconnect() {
    // Close the database connection
    db.close();
  }
}

module.exports = new MockPrismaClient();