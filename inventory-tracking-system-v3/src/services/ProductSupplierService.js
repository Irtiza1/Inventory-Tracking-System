const { Product, Supplier } = require('../db/index');
const { Op } = require('sequelize');

class EnhancedProductService {
  static async viewProductSupplierList(searchTerm) {
    try {
      return await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerm}%` } },
            { product_code: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        },
        include: {
          model: Supplier,
          attributes: ['name'],
        }
      });
    } catch (error) {
      throw new Error(`Error fetching product supplier list: ${error.message}`);
    }
  }
}

module.exports = EnhancedProductService;
