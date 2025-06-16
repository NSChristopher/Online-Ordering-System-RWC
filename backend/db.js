const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Simple SQLite database initialization
const db = new Database(path.join(__dirname, 'prisma', 'dev.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    published INTEGER DEFAULT 0,
    authorId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS MenuItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    available INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Order" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    customerPhone TEXT,
    status TEXT DEFAULT 'pending',
    totalAmount REAL NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS OrderItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    menuItemId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES "Order"(id) ON DELETE CASCADE,
    FOREIGN KEY (menuItemId) REFERENCES MenuItem(id)
  );
`);

// Simple ORM-like interface
const createUser = db.prepare(`
  INSERT INTO User (email, username, password) 
  VALUES (?, ?, ?)
`);

const findUserByEmail = db.prepare(`
  SELECT * FROM User WHERE email = ?
`);

const findUserById = db.prepare(`
  SELECT * FROM User WHERE id = ?
`);

const createPost = db.prepare(`
  INSERT INTO Post (title, content, published, authorId) 
  VALUES (?, ?, ?, ?)
`);

const findAllPosts = db.prepare(`
  SELECT p.*, u.username, u.email 
  FROM Post p 
  JOIN User u ON p.authorId = u.id 
  ORDER BY p.createdAt DESC
`);

const findPostById = db.prepare(`
  SELECT p.*, u.username, u.email 
  FROM Post p 
  JOIN User u ON p.authorId = u.id 
  WHERE p.id = ?
`);

const updatePost = db.prepare(`
  UPDATE Post 
  SET title = ?, content = ?, published = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deletePost = db.prepare(`
  DELETE FROM Post WHERE id = ?
`);

// Order operations
const createOrder = db.prepare(`
  INSERT INTO "Order" (customerName, customerPhone, status, totalAmount, notes) 
  VALUES (?, ?, ?, ?, ?)
`);

const findAllOrders = db.prepare(`
  SELECT * FROM "Order" ORDER BY createdAt DESC
`);

const findOrderById = db.prepare(`
  SELECT * FROM "Order" WHERE id = ?
`);

const updateOrderStatus = db.prepare(`
  UPDATE "Order" 
  SET status = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const findOrdersByStatus = db.prepare(`
  SELECT * FROM "Order" WHERE status = ? ORDER BY createdAt DESC
`);

// OrderItem operations
const createOrderItem = db.prepare(`
  INSERT INTO OrderItem (orderId, menuItemId, quantity, price, notes) 
  VALUES (?, ?, ?, ?, ?)
`);

const findOrderItemsByOrderId = db.prepare(`
  SELECT oi.*, m.name as menuItemName, m.description as menuItemDescription 
  FROM OrderItem oi 
  JOIN MenuItem m ON oi.menuItemId = m.id 
  WHERE oi.orderId = ?
`);

// MenuItem operations
const createMenuItem = db.prepare(`
  INSERT INTO MenuItem (name, description, price, category, available) 
  VALUES (?, ?, ?, ?, ?)
`);

const findAllMenuItems = db.prepare(`
  SELECT * FROM MenuItem WHERE available = 1 ORDER BY category, name
`);

const findMenuItemById = db.prepare(`
  SELECT * FROM MenuItem WHERE id = ?
`);

module.exports = {
  user: {
    create: (data) => {
      const result = createUser.run(data.email, data.username, data.password);
      return { id: result.lastInsertRowid, ...data };
    },
    findUnique: ({ where }) => {
      if (where.email) return findUserByEmail.get(where.email);
      if (where.id) return findUserById.get(where.id);
      return null;
    },
    findFirst: ({ where }) => {
      if (where.OR) {
        for (const condition of where.OR) {
          if (condition.email) {
            const user = findUserByEmail.get(condition.email);
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
  },
  post: {
    create: ({ data, include }) => {
      const result = createPost.run(data.title, data.content, data.published ? 1 : 0, data.authorId);
      const post = findPostById.get(result.lastInsertRowid);
      return {
        id: result.lastInsertRowid,
        title: data.title,
        content: data.content,
        published: Boolean(data.published),
        authorId: data.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: post.authorId,
          username: post.username,
          email: post.email
        }
      };
    },
    findMany: ({ include, orderBy }) => {
      const posts = findAllPosts.all();
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
    findUnique: ({ where, include }) => {
      const post = findPostById.get(where.id);
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
    update: ({ where, data, include }) => {
      const current = findPostById.get(where.id);
      if (!current) return null;
      
      const title = data.title ?? current.title;
      const content = data.content !== undefined ? data.content : current.content;
      const published = data.published !== undefined ? (data.published ? 1 : 0) : current.published;
      
      updatePost.run(title, content, published, where.id);
      
      return {
        id: current.id,
        title,
        content,
        published: Boolean(published),
        authorId: current.authorId,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        author: {
          id: current.authorId,
          username: current.username,
          email: current.email
        }
      };
    },
    delete: ({ where }) => {
      deletePost.run(where.id);
      return {};
    }
  },
  order: {
    create: ({ data }) => {
      const result = createOrder.run(
        data.customerName, 
        data.customerPhone, 
        data.status || 'pending', 
        data.totalAmount, 
        data.notes
      );
      const orderId = result.lastInsertRowid;
      
      // Create order items if provided
      if (data.orderItems) {
        for (const item of data.orderItems) {
          createOrderItem.run(orderId, item.menuItemId, item.quantity, item.price, item.notes);
        }
      }
      
      return module.exports.order.findUnique({ where: { id: orderId }, include: { orderItems: true } });
    },
    findMany: ({ where, include, orderBy } = {}) => {
      let orders;
      if (where?.status) {
        orders = findOrdersByStatus.all(where.status);
      } else {
        orders = findAllOrders.all();
      }
      
      return orders.map(order => {
        const result = {
          id: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          status: order.status,
          totalAmount: order.totalAmount,
          notes: order.notes,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        };
        
        if (include?.orderItems) {
          result.orderItems = findOrderItemsByOrderId.all(order.id);
        }
        
        return result;
      });
    },
    findUnique: ({ where, include }) => {
      const order = findOrderById.get(where.id);
      if (!order) return null;
      
      const result = {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        status: order.status,
        totalAmount: order.totalAmount,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
      
      if (include?.orderItems) {
        result.orderItems = findOrderItemsByOrderId.all(order.id);
      }
      
      return result;
    },
    update: ({ where, data }) => {
      if (data.status) {
        updateOrderStatus.run(data.status, where.id);
      }
      return module.exports.order.findUnique({ where, include: { orderItems: true } });
    }
  },
  menuItem: {
    create: ({ data }) => {
      const result = createMenuItem.run(
        data.name, 
        data.description, 
        data.price, 
        data.category, 
        data.available !== false ? 1 : 0
      );
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: () => {
      return findAllMenuItems.all().map(item => ({
        ...item,
        available: Boolean(item.available)
      }));
    },
    findUnique: ({ where }) => {
      const item = findMenuItemById.get(where.id);
      if (!item) return null;
      return {
        ...item,
        available: Boolean(item.available)
      };
    }
  },
  $disconnect: () => {
    db.close();
  }
};