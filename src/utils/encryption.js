const crypto = require('node:crypto');
const md5 = require('crypto-js/md5');

function generate64BitHex() {
	return crypto.randomBytes(8).toString('hex');
}

function generateMD5Hash(input) {
	return md5(input).toString();
}

async function generatePublicKey() {
	return new Promise((resolve, reject) => {
		crypto.generateKeyPair(
			'rsa',
			{
				modulusLength: 2048,
				publicKeyEncoding: {
					type: 'pkcs1',
					format: 'pem',
				},
				privateKeyEncoding: {
					type: 'pkcs1',
					format: 'pem',
				},
			},
			(err, publicKey, privateKey) => {
				if (err) {
					return reject(err);
				}

				// Remove PEM headers/footers and line breaks to get Base64 string
				const base64PublicKey = publicKey
					.replace(/-----BEGIN RSA PUBLIC KEY-----\n/, '')
					.replace(/\n-----END RSA PUBLIC KEY-----\n?/, '')
					.replace(/\n/g, '');

				resolve(base64PublicKey);
			},
		);
	});
}

module.exports = { generate64BitHex, generatePublicKey, generateMD5Hash };
