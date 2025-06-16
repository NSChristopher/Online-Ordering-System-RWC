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

  CREATE TABLE IF NOT EXISTS business_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    hours TEXT NOT NULL,
    logoUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS menu_category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sortOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS menu_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menuCategoryId INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT,
    visible INTEGER DEFAULT 1,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (menuCategoryId) REFERENCES menu_category(id)
  );

  CREATE TABLE IF NOT EXISTS "order" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    customerEmail TEXT,
    deliveryAddress TEXT,
    orderType TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'new',
    paymentMethod TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    menuItemId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    priceAtOrder REAL NOT NULL,
    itemNameAtOrder TEXT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES "order"(id),
    FOREIGN KEY (menuItemId) REFERENCES menu_item(id)
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

// Order system prepared statements
const findAllOrders = db.prepare(`
  SELECT * FROM "order" 
  ORDER BY createdAt DESC
`);

const findOrderById = db.prepare(`
  SELECT * FROM "order" WHERE id = ?
`);

const updateOrderStatus = db.prepare(`
  UPDATE "order" 
  SET status = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const findOrderItems = db.prepare(`
  SELECT oi.*, mi.name as menuItemName
  FROM order_item oi
  JOIN menu_item mi ON oi.menuItemId = mi.id
  WHERE oi.orderId = ?
`);

const createOrder = db.prepare(`
  INSERT INTO "order" (customerName, customerPhone, customerEmail, deliveryAddress, orderType, total, status, paymentMethod) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const createOrderItem = db.prepare(`
  INSERT INTO order_item (orderId, menuItemId, quantity, priceAtOrder, itemNameAtOrder) 
  VALUES (?, ?, ?, ?, ?)
`);

// Menu system prepared statements
const findAllMenuCategories = db.prepare(`
  SELECT * FROM menu_category ORDER BY sortOrder
`);

const findMenuItemsByCategory = db.prepare(`
  SELECT * FROM menu_item WHERE menuCategoryId = ? AND visible = 1 ORDER BY sortOrder
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
    findMany: ({ include, orderBy }) => {
      const orders = findAllOrders.all();
      return orders.map(order => ({
        ...order,
        total: parseFloat(order.total),
        published: Boolean(order.published),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderItems: include?.orderItems ? findOrderItems.all(order.id) : undefined
      }));
    },
    findUnique: ({ where, include }) => {
      const order = findOrderById.get(where.id);
      if (!order) return null;
      
      return {
        ...order,
        total: parseFloat(order.total),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderItems: include?.orderItems ? findOrderItems.all(order.id) : undefined
      };
    },
    update: ({ where, data }) => {
      if (data.status) {
        updateOrderStatus.run(data.status, where.id);
      }
      return findOrderById.get(where.id);
    },
    create: ({ data }) => {
      const result = createOrder.run(
        data.customerName,
        data.customerPhone,
        data.customerEmail,
        data.deliveryAddress,
        data.orderType,
        data.total,
        data.status || 'new',
        data.paymentMethod
      );
      return { id: result.lastInsertRowid, ...data };
    }
  },
  orderItem: {
    createMany: ({ data }) => {
      const stmt = db.transaction((items) => {
        for (const item of items) {
          createOrderItem.run(
            item.orderId,
            item.menuItemId,
            item.quantity,
            item.priceAtOrder,
            item.itemNameAtOrder
          );
        }
      });
      stmt(data);
      return { count: data.length };
    }
  },
  menuCategory: {
    findMany: () => {
      return findAllMenuCategories.all();
    }
  },
  menuItem: {
    findMany: ({ where }) => {
      if (where?.menuCategoryId) {
        return findMenuItemsByCategory.all(where.menuCategoryId);
      }
      return db.prepare('SELECT * FROM menu_item WHERE visible = 1 ORDER BY sortOrder').all();
    },
    findFirst: ({ where }) => {
      if (where?.name) {
        return db.prepare('SELECT * FROM menu_item WHERE name = ?').get(where.name);
      }
      return null;
    }
  },
  businessInfo: {
    findFirst: () => {
      return db.prepare('SELECT * FROM business_info LIMIT 1').get();
    }
  },
  $disconnect: () => {
    db.close();
  }
};