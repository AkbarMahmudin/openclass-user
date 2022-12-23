module.exports = (res, statusCode = 200, status = 'success', message, data) => {
  return res.json(statusCode, {
    status,
    data,
    message
  })
}
