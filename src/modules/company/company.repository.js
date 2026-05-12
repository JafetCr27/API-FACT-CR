const prisma = require('../../lib/prisma');

async function create(data) {

  return prisma.company.create({
    data
  });

}

async function findByIdentification(identification) {

  return prisma.company.findUnique({
    where: {
      identification
    }
  });

}
async function findAll() {

  return prisma.company.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

}

module.exports = {
  create,
  findByIdentification,
  findAll
};