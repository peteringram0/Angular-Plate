(function() {

	'use strict';

	angular
		.module('app.run')
		.run(preLoadData);

	preLoadData.$inject = ['localStorage'];

	/**
	 * This block will be ran on page load (after config and before any controller)
	 */
	function preLoadData(localStorage) {
		localStorage.preLoad();
	}

})();
