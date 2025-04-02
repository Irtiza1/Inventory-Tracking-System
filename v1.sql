-- ==========================
-- Stage 1: Single Store Model
-- ==========================

-- Create Products Table
CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    product_code TEXT UNIQUE NOT NULL,  -- More descriptive than SKU
    price DECIMAL(10,2) NOT NULL,
    initial_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,  -- Clearer for available stock
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create InventoryMovement Table
CREATE TABLE IF NOT EXISTS InventoryMovement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    movement_type TEXT CHECK (movement_type IN ('stock-in', 'sale', 'manual-removal')),
    quantity INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_code ON Products(product_code);
CREATE INDEX IF NOT EXISTS idx_inventorymovement_product ON InventoryMovement(product_id);
