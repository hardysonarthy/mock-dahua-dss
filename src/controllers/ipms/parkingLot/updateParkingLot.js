module.exports = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedData = req.body;

		const db = req.app.locals.db;
		const parkingLots = db.parkinglots;

		// Find the existing document by primary key (parkingLotName)
		const existingDoc = await parkingLots
			.findOne({
				selector: { id },
			})
			.exec();

		if (!existingDoc) {
			return res.status(404).json({
				code: 404,
				desc: 'Parking lot not found',
				data: null,
			});
		}

		// Update the document with new fields
		await existingDoc.atomicPatch(updatedData);

		return res.status(200).json({
			code: 1000,
			desc: 'Success',
			data: null,
		});
	} catch (error) {
		console.error('Error updating parking lot:', error);
		return res.status(500).json({
			code: 500,
			desc: 'Internal Server Error',
			data: null,
		});
	}
};
