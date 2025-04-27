module.exports = function wrapData(data, desc, code = 200) {
	return {
		code,
		data,
		desc,
	};
};
