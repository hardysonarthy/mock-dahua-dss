const { Request, Response, NextFunction } = require('express');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = function trails(req, res, next) {
	const now = dayjs().tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
	console.info(`${now} Request: ${req.url}`);

	const ogJson = res.json;
	res.json = function (body) {
		console.info(`${now} Response: ${JSON.stringify(body)}`);
		return ogJson.call(this, body);
	};
	return next();
};
