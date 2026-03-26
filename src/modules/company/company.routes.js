const router = require('express').Router();
const controller = require('./company.controller');

router.post('/', controller.create);

module.exports = router;