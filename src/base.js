"use strict";

let encode = require('mout/queryString/encode');
let merge = require('mout/object/merge');
let interpolate = require('mout/string/interpolate');
let restler = require('restler');
let status = require('./status');
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
 * Абстрактный метод, требующий реализации
 *
 * @private
 */
Base.prototype._process = function() {
	throw new Error('Method not implemented');
}

/**
 * Ожидаем получения результата
 * @private
 */
Base.prototype._waitData = function(id, callback) {
	this._request(
		this._url(this._options.location.get.url, {id: id}),
		'GET',
		{},
		function(res) {
			if (res.status == status.ERROR) {
				return callback(new Error(res.message));
			} else {
				if (res.status != status.COMPLETE) {
					setTimeout(this._waitData.bind(this, id, callback), this._options.sleep * 1000);
				} else {
					return callback(res);
				}
			}
		}.bind(this)
	);
}

/**
 * Получения результатов
 * @param {object|string} параметры запросов, подлежащих обработке
 * @param {function} callback
 * @returns {Promise}
 */
Base.prototype._get = function(params, callback) {
	if (typeof callback == 'function') {
		return this._process(params,
			function(res) {
				callback(res)
			},
			function(err) {
				throw err;
			}
		);
	} else {
		return new Promise(function(resolve, reject) {
			this._process(params,
				function(res) {
					resolve(res);
				},
				function(err) {
					reject(err);
				}
			);
		}.bind(this));
	}
}

/**
 * Выполняем запрос к сервису
 */
Base.prototype._request = function(url, method, data, callback) {
	method = method || 'GET';

	// формируем параметры запроса
	let req = restler.request(url, {
		method: method,
		data: {data: JSON.stringify(data)},
	});

	if (typeof callback == 'function') {
		req.on('complete', function(res) {
			return callback(JSON.parse(res));
		});
	} else {
		return new Promise(function(resolve, reject) {
			req.on('complete', function(res) {
				if (res instanceof Error) {
					reject(res.message);
				} else {
					resolve(JSON.parse(res));
				}
			});
		});
	}
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