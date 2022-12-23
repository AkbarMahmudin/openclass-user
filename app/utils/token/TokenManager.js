require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
    if (err) throw new Error(err.message)

    return decode
  })
}

module.exports = {
  generateToken,
  verifyToken
}
