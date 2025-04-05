// services/ProductService.js
class EnhancedProductService {
    static async searchProducts(searchTerm) {
      return db.any(
        `SELECT p.*, s.name as supplier_name 
         FROM product p
         LEFT JOIN supplier s ON p.supplier_id = s.id
         WHERE p.name ILIKE $1 OR p.product_code ILIKE $1`,
        [`%${searchTerm}%`]
      );
    }
  }
module.exports = EnhancedProductService;


/*// report.service.js
class InventoryReportService {
  static async generateDiscrepancyReport(store_id) {
    return db.any(`
      WITH calculated AS (
        SELECT product_id, 
               SUM(CASE WHEN movement_type = 'stock-in' THEN quantity ELSE -quantity END) as expected
        FROM stock_movement
        WHERE store_id = $1
        GROUP BY product_id
      )
      SELECT s.product_id, p.name, 
             s.quantity as system_quantity,
             c.expected as calculated_quantity,
             (s.quantity - c.expected) as discrepancy
      FROM store_stock s
      JOIN calculated c ON s.product_id = c.product_id
      JOIN products p ON s.product_id = p.id
      WHERE s.store_id = $1 
      AND s.quantity != c.expected
    `, [store_id]);
  }
} */