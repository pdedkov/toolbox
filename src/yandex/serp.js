"use strict";

let Base = require('./../base');
let merge = require('mout/object/merge');
let status = require('./../status');
let sleep = require('co-sleep');
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
			set: {url: "yandex/serp.json"},
			get: {url: "yandex/serp/{{id}}.json"}
		},
		sleep: 3
	};
	// родительский конструктор
	Base.call(this, merge(this._defaults, options));
}

// Наследуемся
Serp.prototype = Object.create(Base.prototype);
Serp.prototype.constructor = Serp;

Serp.prototype.get = function* (host) {

	// сначала ставим задачку
	let id = yield this._request(this._url(this._options.location.set.url), 'POST', {url: host, domain: host});

	let res = {status: status.NEW};

	while (res.status != status.COMPLETE) {
		res = yield this._request(this._url(this._options.location.get.url, {id: id.id}));
		if (res.status == status.ERROR) {
			throw new Error(res.message);
		}
		// подождём немного
		yield sleep(this._options.sleep * 1000);
	}
	return res.Result.pages;
}

module.exports  = Serp;