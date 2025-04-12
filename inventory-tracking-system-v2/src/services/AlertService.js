const { StoreStock, Product, Store } = require('../models');
const { Op } = require('sequelize');

class AlertService {
  static async checkLowStock(threshold = 10) {
    return StoreStock.findAll({
      where: {
        quantity: { [Op.lt]: threshold }
      },
      include: [
        {
          model: Product,
          attributes: ['name']
        },
        {
          model: Store,
          attributes: ['name']
        }
      ]
    });
  }
}

module.exports = AlertService;



// // services/AlertService.js
// const StoreStock = require('../models/StoreStockModel');
// const Product = require('../models/ProductModel');
// const db = require('../db/database');

// class AlertService {
//   static async checkLowStock(threshold = 10) {
//     const lowStockItems = await db.any(
//       `SELECT s.*, p.name as product_name, st.name as store_name
//        FROM StoreStock s
//        JOIN Product p ON s.product_id = p.id
//        JOIN Store st ON s.store_id = st.id
//        WHERE s.quantity < $1`,
//       [threshold]
//     );
    
//     // In real app, would send email/notification here
//     return lowStockItems;
//   }
// }

// module.exports = AlertService;