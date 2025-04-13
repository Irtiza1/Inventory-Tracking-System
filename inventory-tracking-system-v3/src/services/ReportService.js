const { Product, StoreStock, StockMovement } = require('../db/index');
const { Op, Sequelize } = require('sequelize');

class ReportService {
  static async getStoreInventoryReport(storeId) {
    try {
      return await StoreStock.findAll({
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
    } catch (error) {
      throw new Error(`Error fetching store inventory report: ${error.message}`);
    }
  }

  static async getSalesReport(storeId, startDate, endDate) {
    try {
      return await StockMovement.findAll({
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
    } catch (error) {
      throw new Error(`Error fetching sales report: ${error.message}`);
    }
  }
}

module.exports = ReportService;

