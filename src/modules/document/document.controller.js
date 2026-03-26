const service = require('./document.service');

async function create(req, res) {
  const doc = await service.createDocument(req.company, req.body);
  res.json(doc);
}

module.exports = { create };