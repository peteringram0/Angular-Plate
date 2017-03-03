(function() {
	'use strict';

	angular
		.module('app.factory')
		.factory('apiFactory', apiFactory);

	apiFactory.$inject = ['$http', '$resource', 'config', 'localStorage'];

	/**
	 * API factory is responsible for all API calls to the API. Every function should return a promise and called like
	 * so in other factories.
	 *
	 * apiFactory.login(credentials).then(function(){
	 *		console.log('done');
	 *	});
	 *
	 * @author Peter Ingram <peter.ingram0@gmail.com>
	 */
	function apiFactory($http, $resource, config, localStorage) {

		// All resource methods to the API
		var resource = {

			auth : $resource(config.apiURL + '/auth/:action', {action: '@action'}, {
					'login': { method: 'GET' }, // normal login
				}
			)

		};

		// Publicly accessible methods
		var service = {
			login: login, // Auth
		};

		// Return it
		return service;

		/**
		 *
		 * Auth
		 *
		 */

		// Has an init function that also runs from within this factory once the promise is returned
		function login(credentials) {

			// Throw error
			if(!credentials)
				throw new Error('No creds provided');

			var initLogin = function(data) {
				setUser(data.user);
				setToken(data.token);
			};

			return resource.auth.login({action: 'login'}, credentials, initLogin).$promise;

		}

		/**
		 *
		 * Internal Private Functions
		 *
		 */

		/**
		 * Adds the users data into local storage upon Login
		 */
		function setUser(user) {
			localStorage.addLocal('user', user);
		}

		/**
		 * Adds he token to the local storage and sets the Auth $http header or removes the header
		 */
		function setToken(token) {
			if (token) {
				localStorage.addLocal('token', token);
				$http.defaults.headers.common.Authorization = 'Bearer ' + token;
			}
		}

	}

})();
