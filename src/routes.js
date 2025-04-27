const { Router } = require('express');
const brmsLogin = require('./controllers/brms/login');

const router = Router();

router.post('/brms/api/v1.0/accounts/authorize', brmsLogin);

module.exports = router;
