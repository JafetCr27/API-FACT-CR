const service = require('./document.service');

async function create(req, res) {
  const doc = await service.createDocument(req.company, req.body);
  res.json(doc);
}

async function getStatus(req, res) {
  const { clave } = req.params;
  const company = req.company;

  const token = await getToken(company);
  const estado = await consultarEstado(clave, token, company);

  res.json(estado);
}
module.exports = { create, getStatus };