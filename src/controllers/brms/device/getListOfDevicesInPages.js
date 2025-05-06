const { Request, Response, NextFunction } = require('express');
const { RxDocument, RxDatabaseBase, RxCollectionBase } = require('rxdb');

const initDb = require('../../../utils/db');
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
		orderType,
		orderDirection,
		keyword,
		orgCode,
		deviceCategory,
		deviceType,
		status,
		permitted,
		domain,
	} = req.query;

	const query = {};

	if (keyword) {
		query.$or = [
			{
				deviceCode: /keyword/i,
			},
			{
				deviceName: /keyword/i,
			},
			{
				deviceIp: /keyword/i,
			},
		];
	}

	if (orgCode) {
		query.orgCode = orgCode;
	}

	if (deviceCategory) {
		query.deviceCategory = deviceCategory;
	}

	if (deviceType) {
		query.deviceType = deviceType;
	}

	if (deviceType) {
		query.deviceType = deviceType;
	}

	if (status) {
		query.status = status;
	}

	if (domain) {
		query.domainId = domain;
	}

	/**
	 * @type {RxDatabaseBase}
	 */
	const db = await initDb();
	/**
	 * @type {RxCollectionBase}
	 */
	const deviceCollection = db.device;
	const devices = await deviceCollection
		.find({
			selector: query,
		})
		.skip((Number(page) ?? 1 - 1) * Number(pageSize))
		.limit(Number(pageSize))
		.exec();

	return res.json(devices);
};
