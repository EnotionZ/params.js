(function(root) {

	var _events = {};

	var PARAMS_KEY = '_params_';
	var _paramsStr = localStorage.getItem(PARAMS_KEY);
	var _params =  _paramsStr && JSON.parse(_paramsStr) || {};

	var $css = $('<style/>').appendTo('body').html('.'+PARAMS_KEY+'{'+
		'display: none;'+
		'position: absolute; z-index: 99999;'+
		'left: 20px; right: 20px; top: 20px; bottom: 20px;'+
		'background: #fff;'+
		'border-radius: 4px;'+
		'box-shadow: 0 0 5px rgba(0,0,0,.8);'+
		'}\n .active.'+PARAMS_KEY+'{ display: block; }');

	var $settings = $('<div/>').addClass(PARAMS_KEY).appendTo('body');

	var pub = {};

	root.params = function(key, val) {
		if(typeof key === 'undefined' && typeof val === 'undefined') return;
		if(typeof val === 'undefined') return pub.get(key);
		return pub.set(key, val);
	};

	pub.reset = function() { localStorage.removeItem(PARAMS_KEY); };

	pub.get = function(key) {
		if(typeof key === 'undefined') return _params;
		return _params[key];
	};

	pub.set = function(key, val) {
		var current = _params[key];

		if(current !== val) {
			_params[key] = val;
			localStorage.setItem(PARAMS_KEY, JSON.stringify(_params, null, 4));

			var evStack = _events[key];
			if(Array.isArray(evStack)) {
				evStack.forEach(function(fn) { fn(val); });
			}
		}

		return pub;
	};

	var _add = function(info) {
		if(typeof pub.get(info.key) === 'undefined') {
			pub.set(info.key, info.value);
		}
	};
	pub.add = function(info) {
		if(Array.isArray(info)) info.forEach(_add);
		else _add(info);
		return pub;
	};

	pub.onChange = function(key, fn) {
		var evStack = _events[key];
		if(!Array.isArray(evStack)) evStack = _events[key] = [];
		if(evStack.indexOf(fn) === -1) evStack.push(fn);
	};

	pub.hide = function() { $settings.removeClass('active'); };
	pub.show = function() { $settings.addClass('active'); };
	pub.toggle = function() { $settings.toggleClass('active'); };

	$.extend(root.params, pub);

	$('body').on('keypress', function(e) { if(e.keyCode === 63) pub.toggle(); });

})(window);
