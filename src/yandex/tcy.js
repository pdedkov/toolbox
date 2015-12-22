"use strict";

let Base = require('./../base');
let merge = require('mout/object/merge');

/**
 * Яндекс ТИЦ
 *
 * @constructor
 * @param {Array} options массив параметров
 *
 */
function Tcy(options) {
	this._defaults = {
		location: {
			get: {url: "yandex/tcy/{{host}}.json"}
		}
	};
	// родительский конструктор
	Base.call(this, merge(this._defaults, options));
}

// Наследуемся
Tcy.prototype = Object.create(Base.prototype);
Tcy.prototype.constructor = Tcy;

Tcy.prototype.get = function* (host) {
	// сначала ставим задачку
	let tcy = yield this._request(this._url(this._options.location.get.url, {host: host}));

	return tcy.tcy;
}

module.exports  = Tcy;