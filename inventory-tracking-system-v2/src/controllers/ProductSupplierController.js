const ProductService = require('../services/ProductSupplierService');

exports.viewProductSupplierList = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const products = await ProductService.viewProductSupplierList(searchTerm);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
