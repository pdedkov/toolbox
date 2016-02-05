"use strict";

let Base = require('./../base');
let sleep = require('co-sleep');
let merge = require('mout/object/merge');

/**
 * Базовый адаптер для доступа к toolbox.mirahost.ru
 *
 * @constructor
 * @param {Array} options массив параметров
 *
 */
function Serp(options) {
	this._defaults = {
		location: {
			set: { url: "yandex/serp.json" },
			get: { url: "yandex/serp/{{id}}.json" }
		},
		sleep: 3
	};
	// родительский конструктор
	Base.call(this, merge(this._defaults, options));
}

// Наследуемся
Serp.prototype = Object.create(Base.prototype);
Serp.prototype.constructor = Serp;

/**
 * Постановка задачи и её обработка
 * @param {string} host хост
 * @param {function} action действие
 * @private
 */
Serp.prototype._process = function (host, success, error) {
	// сначала ставим задачку
	this._request(this._url(this._options.location.set.url), 'POST', { url: host, domain: host }, (function (id) {
		if (id instanceof Error) {
			error(id);
		}
		this._waitData.call(this, id.id, function (res) {
			if (res instanceof Error) {
				error(res);
			}
			success(res.Result.pages);
		});
	}).bind(this));
};

/**
 * Получения результатов
 * @param {string} host хост, который подлежит обработке
 * @param {function} callback
 * @returns {Promise}
 */
Serp.prototype.get = function (host, callback) {
	return this._get(host, callback);
};

module.exports = Serp;