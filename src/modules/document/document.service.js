const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDocument(company, data) {
  return prisma.document.create({
    data: {
      companyId: company.id,
      type: data.type,
      clave: data.clave,
      status: 'draft'
    }
  });
}

module.exports = { createDocument };