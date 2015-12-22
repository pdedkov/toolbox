"use strict";

let encode = require('mout/queryString/encode');
let merge = require('mout/object/merge');
let interpolate = require('mout/string/interpolate');
let restler = require('restler');

/**
 * Базовый адаптер для доступа к toolbox.mirahost.ru
 *
 * @constructor
 * @param {Array} options массив параметров
 *
 */
function Base(options) {
	options = options || {};

	// базовые опции
	this._defaults = {
		host: "HOST",
		auth: {
			user: "USER",
			token: "TOKEN"
		}
	};
	// собираем опции
	this._options = merge(this._defaults, options);
}

/**
 * Выполняем запрос к сервису
 */
Base.prototype._request = function(url, method, data) {
	method = method || 'GET';

	return new Promise(function(resolve, reject) {
		restler.request(url, {
			method: method,
			data: {data: JSON.stringify(data)},
		}).on('complete', function(res) {
			if (res instanceof Error) {
				reject(res.message);
			} else {
				resolve(JSON.parse(res));
			}
		});
	});
}

/**
 * Формируем url запроса
 * @param {string} location url ресурса
 * @param {Object} replacement данные для подстановки в url
 * @param {Object} data дополнительные данные запроса
 * @returns {*}
 * @private
 */
Base.prototype._url = function(location, replacement, data) {
	replacement = replacement || {};
	data = data || {};

	let url = this._options.host + interpolate(location, replacement);

	return url += encode(merge(this._options.auth, data));
}

module.exports  = Base;