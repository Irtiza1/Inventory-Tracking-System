const ReportService = require('../services/ReportService');
const { validateDateRange } = require('../validations/ValidateDateRange');

exports.getStoreInventoryReport = async (req, res) => {
  try {
    const { storeId } = req.params;
    const report = await ReportService.getStoreInventoryReport(storeId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSalesReport = async (req, res) => {
  const { error } = validateDateRange(req.query);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  try {
    const { storeId } = req.params;
    const { startDate, endDate } = req.query;
    const report = await ReportService.getSalesReport(storeId, startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

