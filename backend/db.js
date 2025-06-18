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

  CREATE TABLE IF NOT EXISTS BusinessInfo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    hours TEXT,
    logoUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS MenuCategory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS MenuItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menuCategoryId INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT,
    visible INTEGER DEFAULT 1,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menuCategoryId) REFERENCES MenuCategory(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Order" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    customerPhone TEXT,
    customerEmail TEXT,
    deliveryAddress TEXT,
    orderType TEXT DEFAULT 'to-go',
    status TEXT DEFAULT 'pending',
    totalAmount REAL NOT NULL,
    paymentMethod TEXT DEFAULT 'cash',
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS OrderItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    menuItemId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    priceAtOrder REAL NOT NULL,
    itemNameAtOrder TEXT NOT NULL,
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

// Business Info prepared statements
const findBusinessInfo = db.prepare(`
  SELECT * FROM BusinessInfo LIMIT 1
`);

const createBusinessInfo = db.prepare(`
  INSERT INTO BusinessInfo (name, address, phone, hours, logoUrl) 
  VALUES (?, ?, ?, ?, ?)
`);

const updateBusinessInfo = db.prepare(`
  UPDATE BusinessInfo 
  SET name = ?, address = ?, phone = ?, hours = ?, logoUrl = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

// Menu Category prepared statements
const findAllCategories = db.prepare(`
  SELECT * FROM MenuCategory ORDER BY sortOrder, name
`);

const findCategoryById = db.prepare(`
  SELECT * FROM MenuCategory WHERE id = ?
`);

const createCategory = db.prepare(`
  INSERT INTO MenuCategory (name, sortOrder) 
  VALUES (?, ?)
`);

const updateCategory = db.prepare(`
  UPDATE MenuCategory 
  SET name = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteCategory = db.prepare(`
  DELETE FROM MenuCategory WHERE id = ?
`);

// Menu Item prepared statements
const findAllItems = db.prepare(`
  SELECT mi.*, mc.name as categoryName 
  FROM MenuItem mi 
  JOIN MenuCategory mc ON mi.menuCategoryId = mc.id 
  ORDER BY mi.sortOrder, mi.name
`);

const findItemById = db.prepare(`
  SELECT mi.*, mc.name as categoryName 
  FROM MenuItem mi 
  JOIN MenuCategory mc ON mi.menuCategoryId = mc.id 
  WHERE mi.id = ?
`);

const findItemsByCategory = db.prepare(`
  SELECT * FROM MenuItem WHERE menuCategoryId = ? ORDER BY sortOrder, name
`);

const createItem = db.prepare(`
  INSERT INTO MenuItem (menuCategoryId, name, description, price, imageUrl, visible, sortOrder) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const updateItem = db.prepare(`
  UPDATE MenuItem 
  SET menuCategoryId = ?, name = ?, description = ?, price = ?, imageUrl = ?, visible = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteItem = db.prepare(`
  DELETE FROM MenuItem WHERE id = ?
`);

// Order prepared statements
const findAllOrders = db.prepare(`
  SELECT * FROM "Order" ORDER BY createdAt DESC
`);

const findOrderById = db.prepare(`
  SELECT * FROM "Order" WHERE id = ?
`);

const findOrdersByStatus = db.prepare(`
  SELECT * FROM "Order" WHERE status = ? ORDER BY createdAt DESC
`);

const createOrder = db.prepare(`
  INSERT INTO "Order" (customerName, customerPhone, customerEmail, deliveryAddress, orderType, status, totalAmount, paymentMethod, notes) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateOrderStatus = db.prepare(`
  UPDATE "Order" 
  SET status = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

// Order Item prepared statements
const findOrderItems = db.prepare(`
  SELECT oi.*, mi.name as menuItemName, mi.description as menuItemDescription
  FROM OrderItem oi 
  JOIN MenuItem mi ON oi.menuItemId = mi.id 
  WHERE oi.orderId = ?
`);

const createOrderItem = db.prepare(`
  INSERT INTO OrderItem (orderId, menuItemId, quantity, priceAtOrder, itemNameAtOrder, notes) 
  VALUES (?, ?, ?, ?, ?, ?)
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
  businessInfo: {
    findFirst: () => {
      return findBusinessInfo.get();
    },
    create: ({ data }) => {
      const result = createBusinessInfo.run(data.name, data.address, data.phone, data.hours, data.logoUrl);
      return { id: result.lastInsertRowid, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    },
    update: ({ where, data }) => {
      const current = findBusinessInfo.get();
      if (!current) return null;
      
      const name = data.name ?? current.name;
      const address = data.address !== undefined ? data.address : current.address;
      const phone = data.phone !== undefined ? data.phone : current.phone;
      const hours = data.hours !== undefined ? data.hours : current.hours;
      const logoUrl = data.logoUrl !== undefined ? data.logoUrl : current.logoUrl;
      
      updateBusinessInfo.run(name, address, phone, hours, logoUrl, current.id);
      
      return {
        id: current.id,
        name,
        address,
        phone,
        hours,
        logoUrl,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
      };
    }
  },
  menuCategory: {
    findMany: () => {
      const categories = findAllCategories.all();
      return categories.map(category => ({
        ...category,
        items: findItemsByCategory.all(category.id)
      }));
    },
    findUnique: ({ where }) => {
      const category = findCategoryById.get(where.id);
      if (!category) return null;
      return {
        ...category,
        items: findItemsByCategory.all(category.id)
      };
    },
    create: ({ data }) => {
      const result = createCategory.run(data.name, data.sortOrder || 0);
      return { 
        id: result.lastInsertRowid, 
        ...data, 
        sortOrder: data.sortOrder || 0,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      };
    },
    update: ({ where, data }) => {
      const current = findCategoryById.get(where.id);
      if (!current) return null;
      
      const name = data.name ?? current.name;
      const sortOrder = data.sortOrder !== undefined ? data.sortOrder : current.sortOrder;
      
      updateCategory.run(name, sortOrder, where.id);
      
      return {
        id: current.id,
        name,
        sortOrder,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
      };
    },
    delete: ({ where }) => {
      deleteCategory.run(where.id);
      return {};
    }
  },
  menuItem: {
    findMany: () => {
      return findAllItems.all().map(item => ({
        ...item,
        visible: Boolean(item.visible)
      }));
    },
    findUnique: ({ where }) => {
      const item = findItemById.get(where.id);
      if (!item) return null;
      return {
        ...item,
        visible: Boolean(item.visible)
      };
    },
    create: ({ data }) => {
      const result = createItem.run(
        data.menuCategoryId, 
        data.name, 
        data.description, 
        data.price, 
        data.imageUrl, 
        data.visible ? 1 : 0, 
        data.sortOrder || 0
      );
      return { 
        id: result.lastInsertRowid, 
        ...data, 
        visible: Boolean(data.visible),
        sortOrder: data.sortOrder || 0,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      };
    },
    update: ({ where, data }) => {
      const current = findItemById.get(where.id);
      if (!current) return null;
      
      const menuCategoryId = data.menuCategoryId ?? current.menuCategoryId;
      const name = data.name ?? current.name;
      const description = data.description !== undefined ? data.description : current.description;
      const price = data.price ?? current.price;
      const imageUrl = data.imageUrl !== undefined ? data.imageUrl : current.imageUrl;
      const visible = data.visible !== undefined ? (data.visible ? 1 : 0) : current.visible;
      const sortOrder = data.sortOrder !== undefined ? data.sortOrder : current.sortOrder;
      
      updateItem.run(menuCategoryId, name, description, price, imageUrl, visible, sortOrder, where.id);
      
      return {
        id: current.id,
        menuCategoryId,
        name,
        description,
        price,
        imageUrl,
        visible: Boolean(visible),
        sortOrder,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
      };
    },
    delete: ({ where }) => {
      deleteItem.run(where.id);
      return {};
    }
  },
  order: {
    findMany: ({ where }) => {
      let orders;
      if (where && where.status) {
        orders = findOrdersByStatus.all(where.status);
      } else {
        orders = findAllOrders.all();
      }
      
      return orders.map(order => ({
        ...order,
        items: findOrderItems.all(order.id)
      }));
    },
    findUnique: ({ where }) => {
      const order = findOrderById.get(where.id);
      if (!order) return null;
      return {
        ...order,
        items: findOrderItems.all(order.id)
      };
    },
    create: ({ data }) => {
      const result = createOrder.run(
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
      
      // Create order items
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          createOrderItem.run(
            orderId,
            item.menuItemId,
            item.quantity,
            item.priceAtOrder,
            item.itemNameAtOrder,
            item.notes
          );
        }
      }
      
      return { 
        id: orderId, 
        ...data, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        items: findOrderItems.all(orderId)
      };
    },
    update: ({ where, data }) => {
      const current = findOrderById.get(where.id);
      if (!current) return null;
      
      if (data.status) {
        updateOrderStatus.run(data.status, where.id);
      }
      
      return {
        ...current,
        status: data.status || current.status,
        updatedAt: new Date().toISOString(),
        items: findOrderItems.all(where.id)
      };
    }
  },
  $disconnect: () => {
    db.close();
  }
};