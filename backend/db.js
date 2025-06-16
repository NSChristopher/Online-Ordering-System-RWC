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
    FOREIGN KEY (menuCategoryId) REFERENCES MenuCategory(id)
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

  CREATE TABLE IF NOT EXISTS OrderTable (
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

  CREATE TABLE IF NOT EXISTS OrderItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    menuItemId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    priceAtOrder REAL NOT NULL,
    itemNameAtOrder TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES OrderTable(id),
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

// Menu Category prepared statements
const createMenuCategory = db.prepare(`
  INSERT INTO MenuCategory (name, sortOrder) 
  VALUES (?, ?)
`);

const findAllMenuCategories = db.prepare(`
  SELECT * FROM MenuCategory ORDER BY sortOrder ASC, name ASC
`);

const findMenuCategoryById = db.prepare(`
  SELECT * FROM MenuCategory WHERE id = ?
`);

const updateMenuCategory = db.prepare(`
  UPDATE MenuCategory 
  SET name = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteMenuCategory = db.prepare(`
  DELETE FROM MenuCategory WHERE id = ?
`);

// Menu Item prepared statements
const createMenuItem = db.prepare(`
  INSERT INTO MenuItem (menuCategoryId, name, description, price, imageUrl, visible, sortOrder) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const findAllMenuItems = db.prepare(`
  SELECT mi.*, mc.name as categoryName 
  FROM MenuItem mi 
  JOIN MenuCategory mc ON mi.menuCategoryId = mc.id 
  ORDER BY mc.sortOrder ASC, mi.sortOrder ASC, mi.name ASC
`);

const findMenuItemsByCategory = db.prepare(`
  SELECT * FROM MenuItem 
  WHERE menuCategoryId = ? 
  ORDER BY sortOrder ASC, name ASC
`);

const findMenuItemById = db.prepare(`
  SELECT mi.*, mc.name as categoryName 
  FROM MenuItem mi 
  JOIN MenuCategory mc ON mi.menuCategoryId = mc.id 
  WHERE mi.id = ?
`);

const updateMenuItem = db.prepare(`
  UPDATE MenuItem 
  SET menuCategoryId = ?, name = ?, description = ?, price = ?, imageUrl = ?, visible = ?, sortOrder = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteMenuItem = db.prepare(`
  DELETE FROM MenuItem WHERE id = ?
`);

// Business Info prepared statements
const createBusinessInfo = db.prepare(`
  INSERT INTO BusinessInfo (name, address, phone, hours, logoUrl) 
  VALUES (?, ?, ?, ?, ?)
`);

const findBusinessInfo = db.prepare(`
  SELECT * FROM BusinessInfo ORDER BY id ASC LIMIT 1
`);

const updateBusinessInfo = db.prepare(`
  UPDATE BusinessInfo 
  SET name = ?, address = ?, phone = ?, hours = ?, logoUrl = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

// Order prepared statements
const createOrder = db.prepare(`
  INSERT INTO OrderTable (customerName, customerPhone, customerEmail, deliveryAddress, orderType, total, status, paymentMethod) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const findAllOrders = db.prepare(`
  SELECT * FROM OrderTable ORDER BY createdAt DESC
`);

const findOrderById = db.prepare(`
  SELECT * FROM OrderTable WHERE id = ?
`);

const updateOrderStatus = db.prepare(`
  UPDATE OrderTable 
  SET status = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteOrder = db.prepare(`
  DELETE FROM OrderTable WHERE id = ?
`);

// Order Item prepared statements
const createOrderItem = db.prepare(`
  INSERT INTO OrderItem (orderId, menuItemId, quantity, priceAtOrder, itemNameAtOrder) 
  VALUES (?, ?, ?, ?, ?)
`);

const findOrderItemsByOrderId = db.prepare(`
  SELECT oi.*, mi.name as currentMenuItemName, mi.price as currentPrice
  FROM OrderItem oi
  LEFT JOIN MenuItem mi ON oi.menuItemId = mi.id
  WHERE oi.orderId = ?
`);

const findAllOrderItems = db.prepare(`
  SELECT oi.*, o.customerName, mi.name as currentMenuItemName
  FROM OrderItem oi
  JOIN OrderTable o ON oi.orderId = o.id
  LEFT JOIN MenuItem mi ON oi.menuItemId = mi.id
  ORDER BY oi.orderId DESC, oi.id ASC
`);

// Initialize seed data after all prepared statements are defined
const seedData = () => {
  // Check if business info already exists
  const existingBusiness = findBusinessInfo.get();
  if (!existingBusiness) {
    // Create default business info
    createBusinessInfo.run(
      'Sample Restaurant',
      '123 Main Street, City, State 12345',
      '(555) 123-4567',
      'Mon-Thu: 11am-9pm, Fri-Sat: 11am-10pm, Sun: 12pm-8pm',
      null
    );
  }

  // Check if categories already exist
  const existingCategories = findAllMenuCategories.all();
  if (existingCategories.length === 0) {
    // Create default categories
    const appetizersResult = createMenuCategory.run('Appetizers', 1);
    const entreesResult = createMenuCategory.run('Entrees', 2);
    const drinksResult = createMenuCategory.run('Drinks', 3);

    // Create some sample menu items
    createMenuItem.run(appetizersResult.lastInsertRowid, 'Mozzarella Sticks', 'Crispy breaded mozzarella served with marinara sauce', 8.99, null, 1, 1);
    createMenuItem.run(appetizersResult.lastInsertRowid, 'Buffalo Wings', 'Spicy chicken wings with blue cheese dressing', 12.99, null, 1, 2);
    
    createMenuItem.run(entreesResult.lastInsertRowid, 'Classic Burger', 'Beef patty with lettuce, tomato, onion, and fries', 14.99, null, 1, 1);
    createMenuItem.run(entreesResult.lastInsertRowid, 'Grilled Chicken', 'Herb-seasoned grilled chicken breast with vegetables', 16.99, null, 1, 2);
    
    createMenuItem.run(drinksResult.lastInsertRowid, 'Soft Drinks', 'Coca-Cola, Pepsi, Sprite, and more', 2.99, null, 1, 1);
    createMenuItem.run(drinksResult.lastInsertRowid, 'Fresh Juice', 'Orange, apple, or cranberry juice', 3.99, null, 1, 2);
  }
};

// Call seed data function
seedData();

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
  menuCategory: {
    create: ({ data }) => {
      const result = createMenuCategory.run(data.name, data.sortOrder || 0);
      return {
        id: result.lastInsertRowid,
        name: data.name,
        sortOrder: data.sortOrder || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    findMany: () => {
      return findAllMenuCategories.all();
    },
    findUnique: ({ where }) => {
      if (where.id) return findMenuCategoryById.get(where.id);
      return null;
    },
    update: ({ where, data }) => {
      const current = findMenuCategoryById.get(where.id);
      if (!current) return null;
      
      const name = data.name ?? current.name;
      const sortOrder = data.sortOrder !== undefined ? data.sortOrder : current.sortOrder;
      
      updateMenuCategory.run(name, sortOrder, where.id);
      
      return {
        id: current.id,
        name,
        sortOrder,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
      };
    },
    delete: ({ where }) => {
      deleteMenuCategory.run(where.id);
      return {};
    }
  },
  menuItem: {
    create: ({ data }) => {
      const result = createMenuItem.run(
        data.menuCategoryId,
        data.name,
        data.description || null,
        data.price,
        data.imageUrl || null,
        data.visible !== undefined ? (data.visible ? 1 : 0) : 1,
        data.sortOrder || 0
      );
      return {
        id: result.lastInsertRowid,
        menuCategoryId: data.menuCategoryId,
        name: data.name,
        description: data.description || null,
        price: data.price,
        imageUrl: data.imageUrl || null,
        visible: Boolean(data.visible !== undefined ? data.visible : true),
        sortOrder: data.sortOrder || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    findMany: ({ where } = {}) => {
      if (where && where.menuCategoryId) {
        return findMenuItemsByCategory.all(where.menuCategoryId);
      }
      return findAllMenuItems.all();
    },
    findUnique: ({ where }) => {
      if (where.id) return findMenuItemById.get(where.id);
      return null;
    },
    update: ({ where, data }) => {
      const current = findMenuItemById.get(where.id);
      if (!current) return null;
      
      const menuCategoryId = data.menuCategoryId ?? current.menuCategoryId;
      const name = data.name ?? current.name;
      const description = data.description !== undefined ? data.description : current.description;
      const price = data.price ?? current.price;
      const imageUrl = data.imageUrl !== undefined ? data.imageUrl : current.imageUrl;
      const visible = data.visible !== undefined ? (data.visible ? 1 : 0) : current.visible;
      const sortOrder = data.sortOrder !== undefined ? data.sortOrder : current.sortOrder;
      
      updateMenuItem.run(menuCategoryId, name, description, price, imageUrl, visible, sortOrder, where.id);
      
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
      deleteMenuItem.run(where.id);
      return {};
    }
  },
  businessInfo: {
    create: ({ data }) => {
      const result = createBusinessInfo.run(
        data.name,
        data.address || null,
        data.phone || null,
        data.hours || null,
        data.logoUrl || null
      );
      return {
        id: result.lastInsertRowid,
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        hours: data.hours || null,
        logoUrl: data.logoUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    findFirst: () => {
      return findBusinessInfo.get();
    },
    findUnique: ({ where }) => {
      if (where.id) {
        return db.prepare('SELECT * FROM BusinessInfo WHERE id = ?').get(where.id);
      }
      return null;
    },
    update: ({ where, data }) => {
      const current = findBusinessInfo.get();
      if (!current) return null;
      
      const name = data.name ?? current.name;
      const address = data.address !== undefined ? data.address : current.address;
      const phone = data.phone !== undefined ? data.phone : current.phone;
      const hours = data.hours !== undefined ? data.hours : current.hours;
      const logoUrl = data.logoUrl !== undefined ? data.logoUrl : current.logoUrl;
      
      updateBusinessInfo.run(name, address, phone, hours, logoUrl, where.id || current.id);
      
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
  order: {
    create: ({ data }) => {
      const result = createOrder.run(
        data.customerName,
        data.customerPhone,
        data.customerEmail || null,
        data.deliveryAddress || null,
        data.orderType,
        data.total,
        data.status || 'new',
        data.paymentMethod || null
      );
      return {
        id: result.lastInsertRowid,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        deliveryAddress: data.deliveryAddress || null,
        orderType: data.orderType,
        total: data.total,
        status: data.status || 'new',
        paymentMethod: data.paymentMethod || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    findMany: ({ orderBy, include } = {}) => {
      const orders = findAllOrders.all();
      if (include?.orderItems) {
        return orders.map(order => ({
          ...order,
          orderItems: findOrderItemsByOrderId.all(order.id)
        }));
      }
      return orders;
    },
    findUnique: ({ where, include } = {}) => {
      if (where.id) {
        const order = findOrderById.get(where.id);
        if (order && include?.orderItems) {
          order.orderItems = findOrderItemsByOrderId.all(order.id);
        }
        return order;
      }
      return null;
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
        updatedAt: new Date().toISOString()
      };
    },
    delete: ({ where }) => {
      deleteOrder.run(where.id);
      return {};
    }
  },
  orderItem: {
    create: ({ data }) => {
      const result = createOrderItem.run(
        data.orderId,
        data.menuItemId,
        data.quantity,
        data.priceAtOrder,
        data.itemNameAtOrder
      );
      return {
        id: result.lastInsertRowid,
        orderId: data.orderId,
        menuItemId: data.menuItemId,
        quantity: data.quantity,
        priceAtOrder: data.priceAtOrder,
        itemNameAtOrder: data.itemNameAtOrder,
        createdAt: new Date().toISOString()
      };
    },
    findMany: ({ where } = {}) => {
      if (where?.orderId) {
        return findOrderItemsByOrderId.all(where.orderId);
      }
      return findAllOrderItems.all();
    }
  },
  $disconnect: () => {
    db.close();
  }
};