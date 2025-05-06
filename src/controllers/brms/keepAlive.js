const { Request, Response, NextFunction } = require('express');
const dayjs = require('dayjs');
const { constants } = require('node:http2');
const initDb = require('../../utils/db');
const wrapPageData = require('../../utils/wrapPageData');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
	try {
		if (!(req.headers['X-Subject-Token'] || req.headers['x-subject-token'])) {
			return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({});
		}

		const token =
			req.headers['X-Subject-Token'] ?? req.headers['x-subject-token'];
		const db = await initDb();

		const session = await db.session
			.findOne({
				selector: {
					token,
				},
			})
			.exec();

		if (!session) {
			return res
				.status(constants.HTTP_STATUS_UNAUTHORIZED)
				.json(wrapPageData({}, 'Ineligible Token'));
		}

		const tokenDistanceTime = dayjs().diff(
			dayjs(session.loggedInAt),
			'seconds',
		);
		if (tokenDistanceTime > 30) {
			return res
				.status(constants.HTTP_STATUS_UNAUTHORIZED)
				.json(wrapPageData({}, 'Token Expired'));
		}

		console.info(`Updating token for ${session.token} for 15 s`);
		await session.update({
			$set: {
				loggedInAt: dayjs().toDate().toISOString(),
			},
		});

		return res.json(
			wrapPageData(
				{
					token,
					duration: 30,
				},
				'Success',
				1000,
			),
		);
	} catch (error) {
		console.error(error.message);
	}
};
