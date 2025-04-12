const AlertService = require('../services/AlertService');

exports.checkLowStock = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const alerts = await AlertService.checkLowStock(threshold);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
