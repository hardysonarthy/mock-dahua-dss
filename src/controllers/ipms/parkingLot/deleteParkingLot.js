module.exports = async (req, res, next) => {
	try {
		const { ids } = req.params;

		const db = req.app.locals.db;
		const parkingLots = db.parkinglots;

		const idList = ids.split(',');

		// Find the document by primary key (id)
		const doc = await parkingLots
			.findOne({
				selector: { id: { $in: idList } },
			})
			.exec();

		if (!doc) {
			return res.status(404).json({
				code: 404,
				desc: 'Parking lot not found',
				data: null,
			});
		}

		await doc.remove();

		return res.status(200).json({
			code: 1000,
			desc: 'Success',
		});
	} catch (error) {
		console.error('Error deleting parking lot:', error);
		return res.status(500).json({
			code: 500,
			desc: 'Internal Server Error',
			data: null,
		});
	}
};
