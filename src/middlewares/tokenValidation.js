const dayjs = require('dayjs');
const { constants } = require('node:http2');

const initDb = require('../utils/db');
const wrapPageData = require('../utils/wrapPageData');

module.exports = async function tokenValidation(req, res, next) {
	try {
		const token =
			req.headers['X-Subject-Token'] ?? req.headers['x-subject-token'];

		if (!token) {
			return res
				.status(constants.HTTP_STATUS_UNAUTHORIZED)
				.json({}, 'Token not available');
		}

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
				.json({}, 'Invalid Token');
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

		return next();
	} catch (error) {
		return next(error);
	}
};
