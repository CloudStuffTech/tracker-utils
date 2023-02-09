const _ = require("lodash");

class ArrayMethods {
	constructor() {}

	static removeKeys(data, keysToRemove = []) {
		_.each(keysToRemove, (key) => {
			delete data[key];
		});
		return data;
	}

	static add(from, to) {
		_.each(from, (value, key) => {
			if (to[key]) {
				to[key] += parseFloat(value);
			} else {
				to[key] = parseFloat(value);
			}
		});
		return to;
	}

	static removeVals(vals, arr) {
		_.each(vals, (v) => {
			let index = arr.indexOf(v);
			if (index > -1) {
				arr.splice(index, 1);
			}
		});
		return arr;
	}

	static mapObject(items, field) {
		let result = {};
		_.each(items, (i) => {
			result[i[field]] = i;
		});
		return result;
	}

	static arrayKeys(objs, field) {
		let result = [];
		_.each(objs, (o) => {
			result.push(o[field]);
		});
		return _.uniq(result);
	}

	static mergeInObjArray(objs, field) {
		let result = [];
		_.each(objs, (obj) => {
			result = _.union(result, obj[field] || []);
		});
		return result;
	}

	static mapObjectArrays(objs, field) {
		let result = {};
		_.each(objs, (obj) => {
			result[obj[field]] = _.union(result[obj[field]] || [], [obj]);
		});
		return result;
	}
}

module.exports = ArrayMethods;
