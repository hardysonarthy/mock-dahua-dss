const { addRxPlugin, createRxDatabase } = require('rxdb');
const { getRxStorageMemory } = require('rxdb/plugins/storage-memory');
const { RxDBDevModePlugin } = require('rxdb/plugins/dev-mode');
const { RxDBUpdatePlugin } = require('rxdb/plugins/update');
const { RxDBJsonDumpPlugin } = require('rxdb/plugins/json-dump');
const { RxDBQueryBuilderPlugin } = require('rxdb/plugins/query-builder');
const {
	getAjv,
	wrappedValidateAjvStorage,
} = require('rxdb/plugins/validate-ajv');
const addFormats = require('ajv-formats');
const dayjs = require('dayjs');

const { v4 } = require('uuid');

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

const data = require('../../mock/data.json');

const session = require('../schemas/session');
const vehicle = require('../schemas/vehicle');
const device = require('../schemas/device');
const parkingLot = require('../schemas/parkingLot');

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
			device: {
				schema: device,
			},
			parkingLot: {
				schema: parkingLot,
			},
		});

		const { success, error } = await db.vehicle.bulkInsert(data.vehicles);

		if (!error) {
			for (const err of error) {
				console.error(err);
			}
		}

		const deviceResult = await db.device.bulkInsert(data.devices);
		if (!deviceResult.error) {
			for (const err of error) {
				console.error(err);
			}
		}

		const parkingLotResult = await db.parkingLot.bulkInsert(data.parkingLots);
		if (!parkingLotResult.error) {
			for (const err of error) {
				console.error(err);
			}
		}

		db.collections.session.preInsert((docData, instance) => {
			if (!docData.id) {
				docData.id = v4(); // Auto-generate if missing
			}

			if (!docData.createdAt) {
				docData.createdAt = dayjs().toISOString();
			}
		}, false);
	}

	setInterval(async () => {
		const expirationTime = dayjs().add(-30, 'minutes').toISOString();
		const expiredSessions = await db.session
			.find({
				selector: {
					loggedInAt: {
						$lte: expirationTime,
					},
				},
			})
			.exec();
	});

	return db;
};
