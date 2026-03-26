const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) return res.status(401).json({ error: 'API Key requerida' });

  const company = await prisma.company.findUnique({
    where: { apiKey }
  });

  if (!company) return res.status(403).json({ error: 'API Key inválida' });

  req.company = company;
  next();
}

module.exports = apiKeyMiddleware;