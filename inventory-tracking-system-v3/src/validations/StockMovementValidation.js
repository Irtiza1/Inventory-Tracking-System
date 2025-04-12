const Joi = require('joi');

const validateStockMovement = (movement) => {
  const schema = Joi.object({
    product_id: Joi.number().integer().required(),
    store_id: Joi.number().integer().required(),
    movement_type: Joi.string().valid('stock-in', 'sale', 'manual-removal').required(),
    quantity: Joi.number().integer().required(),
  });
  return schema.validate(movement);
};

module.exports = { validateStockMovement };
