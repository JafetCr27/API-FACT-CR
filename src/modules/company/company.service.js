const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function createCompany(data) {
  return prisma.company.create({
    data: {
      ...data,
      apiKey: crypto.randomBytes(16).toString('hex')
    }
  });
}

module.exports = { createCompany };