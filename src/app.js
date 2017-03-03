(function() {
	'use strict';

	angular
		.module('app', [
			'ui.router',
			'ui.bootstrap',
			'partials',
			'ngStorage',
			'ngResource',
			'oitozero.ngSweetAlert',
			'app.routes',
			'app.factory',
			'app.controllers',
			'app.directive',
			'app.filters',
			'app.run',
			'app.constant'
		]);

	angular.module('app.directive', []);
	angular.module('app.constant', []);
	angular.module('app.filters', []);
	angular.module('app.controllers', ['oitozero.ngSweetAlert']);
	angular.module('app.run', ['ngStorage']);
	angular.module('app.routes', ['ui.router']);
	angular.module('app.factory', ['ngStorage', 'ngResource']);

})();
