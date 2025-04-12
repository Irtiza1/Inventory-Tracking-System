const { Product, StoreStock, StockMovement } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ReportService {
  static async getStoreInventoryReport(storeId) {
    return StoreStock.findAll({
      where: { store_id: storeId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'product_code']
      }],
      attributes: [
        'quantity',
        [Sequelize.literal(`(
          SELECT COUNT(*) FROM "StockMovements" AS sm
          WHERE sm.product_id = "StoreStock".product_id
          AND sm.store_id = ${storeId}
        )`), 'movement_count']
      ]
    });
  }

  static async getSalesReport(storeId, startDate, endDate) {
    return StockMovement.findAll({
      where: {
        store_id: storeId,
        movement_type: 'sale',
        timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Product,
        attributes: ['id', 'name']
      }],
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold']
      ],
      group: ['Product.id', 'Product.name', 'StockMovement.product_id', 'Product->StockMovement.id']
    });
  }
}

module.exports = ReportService;


// // services/ReportService.js
// const db = require('../db/database');
// const StoreStock = require('../models/StoreStockModel');
// const Product = require('../models/ProductModel');
// const StockMovement = require('../models/StockMovementModel');

// class ReportService {
//     static async getStoreInventoryReport(storeId) {
//       return db.any( /*logical error */
//         `SELECT p.id, p.name, p.product_code, ss.quantity,
//          (SELECT COUNT(*) FROM StockMovement sm 
//           WHERE sm.product_id = p.id AND sm.store_id = $1) as movement_count
//          FROM StoreStock ss
//          JOIN Product p ON ss.product_id = p.id
//          WHERE ss.store_id = $1`,
//         [storeId]
//       );
//     }
  
//     static async getSalesReport(storeId, startDate, endDate) {
//       return db.any( /*logical error */
//         `SELECT p.id, p.name, SUM(sm.quantity) as total_sold
//          FROM StockMovement sm
//          JOIN product p ON sm.product_id = p.id
//          WHERE sm.store_id = $1 
//          AND sm.movement_type = 'sale'
//          AND sm.timestamp BETWEEN $2 AND $3
//          GROUP BY p.id, p.name`,
//         [storeId, startDate, endDate]
//       );
//     }
//   }
  
//   module.exports = ReportService;