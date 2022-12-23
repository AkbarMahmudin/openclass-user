const Joi = require('joi')
const InvariantError = require('@utils/exceptions/InvariantError')

const postValidator = (req, res, next) => {
  try {
    // Schema input
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(16).required()
    })
    const validateResult = schema.validate(req.body)
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

const putValidator = (req, res, next) => {
  try {
    // Schema input
    const opt = {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().min(8).max(16)
    }

    if (req.body.password) {
      opt.repeat_password = Joi.any().valid(Joi.ref('password')).required()
    }

    const schema = Joi.object(opt)

    const validateResult = schema.validate(req.body)
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postValidator, putValidator
}
