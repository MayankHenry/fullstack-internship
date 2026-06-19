const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            image TEXT,
            category TEXT
        )`, () => {
            // Seed products if empty
            db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
                if (row && row.count === 0) {
                    seedProducts();
                }
            });
        });

        // Cart Table
        db.run(`CREATE TABLE IF NOT EXISTS carts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Cart Items Table
        db.run(`CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cart_id INTEGER,
            product_id INTEGER,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY (cart_id) REFERENCES carts(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);
    });
}

function seedProducts() {
    const products = [
        { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 30-hour battery life.', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', category: 'Electronics' },
        { name: 'Smartphone 12 Pro', description: 'Latest smartphone with 5G capabilities and pro camera system.', price: 999.00, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', category: 'Electronics' },
        { name: 'Minimalist Watch', description: 'Elegant and simple watch with leather strap.', price: 149.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', category: 'Accessories' },
        { name: 'Cotton T-Shirt', description: 'Comfortable 100% cotton casual t-shirt.', price: 25.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', category: 'Clothing' },
        { name: 'Running Sneakers', description: 'Lightweight running shoes for all terrains.', price: 120.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', category: 'Clothing' },
        { name: 'Gaming Laptop', description: 'High-performance laptop with RTX 4080 and 32GB RAM.', price: 1899.99, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', category: 'Electronics' }
    ];

    const stmt = db.prepare(`INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)`);
    products.forEach(p => {
        stmt.run(p.name, p.description, p.price, p.image, p.category);
    });
    stmt.finalize();
    console.log('Products seeded.');
}

module.exports = db;
