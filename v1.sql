-- ==========================
-- Stage 1: Single Store Model
-- ==========================

CREATE TABLE Product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    initial_quantity INT NOT NULL DEFAULT 0, -- Tracks first quantity added
    current_quantity INT NOT NULL DEFAULT 0, -- Updated when stock moves
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StockMovement (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Product(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('stock-in', 'sale', 'manual-removal')),
    quantity INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Index for faster lookups
CREATE INDEX idx_product_sku ON Product(sku);
CREATE INDEX idx_stockmovement_product ON StockMovement(product_id);
