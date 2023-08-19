const { validationResult } = require('express-validator')

module.exports = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const result = {
      success: false,
      message: errors.array()[0].msg,
      error: errors.array(),
    }
    res.status(400).json(result);
  };
};
