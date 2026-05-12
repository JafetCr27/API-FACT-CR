const express = require('express');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/companies', require('./modules/company/company.routes'));
app.use('/api/documents', require('./modules/document/document.routes'));
app.use('/api/auth', require('./modules/auth/auth.routes'));

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API-FACT-CR funcionando correctamente 🚀'
  });
});

// Test Route
app.post('/api/auth/register-test', (req, res) => {
  return res.status(200).json({
    success: true
  });
});

// 404 Middleware
const notFoundMiddleware = require('./middlewares/notFound.middleware');
app.use(notFoundMiddleware);

// Error Middleware
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;