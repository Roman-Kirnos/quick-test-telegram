const router = require('express').Router();

const telegram = require('./api');

router.use(telegram);

module.exports = router;
