(function() {
	'use strict';

	angular
		.module('app.routes')
		.config(Routing);

	Routing.$inject = ['$stateProvider', '$locationProvider'];

	/**
	 * Routing function
	 * @author Peter Ingram <peter.ingram0@gmail.com>
	 * @param  {angular} $routeProvider
	 */
	function Routing($stateProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$stateProvider.state('inner', {
			templateUrl: 'inner/inner.tpl.html'
		});

		$stateProvider.state('inner.register', {
			url: '/register',
			controller: 'register as register',
			templateUrl: 'register/register.tpl.html'
		});

		$stateProvider.state('inner.registered', {
			url: '/registered',
			controller: 'registered as registered',
			templateUrl: 'registered/registered.tpl.html'
		});

		$stateProvider.state('otherwise', {
			url: '/',
			templateUrl: 'inner/inner.tpl.html'
		});

	}

})();
