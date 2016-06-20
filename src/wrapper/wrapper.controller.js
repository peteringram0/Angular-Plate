(function() {
	'use strict';

	angular
		.module('app.controllers')
		.controller('wrapper', wrapper);
	
	function wrapper() {

		/* jshint validthis: true */
		var vm = this;

		console.log('loaded wrapper');

	}

})();
