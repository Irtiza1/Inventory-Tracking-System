const Joi = require('joi');

const validateStore = (store) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    location: Joi.string().allow('').optional(),
  });
  return schema.validate(store);
};

module.exports = { validateStore };
