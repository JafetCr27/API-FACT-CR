const service = require('./company.service');

async function create(req, res) {
  const company = await service.createCompany(req.body);
  res.json(company);
}

module.exports = { create };