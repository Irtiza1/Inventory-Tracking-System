// validations/StoreStockValidation.js
const Joi = require('joi');

const validateStoreStock = (stock) => {
  const schema = Joi.object({
    store_id: Joi.number().integer().required().messages({
      'number.base': 'Store ID must be a number',
      'any.required': 'Store ID is required'
    }),
    product_id: Joi.number().integer().required().messages({
      'number.base': 'Product ID must be a number',
      'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().min(0).default(0).messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity cannot be negative'
    })
  });

  return schema.validate(stock);
};

module.exports = { validateStoreStock };
