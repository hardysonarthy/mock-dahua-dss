const { Request, Response, NextFunction } = require('express');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
	try {
		const db = req.app.locals.db;
		const parkingLots = db.parkinglots;

		const docs = await parkingLots.find().exec();

		const results = docs.map((doc, index) => {
			const json = doc.toJSON();

			return {
				id: String(index + 1), // You can change this to a real ID field if needed
				parkingLotName: json.parkingLotName,
				enterPointCount: countPointsByDirection(json.positions, 'enter'),
				exitPointCount: countPointsByDirection(json.positions, 'exit'),
				bindingRemainLedCount:
					json.bindingRemainLedChannels?.length?.toString() || '0',
				totalParkingSpaceCount: json.totalParkingSpaceCount,
				idleParkingSpaceCount: json.idleParkingSpaceCount,
				issueVehicles: json.issueVehicles,
				issueStatus: json.issueStatus || '3', // Placeholder if not in schema
				positions: (json.positions || []).map((position, posIndex) => ({
					id: String(posIndex + 1),
					positionName: position.positionName,
					remark: position.remark || '',
					enterPointCount: countPointsByDirection(position.points, 'enter'),
					exitPointCount: countPointsByDirection(position.points, 'exit'),
					points: (position.points || []).map((point, pointIndex) => ({
						id: String(pointIndex + 1),
						pointName: point.pointName,
						remark: point.remark || '',
						bindingChannels: [
							...(point.bindingItcChannels || []).map((channel) => ({
								channelId: channel.channelId,
								channelName: null, // Placeholder unless available
								deviceCode: extractDeviceCode(channel.channelId),
								deviceName: extractDeviceName(channel.channelId),
								channelType: channel.channelType,
								status: '0', // Placeholder; replace with real status if available
							})),
						],
					})),
				})),
			};
		});

		res.status(200).json({
			code: 1000,
			desc: 'Success',
			data: { results },
		});
	} catch (error) {
		console.error('Error fetching parking lots:', error);
		res.status(500).json({
			code: 500,
			desc: 'Internal Server Error',
			data: null,
		});
	}
};

function extractDeviceCode(channelId) {
	return channelId ? channelId.split('$')[0] : '';
}

function extractDeviceName(channelId) {
	// Simulate device name from device code (e.g., "1000002" → "192.168.1.1")
	const deviceCode = extractDeviceCode(channelId);
	return deviceCode === '1000002' ? '192.168.1.1' : 'Unknown'; // Placeholder mapping
}

function countPointsByDirection(points = [], type = 'enter') {
	const directionCode = type === 'enter' ? '7' : '8'; // Example: 7 = enter, 8 = exit
	return (
		points?.filter((p) => p.direction === directionCode)?.length?.toString() ||
		'0'
	);
}
