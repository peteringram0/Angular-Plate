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

			auth : $resource(config.apiURL + '/auth/:action', {action: '@action'},
				{
					'request_token': { method: 'GET' }, // normal login
				}
			),

			users : $resource(config.apiURL + '/users/:userId/:action', {userId:'@id', action:'@action'},
				{
					'get': { method: 'GET' },
					'image': {
						method: 'POST',
						isArray:false,
						headers : {'Content-Type': undefined}, // should be undefined so that the server detects the form boundary's
						transformRequest: function(image){
							var formData = new FormData();
							formData.append('image', image);
							return formData;
						}
					}
				}
			)

		};


		// Publicly accessible methods
		var service = {

			// Auth
			login: login,

			// Users
			getUser: getUser
			// updateUserImage: updateUserImage,

		};

		return service;


		/**
		 *
		 * Auth
		 *
		 */

		// Has an init function that also runs from within this factory once the promise is returned
		function login(credentials) {
			var initLogin = function(data) {
				setUser(data.user);
				setToken(data.token);
			};
			// return resource.auth.request_token(credentials, initLogin).$promise;
			return resource.auth.request_token({action: 'request_token'}, credentials, initLogin).$promise;
		}


		/**
		 *
		 * Users
		 *
		 */

		// returns the user data
		function getUser(id) {
			return resource.users.get({userId: id}).$promise;
		}


		//
		// // When we are always dealing with a real image object
		// function updateUserImage(id, updateData, actionPath) {
		// 	return resource.users.image({userId: id, action: actionPath}, updateData).$promise;
		// }


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
