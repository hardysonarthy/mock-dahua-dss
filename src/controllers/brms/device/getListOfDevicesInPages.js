const { Request, Response, NextFunction } = require('express');

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

	const db = await initDb();
	db.device.find({
		selector: {
			$or: [
				{
					deviceCode: /keyword/i,
					deviceName: keyword,
				},
			],
		},
	});
};
