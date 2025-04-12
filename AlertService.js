const { StoreStock, Product, Store } = require('../models');
const { Op } = require('sequelize');

class AlertService {
  static async checkLowStock(threshold = 10) {
    try {
      return await StoreStock.findAll({
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
    } catch (error) {
      throw new Error(`Error checking low stock: ${error.message}`);
    }
  }
}

module.exports = AlertService;


