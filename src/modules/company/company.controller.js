const companyService = require('./company.service');

  async function createCompany(req, res, next) {

    try {

      const company = await companyService.createCompany(req.body);

      return res.status(201).json({
        success: true,
        message: 'Compañía creada correctamente.',
        data: company
      });

    } catch (error) {

      next(error);
    }
  }
  async function getCompanies(req, res, next) {

    try {
      const companies = await companyService.getCompanies();

      return res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      next(error);
    }
  }
module.exports = {
  createCompany,
  getCompanies
};