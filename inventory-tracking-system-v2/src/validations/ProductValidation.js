const Joi = require('joi');

const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),
    productCode: Joi.string().trim().required().messages({
      'string.empty': 'Product code is required',
      'any.required': 'Product code is required'
    }),
    price: Joi.number().required().messages({
      'number.base': 'Price must be a number',
      'any.required': 'Price is required'
    }),
    initialQuantity: Joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be an integer',
      'number.min': 'Quantity must be a positive integer',
      'any.required': 'Quantity is required'
    })
  });

  return schema.validate(product);
};

module.exports = { validateProduct };

