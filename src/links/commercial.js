"use strict";

let Base = require('./../base');
let merge = require('mout/object/merge');

/**
 * Определить коммерческих ссылок через tb
 *
 * @constructor
 * @param {Array} options массив параметров
 *
 */
function Commercial(options) {
	this._defaults = {
		location: {
			get: { url: "links/commercial/{{anchor}}.json" }
		}
	};
	// родительский конструктор
	Base.call(this, merge(this._defaults, options));
}

// Наследуемся
Commercial.prototype = Object.create(Base.prototype);
Commercial.prototype.constructor = Commercial;

/**
 * Постановка задачи и её обработка
 * @param {string} host хост
 * @param {function} action действие
 * @private
 */
Commercial.prototype._process = function (anchor, success, error) {
	// сначала ставим задачку
	this._request(this._url(this._options.location.get.url, { anchor: encodeURIComponent(anchor) }), 'GET', {}, function (res) {
		if (res instanceof Error) {
			error(res);
		}
		success(res.Result);
	}.bind(this));
};

Commercial.prototype.get = function (anchor, callback) {
	return this._get(anchor, callback);
};

module.exports = Commercial;