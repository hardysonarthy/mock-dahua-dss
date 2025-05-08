module.exports = {
	title: 'session',
	version: 0,
	description: 'Schema for session',
	type: 'object',
	primaryKey: {
		key: 'id',
		fields: ['id'],
	},
	properties: {
		id: {
			type: 'string',
			maxLength: 36,
		},
		signature: {
			type: 'string',
		},
		nextSignature: {
			type: 'string',
		},
		userName: {
			type: 'string',
		},
		realm: {
			type: 'string',
		},
		encryptType: {
			type: 'string',
		},
		serverPublicKey: {
			type: 'string',
		},
		clientPublicKey: {
			type: 'string',
		},
		randomKey: {
			type: 'string',
		},
		userType: {
			type: 'string',
		},
		token: {
			type: 'string',
		},
		credential: {
			type: 'string',
		},
		createdAt: {
			type: 'string',
			format: 'date-time',
		},
		loggedInAt: {
			type: 'string',
			format: 'date-time',
		},
	},
};
