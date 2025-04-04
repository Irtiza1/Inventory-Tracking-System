const Joi = require('joi');

const validateSupplier = (supplier) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    contact_info: Joi.string().allow(null, ''),
  });
  return schema.validate(supplier);
};

module.exports = { validateSupplier };
