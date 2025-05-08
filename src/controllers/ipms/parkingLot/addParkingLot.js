const { v4 } = require('uuid');
const wrapPageData = require('../../../utils/wrapPageData');

module.exports = async (req, res, next) => {
	try {
		const data = req.body;

		// Access RxDB collection (replace this with your RxDB instance)
		const db = req.app.locals.db; // assuming db is attached to Express app
		const parkingLots = db.parkinglots; // name used when collection was created

		// Check if document with the same primary key exists
		const existing = await parkingLots
			.findOne({
				selector: {
					parkingLotName: data.parkingLotName,
				},
			})
			.exec();

		if (existing) {
			return res
				.status(409)
				.json({ error: 'Parking lot with this name already exists' });
		}

		const newId = v4();
		// Insert new document
		await parkingLots.insert({
			id: newId,
			...data,
		});
		return res.status(201).json(
			wrapPageData(
				{
					id: newId,
				},
				'Success',
				1000,
			),
		);
	} catch (error) {
		console.error('Error adding parking lot:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
