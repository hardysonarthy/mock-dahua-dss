const { Request, Response, NextFunction } = require('express');
const { v3: uuid, v4 } = require('uuid');
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
	const { signature } = req.body;
	const db = await initDb();
	const session = await db.session
		.findOne({
			selector: {
				nextSignature: signature,
			},
		})
		.exec();

	if (!session) {
		return res
			.status(constants.HTTP_STATUS_UNAUTHORIZED)
			.json(wrapPageData({}, 'Ineligible Token'));
	}

	const updatedToken = v4();

	session.update({
		$set: {
			token: updatedToken,
			loggedInAt: dayjs(),
		},
	});

	return res.json({
		token: updatedToken,
	});
};
