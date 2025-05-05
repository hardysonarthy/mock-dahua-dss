const { Request, Response, NextFunction } = require('express');

const initDb = require('../../../utils/db');
const wrapPageData = require('../../../utils/wrapPageData');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
	const {
		page,
		pageSize,
		positionIds = [],
		startTime,
		endTime,
		entranceGroupId,
		plateNo,
		personName,
		company,
		orgCode,
		vehicleColor,
		vehicleModel,
		vehicleBrand,
		status,
		plateNoMatchMode,
		cardNo,
		cardPersonId,
		cardPersonName,
	} = req.query;
	const token =
		req.headers['X-Subject-Token'] ?? req.headers['x-subject-token'];
	const language = req.headers['accept-language'];

	const db = await initDb();

	const vehicles = await db.vehicle.find().exec();

	const hostname = req.headers.host;
	const imageHostingUrl = `${hostname}/assets`;
	const vehiclesData = vehicles.map((vehicle) => {
		return {
			id: vehicle.id,
			plateNo: vehicle.plateNo,
			capturePictures: vehicle.capturePictures.map(
				(path) =>
					`${imageHostingUrl}/${path}?streamId:1260@capTime:${vehicle.entranceStartTime}`,
			),
			enterTime: vehicle.entranceStartTime,
			parkingLotId: '1',
			parkingLotName: '',
			positionId: '1',
			positionName: 'test position',
			pointId: '1',
			pointName: 'enter',
			personName: 'XingMing',
			company: '',
			orgCode: '001',
			orgName: 'All Person',
			vehicleBrand: '1',
			vehicleModel: '1',
			vehicleColor: '1',
			status: '1',
		};
	});

	return res.json(wrapPageData(vehiclesData, 'Success', 1000));

	// return {
	// 	code: 1000,
	// 	desc: 'Success',
	// 	data: {
	// 		totalCount: '-102',
	// 		pageData: [
	// 			{
	// 				id: '95',
	// 				plateNo: 'EA2779335335F',
	// 				capturePictures: [
	// 					'https://192.168.1.1:8082/1000054$1$0$0/20210206/23/5457-3196639-0.jpg?streamID:1260@capTime:1612684797',
	// 					'',
	// 				],
	// 				enterTime: '1614195048',
	// 				parkingLotId: '1',
	// 				parkingLotName: '',
	// 				positionId: '1',
	// 				positionName: 'test position',
	// 				pointId: '1',
	// 				pointName: 'enter',
	// 				personName: 'XingMing',
	// 				company: '',
	// 				orgCode: '001',
	// 				orgName: 'All Person',
	// 				vehicleBrand: '1',
	// 				vehicleModel: '1',
	// 				vehicleColor: '1',
	// 				status: '1',
	// 			},
	// 		],
	// 	},
	// };
};
