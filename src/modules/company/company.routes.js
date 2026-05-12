const express = require('express');

const router = express.Router();

const companyController = require('./company.controller');

router.post(
  '/',
  companyController.createCompany
);

router.get(
  '/',
  companyController.getCompanies
);

module.exports = router;