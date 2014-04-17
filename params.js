(function(root) {

	var PARAMS_KEY = '_params_';
	var _events = {};
	var _paramsStr = localStorage.getItem(PARAMS_KEY);
	var _params =  _paramsStr && JSON.parse(_paramsStr) || {};
	var pub = {};

	root.params = function(key, val) {
		if(typeof key === 'undefined' && typeof val === 'undefined') return;
		if(typeof val === 'undefined') return pub.get(key);
		return pub.set(key, val);
	};

	pub.reset = function() { localStorage.removeItem(PARAMS_KEY); };

	pub.get = function(key) { return _params[key]; };

	pub.set = function(key, val) {
		var current = _params[key];

		if(current !== val) {
			_params[key] = val;
			localStorage.setItem(PARAMS_KEY, JSON.stringify(_params));

			var evStack = _events[key];
			if(Array.isArray(evStack)) {
				evStack.forEach(function(fn) { fn(val); });
			}
		}

		return pub;
	};

	pub.add = function(info) {
		if(Array.isArray(info)) {
			info.forEach(add);
		} else {
		}
		return pub;
	};

	pub.onChange = function(key, fn) {
		var evStack = _events[key];
		if(!Array.isArray(evStack)) evStack = _events[key] = [];
		if(evStack.indexOf(fn) === -1) evStack.push(fn);
	};

	pub.render = function() {
	};

	$.extend(root.params, pub);


})(window);
