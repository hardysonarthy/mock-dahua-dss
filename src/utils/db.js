const { addRxPlugin, createRxDatabase } = require('rxdb');
const { getRxStorageMemory } = require('rxdb/plugins/storage-memory');
const { RxDBDevModePlugin } = require('rxdb/plugins/dev-mode');
const { RxDBUpdatePlugin } = require('rxdb/plugins/update');
const {
	getAjv,
	wrappedValidateAjvStorage,
} = require('rxdb/plugins/validate-ajv');
const addFormats = require('ajv-formats');

const { v4 } = require('uuid');

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBDevModePlugin);

const session = require('../schemas/session');
const vehicle = require('../schemas/vehicle');
const dayjs = require('dayjs');

const ajv = getAjv();

addFormats(ajv);

const storage = wrappedValidateAjvStorage({
	storage: getRxStorageMemory(),
});

let db;
module.exports = async function init() {
	if (!db) {
		db = await createRxDatabase({
			name: 'mock_dahua_db',
			storage,
			options: {},
		});

		await db.addCollections({
			vehicle: {
				schema: vehicle,
			},
			session: {
				schema: session,
			},
		});

		db.collections.session.preInsert((docData, instance) => {
			if (!docData.id) {
				docData.id = v4(); // Auto-generate if missing
			}

			if (!docData.createdAt) {
				docData.createdAt = dayjs().toISOString();
			}
		}, false);
	}

	return db;
};
