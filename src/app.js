const express = require('express');
const app = express();

app.use(express.json());

app.use('/companies', require('./modules/company/company.routes'));
app.use('/documents', require('./modules/document/document.routes'));

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;