function errorMiddleware(error, req, res, next) {

  console.error(error);

  return res.status(400).json({
    success: false,
    message: error.message || 'Error interno del servidor.'
  });

}

module.exports = errorMiddleware;