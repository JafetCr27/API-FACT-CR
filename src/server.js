require('dotenv').config();
const app = require('./app');

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});