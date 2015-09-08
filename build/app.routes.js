(function() {
	'use strict';

	angular
		.module('app.routes')
		.config(Routing);

	Routing.$inject = ['$stateProvider', '$locationProvider'];

	/**
	 * Routing
	 * @author Peter Ingram <peter.ingram0@gmail.com>
	 */
	function Routing($stateProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$stateProvider.state('wrapper', {
			templateUrl: 'wrapper/wrapper.tpl.html'
		});

		$stateProvider.state('wrapper.view1', {
			url: '/view1',
			controller: 'view1 as view1',
			templateUrl: 'view1/view1.tpl.html'
		});

		$stateProvider.state('wrapper.view2', {
			url: '/view2',
			controller: 'view2 as view2',
			templateUrl: 'view2/view2.tpl.html'
		});

		$stateProvider.state('otherwise', {
			url: '/',
			templateUrl: 'wrapper/wrapper.tpl.html'
		});

	}

})();
