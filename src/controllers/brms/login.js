const { Request, Response, NextFunction } = require('express');
const { RxDocument, RxDatabaseBase } = require('rxdb');
const { v3: uuid, v4 } = require('uuid');
const dayjs = require('dayjs');
const { constants } = require('node:http2');

const encryption = require('../../utils/encryption');
const initDb = require('../../utils/db');
const wrapData = require('../../utils/wrapPageData');

function returnFailedAttempt() {}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
	try {
		if (!req.body) {
			return next('Body is empty');
		}

		const {
			signature,
			userName,
			randomKey,
			publicKey,
			encryptType,
			ipAddress,
			clientType,
			userType,
		} = req.body;

		console.info(`${req.url}: attempt by ${userName}`);
		/**
		 * @type {RxDatabaseBase}
		 */
		const db = await initDb();

		const { USERNAME, PASSWORD } = process.env;

		if (!(clientType && req.body)) {
			return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({});
		}

		if (!signature) {
			const firstLoginAttempt = {
				realm: encryption.generateMD5Hash(dayjs().toISOString()),
				randomKey: encryption.generate64BitHex(),
				encryptType: 'MD5',
				publickey: await encryption.generatePublicKey(),
			};

			await db.session.insert({
				id: v4(),
				realm: firstLoginAttempt.realm,
				randomKey: firstLoginAttempt.randomKey,
				userName,
				serverPublicKey: firstLoginAttempt.publickey,
				createdAt: dayjs().toISOString(),
			});
			return res
				.status(constants.HTTP_STATUS_UNAUTHORIZED)
				.json(firstLoginAttempt);
		}

		/**
		 * @type {RxDocument<{ id: string, userName: string, createdAt: string, realm: string }>}
		 */
		const secondLoginAttempt = await db.session
			.findOne({
				selector: {
					userName,
				},
			})
			.exec();

		if (!secondLoginAttempt) {
			const firstLoginAttempt = {
				realm: encryption.generateMD5Hash(dayjs().toISOString()),
				randomKey: encryption.generate64BitHex(),
				encryptType: 'MD5',
				publickey: await encryption.generatePublicKey(),
			};

			await db.session.insert({
				id: v4(),
				realm: firstLoginAttempt.realm,
				randomKey: firstLoginAttempt.randomKey,
				userName,
				serverPublicKey: firstLoginAttempt.publickey,
				createdAt: dayjs().toDate().toISOString(),
			});
			return res
				.status(constants.HTTP_STATUS_UNAUTHORIZED)
				.json(firstLoginAttempt);
		}

		if (
			secondLoginAttempt.loggedInAt &&
			dayjs(secondLoginAttempt.loggedInAt).diff(dayjs()) < 30 * 1000
		) {
			return res.json(wrapData({}, 'User has logged in!', 2001));
		}

		console.log(JSON.stringify(secondLoginAttempt));

		const temp1 = encryption.generateMD5Hash(PASSWORD);
		const temp2 = encryption.generateMD5Hash(USERNAME + temp1);
		const temp3 = encryption.generateMD5Hash(temp2);
		const temp4 = encryption.generateMD5Hash(
			`${USERNAME}:${secondLoginAttempt.realm}:${temp3}`,
		);
		const expectedSignature = encryption.generateMD5Hash(
			`${temp4}:${secondLoginAttempt.randomKey}`,
		);
		const generatedSignature = expectedSignature;

		console.log(`Signature: ${generatedSignature}`);

		if (generatedSignature !== signature) {
			const message = 'Incorrect username or password.';
			const loginAttempts = await db.session.findOne({
				selector: {
					userName,
					loggedInAt: {
						$exists: false,
					},
					createdAt: {
						$gt: dayjs().add(15, 'minutes').toISOString(),
					},
				},
			});

			return res
				.status(200)
				.json(
					wrapData({ unlockRemainTimes: loginAttempts.length }, message, 2001),
				);
		}

		if (
			userName === USERNAME &&
			randomKey === secondLoginAttempt.randomKey &&
			signature === generatedSignature
		) {
			/*
        TODO: generate token, credential to
      */
			const token = v4();
			const credential = v4();
			await secondLoginAttempt.update({
				$set: {
					token,
					credential,
					signature: generatedSignature,
					nextSignature: encryption.generateMD5Hash(
						`${generatedSignature}:${token}`,
					),
					loggedInAt: dayjs().toDate().toISOString(),
					clientPublicKey: publicKey,
					userType,
				},
			});
			return res.status(200).json({
				token,
				credential,
			});
		}
		return res.status(401).json();
	} catch (err) {
		return next(err);
	}
};
