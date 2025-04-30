const { Request, Response, NextFunction } = require('express');
const dayjs = require('dayjs');
const { constants } = require('node:http2');

const initDb = require('../../utils/db');
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
		currentPage,
		splitTime,
		splitId,
		orderType,
		orderDirection,
		channelIds,
		startTime,
		endTime,
		vehicleColor,
		vehicleBrand,
		plateNoMatchMode,
		plateNos = [],
	} = req.body;

	if (!(page && pageSize && startTime && endTime)) {
		return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({});
	}

	const db = await initDb();

	const selector = {
		entranceStartTime: {
			$gte: dayjs(startTime).toJSON(),
		},
		entranceEndTime: {
			$lte: dayjs(endTime).toJSON(),
		},
	};

	if (vehicleColor) {
		selector.vehicleColor = vehicleColor;
	}

	if (vehicleBrand) {
		selector.vehicleColor = vehicleColor;
	}

	if (plateNos && plateNos.length > 0) {
		selector.plateNo = {
			$in: plateNos,
		};
	}

	const vehicles = await db.vehicle
		.find({
			selector,
		})
		.exec();

	return res.json(
		wrapPageData({
			totalCount: vehicles.length,
			pageData: vehicles.map((vehicle) => ({
				id: vehicle.id,
			})),
		}),
	);
};
