const { Request, Response, NextFunction } = require('express');

const initDb = require('../../utils/db');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
	const { collectionName } = req.params;
	const db = await initDb();

	const data = await db[collectionName].exportJSON();
	return res.json({
		data,
	});
};
