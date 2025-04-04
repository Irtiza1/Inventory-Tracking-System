-- ✅ PostgreSQL-Compatible Updated Schema for Stage 2
-- 🔹 Supplier Table
CREATE TABLE IF NOT EXISTS Supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info TEXT
);

-- 🔹 Product Table
CREATE TABLE IF NOT EXISTS Product (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    product_code TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    initial_quantity INTEGER NOT NULL DEFAULT 0,
    supplier_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(id) ON DELETE SET NULL
);

-- 🔹 Store Table
CREATE TABLE IF NOT EXISTS Store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT
);

-- 🔹 Stock Movement Table
CREATE TABLE IF NOT EXISTS StockMovement (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
    movement_type TEXT CHECK (movement_type IN ('stock-in', 'sale', 'manual-removal')) NOT NULL,
    quantity INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES Store(id) ON DELETE CASCADE
);

-- 🔹 StoreStock Table
CREATE TABLE IF NOT EXISTS StoreStock (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (store_id, product_id),
    FOREIGN KEY (store_id) REFERENCES Store(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
);

-- 🔹 UserAccount Table with Role-Based Access
CREATE TABLE IF NOT EXISTS UserAccount (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'store-manager', 'analytics', 'supplier')) NOT NULL,
    store_id INTEGER, -- only applicable for store-manager
    supplier_id INTEGER, -- only applicable for supplier role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES Store(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(id) ON DELETE SET NULL
);

-- 🔹 Indexes
CREATE INDEX IF NOT EXISTS idx_product_code ON Product(product_code);
CREATE INDEX IF NOT EXISTS idx_stockmovement_product ON StockMovement(product_id);
CREATE INDEX IF NOT EXISTS idx_storestock_store_product ON StoreStock(store_id, product_id);
CREATE INDEX IF NOT EXISTS idx_useraccount_role ON UserAccount(role);
