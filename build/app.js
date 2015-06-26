(function() {
	'use strict';

	angular
		.module('app', [
			'ngLodash',
			'app.routes',
			'app.factory',
			'app.controllers',
			'app.directive',
			'app.filters',
			'app.constant',
			'ui.router',
			'partials',
			'ngStorage'
		]);

	angular.module('app.directive', []);
	angular.module('app.constant', []);
	angular.module('app.filters', []);
	angular.module('app.routes', ['ui.router']);
	angular.module('app.factory', ['ngResource']);
	angular.module('app.controllers', []);

})();
