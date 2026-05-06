const express = require('express');
const app = express();

app.use(express.json());

app.use('/companies', require('./modules/company/company.routes'));
app.use('/documents', require('./modules/document/document.routes'));
app.use('/auth', require('./modules/auth/auth.routes'));

app.post('/auth/register-test', (req, res) => {
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;