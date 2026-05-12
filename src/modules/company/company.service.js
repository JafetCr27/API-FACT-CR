// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const crypto = require('crypto');

// async function createCompany(data) {
//   try {

//     // Validaciones básicas
//     if (!data.name) {
//       throw new Error('El nombre de la compañía es obligatorio.');
//     }

//     if (!data.identification) {
//       throw new Error('La identificación es obligatoria.');
//     }

//     const existingCompany = await prisma.company.findUnique({
//       where: {
//         identification: data.identification
//       }
//     });

//     if (existingCompany) {
//       throw new Error('La compañía ya existe.');
//     }

//     // Crear compañía
//     const company = await prisma.company.create({
//       data: {
//         ...data,
//         apiKey: crypto.randomBytes(16).toString('hex')
//       }
//     });

//     return company;

//   } catch (error) {

   
//   }
// }


const crypto = require('crypto');

const companyRepository = require('./company.repository');
const { validateCompany } = require('./company.validation');

async function getCompanies() {

    try {

      const companies = await companyRepository.findAll();

      return companies;

    } catch (error) {

      console.error('Error getCompanies:', error);

      throw new Error('No fue posible obtener las compañías.');

    }

  }
async function createCompany(data) {

  try {

    // Validaciones
    validateCompany(data);

    // Validar existencia
    const existingCompany = await companyRepository.findByIdentification(
      data.identification
    );

    if (existingCompany) {
      throw new Error('La compañía ya existe.');
    }

    // Generar API Key
    const apiKey = crypto.randomBytes(32).toString('hex');

    // Crear compañía
    const company = await companyRepository.create({
      ...data,
      apiKey
    });

    return company;

  } catch (error) {

      // Error Prisma: registro duplicado
      if (error.code === 'P2002') {
        throw new Error('Ya existe una compañía con ese dato único.');
      }

      // Error Prisma: columna inexistente o schema desactualizado
      if (error.code === 'P2022') {
        throw new Error('La estructura de la base de datos no está actualizada.');
      }

      // Error genérico
      throw new Error(`Error al crear la compañía: ${error.message}`);

  }
  
}
module.exports = {  
  createCompany,
  getCompanies
};
