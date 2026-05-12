// const router = require('express').Router();
// const controller = require('./document.controller');
// const apiKey = require('../../middlewares/apiKey.middleware');

// router.post('/', apiKey, controller.create);
// router.get('/documents/:clave/status', apiKey, controller.getStatus);
// module.exports = router;    

const router = require('express').Router();

const controller = require('./document.controller');

const auth = require('../../middlewares/auth');

router.post("/", auth, controller.create);

router.get("/", auth, controller.getAll);

module.exports = router;