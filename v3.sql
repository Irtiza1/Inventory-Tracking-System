-- ==========================
-- Stage 3: Large Scale, Audited System
-- ==========================

CREATE TABLE AuditLog (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES UserAccount(id),
    action TEXT NOT NULL,
    entity_type VARCHAR(50), -- 'Product', 'StoreStock', etc.
    entity_id INT, -- ID of the affected entity
    details TEXT, -- JSON-like string describing the change
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EventQueue (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    related_entity_id INT, -- Can reference Product, Store, etc.
    payload JSONB NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'failed', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Index for fast entity tracking
CREATE INDEX idx_auditlog_entity ON AuditLog(entity_type, entity_id);
