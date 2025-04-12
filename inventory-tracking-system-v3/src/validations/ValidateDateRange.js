const Joi = require('joi');

const validateDateRange = (queryParams) => {
  const schema = Joi.object({
    startDate: Joi.date().iso().required().messages({
      'date.base': 'startDate must be a valid date in YYYY-MM-DD format',
      'any.required': 'startDate is required'
    }),
    endDate: Joi.date().iso().required().messages({
      'date.base': 'endDate must be a valid date in YYYY-MM-DD format',
      'any.required': 'endDate is required'
    })
  });

  return schema.validate(queryParams);
};

module.exports = { validateDateRange };
