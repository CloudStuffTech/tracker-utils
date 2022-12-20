const _ = require("lodash");

// URL related helper fucntions
const urlUtil = (() => {
	const replaceMacros = ({ url, macros, macrosMap }) => {
		_.forOwn(macros, (value, key) => {
			// If key exists in macrosmap than update the key.
			if (macrosMap && macrosMap[key]) key = macrosMap[key];
			const regEx = new RegExp("{" + key + "}", "g");
			url = url.replace(regEx, value);
		});
		// replace null macros(Macros for whic no data is available) with empty string.
		url = url.replace(new RegExp("\{.*?\}", "g"), "");
		return url;
	};

	return {
		replaceMacros,
	};
})();

module.exports = {
	urlUtil,
};