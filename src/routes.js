const { Router } = require('express');

const tokenValidation = require('./middlewares/tokenValidation');

const admin = require('./controllers/admin/index');

const login = require('./controllers/brms/login');
const keepAlive = require('./controllers/brms/keepAlive');
const updateToken = require('./controllers/brms/updateToken');

const getListOfDevicesInPages = require('./controllers/brms/device/getListOfDevicesInPages');

const getVehicleEntranceExitRecords = require('./controllers/ipms/vehicle/getVehicleEntranceExitRecords');

const addParkingLot = require('./controllers/ipms/parkingLot/addParkingLot');
const getParkingLots = require('./controllers/ipms/parkingLot/getListOfParkingLots');
const updateParkingLot = require('./controllers/ipms/parkingLot/updateParkingLot');
const deleteParkingLot = require('./controllers/ipms/parkingLot/deleteParkingLot');

const router = Router();

router.get('/admin/:collectionName', admin);

router.post('/brms/api/v1.0/accounts/authorize', login);

router.put('/brms/api/v1.0/accounts/keepalive', keepAlive);

router.post('/brms/api/v1.0/accounts/updateToken', updateToken);

router.get(
	'/brms/api/v1.1/device/page',
	tokenValidation,
	getListOfDevicesInPages,
);

router.post(
	'/ipms/api/v1.1/entrance/vehicle-enter/record/fetch/page',
	tokenValidation,
	getVehicleEntranceExitRecords,
);

router.get('/ipms/api/v1.1/parking-lot/list', tokenValidation, getParkingLots);

router.post('/ipms/api/v1.1/parking-lot', tokenValidation, addParkingLot);

router.put('/ipms/api/v1.1/parking-lot/:id', tokenValidation, updateParkingLot);

router.delete('/ipms/api/v1.1/parking-lot', tokenValidation, deleteParkingLot);

module.exports = router;
