function validateCompany(data) {

  if (!data.name) {
    throw new Error('El nombre de la compañía es obligatorio.');
  }

  if (!data.identification) {
    throw new Error('La identificación es obligatoria.');
  }

  if (!data.email) {
    throw new Error('El correo electrónico es obligatorio.');
  }

}

module.exports = {
  validateCompany
};