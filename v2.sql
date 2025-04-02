-- ==========================
-- Stage 2: Multi-Store, Multi-Supplier Model
-- ==========================

CREATE TABLE Store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT
);

CREATE TABLE Supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info TEXT
);

ALTER TABLE Product ADD COLUMN supplier_id INT REFERENCES Supplier(id);

CREATE TABLE StoreStock (
    id SERIAL PRIMARY KEY,
    store_id INT REFERENCES Store(id) ON DELETE CASCADE,
    product_id INT REFERENCES Product(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0,
    UNIQUE (store_id, product_id) -- Prevent duplicate store-product entries
);

ALTER TABLE StockMovement ADD COLUMN store_id INT REFERENCES Store(id) ON DELETE CASCADE;

CREATE TABLE UserAccount (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'store-manager'))
);

-- 🔹 Index for fast store-product lookups
CREATE INDEX idx_storestock_store_product ON StoreStock(store_id, product_id);
