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

/**
 * Постановка задачи и её обработка
 * @param {string} host хост
 * @param {function} action действие
 * @private
 */
Tcy.prototype._process = function(host, success, error) {
	// сначала ставим задачку
	this._request(this._url(this._options.location.get.url, {host: host}), 'GET', {},
		function(res) {
			if (res instanceof Error) {
				error(res);
			}
			success(res.tcy);
		}.bind(this)
	);
}

Tcy.prototype.get = function(host, callback) {
	return this._get(host, callback);
}

module.exports  = Tcy;