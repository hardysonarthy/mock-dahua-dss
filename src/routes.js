const { Router } = require('express');

const tokenValidation = require('./middlewares/tokenValidation');

const admin = require('./controllers/admin/index');
const brmsLogin = require('./controllers/brms/login');
const brmsKeepAlive = require('./controllers/brms/keepAlive');
const ipmsGetVehicleEntranceExitRecords = require('./controllers/ipms/vehicle/getVehicleEntranceExitRecords');

const router = Router();

router.post('/brms/api/v1.0/accounts/authorize', brmsLogin);

router.put('/brms/api/v1.0/accounts/keepalive', brmsKeepAlive);

router.get('/admin/:collectionName', admin);

router.post(
	'/ipms/api/v1.1/entrance/vehicle-enter/record/fetch/page',
	tokenValidation,
	ipmsGetVehicleEntranceExitRecords,
);

module.exports = router;
