const Joi = require('joi');

const validateUser = (user, isUpdate = false) => {
  const schema = Joi.object({
    username: Joi.string().max(255).required(),
    password: isUpdate ? Joi.string().min(6).optional() : Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'store-manager', 'analytics', 'supplier').required(),
    store_id: Joi.number().integer().allow(null),
    supplier_id: Joi.number().integer().allow(null),
  });
  return schema.validate(user);
};

module.exports = { validateUser };
