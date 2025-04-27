const entranceGroupSchema = {
	type: 'object',
	properties: {
		groupId: { type: 'string' },
		groupName: { type: 'string' },
		groupColor: { type: 'string' },
		level: { type: 'string' },
		remark: { type: 'string' },
		defaultGroup: { type: 'string' },
		vehicleCount: { type: 'string' },
		entryPositions: {
			type: 'array',
			items: {
				type: 'object',
				// Need EntryPositions schema too! (If you send me EntryPositions C# class, I can fill this in)
			},
		},
	},
	required: ['groupName', 'groupColor'], // C# marked these two as required
};

module.exports = {
	title: 'vehicle',
	version: 0,
	description: 'Schema for Vehicle Info',
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
		plateNo: {
			type: 'string',
		},
		vehicleBrand: {
			type: 'string',
		},
		vehicleColor: {
			type: 'string',
		},
		remark: {
			type: 'string',
		},
		entranceStartTime: {
			type: 'string',
		},
		entranceEndTime: {
			type: 'string',
		},
		entranceLongTerm: {
			type: 'string',
		},
		surveyStartTime: {
			type: 'string',
		},
		surveyEndTime: {
			type: 'string',
		},
		surveyLongTerm: {
			type: 'string',
		},
		personInfo: {
			type: 'object',
			properties: {
				// Define fields inside PersonInfo here
				// Example:
				// name: { type: 'string' },
				// idCard: { type: 'string' }
			},
		},
		entranceGroups: {
			type: 'array',
			items: entranceGroupSchema,
		},
		surveyGroups: {
			type: 'array',
			items: {
				type: 'object',
				// No structure given for surveyGroups, so left generic
			},
		},
		entranceRemaningTime: {
			type: 'string',
		},
		entranceEffectiveStatus: {
			type: 'string',
		},
		surveyRemaningTime: {
			type: 'string',
		},
		surveyEffectiveStatus: {
			type: 'string',
		},
	},
	required: [
		'id', // only marking id as required; you can add more if necessary
	],
};
