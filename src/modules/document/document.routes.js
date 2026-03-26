const router = require('express').Router();
const controller = require('./document.controller');
const apiKey = require('../../middlewares/apiKey.middleware');

router.post('/', apiKey, controller.create);

module.exports = router;