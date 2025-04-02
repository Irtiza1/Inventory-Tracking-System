-- ==========================
-- 🔹 Triggers for Automatic Stock Update
-- ==========================

CREATE OR REPLACE FUNCTION update_store_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'stock-in' THEN
        UPDATE StoreStock
        SET quantity = quantity + NEW.quantity
        WHERE store_id = NEW.store_id AND product_id = NEW.product_id;

        -- Update Product's overall quantity
        UPDATE Product
        SET current_quantity = current_quantity + NEW.quantity
        WHERE id = NEW.product_id;
        
    ELSIF NEW.type = 'sale' OR NEW.type = 'manual-removal' THEN
        UPDATE StoreStock
        SET quantity = quantity - NEW.quantity
        WHERE store_id = NEW.store_id AND product_id = NEW.product_id;

        -- Update Product's overall quantity
        UPDATE Product
        SET current_quantity = current_quantity - NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_movement_trigger
AFTER INSERT ON StockMovement
FOR EACH ROW
EXECUTE FUNCTION update_store_stock();
