(function() {
	'use strict';

	angular
		.module('app.factory')
		.factory('apiFactory', apiFactory);

	apiFactory.$inject = ['$http', '$resource', 'config'];

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
	function apiFactory($http, $resource, config) {

		// All resource methods to the API
		var resource = {

			auth : $resource(config.apiURL + '/auth/:action', {action: '@action'},
				{
					'getToken': { method: 'POST' }, // normal login
					'getSingleUseToken' :  { method: 'POST' }, // get single use token from the API
					'renewToken' :  { method: 'POST' },
					'requestPasswordEmail' : { method: 'POST' },
					'resetPassword' : { method: 'POST' }
				}
			),

			users : $resource(config.apiURL + '/users/:userId/:action', {userId:'@id', action:'@action'},
				{
					'query': { method: 'GET' },
					'create' : { method: 'POST' },
					'get': { method: 'GET' },
					'update': { method: 'PUT' },
					'delete': { method: 'DELETE' },
					'audio': { method: 'POST' },
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
			logout: logout,
			getSingleUseToken: getSingleUseToken,
			renewToken: renewToken,
			resetPasswordEmail: resetPasswordEmail,
			resetPassword: resetPassword,

			// Users
			createUser: createUser,
			getUserInfo: getUserInfo,
			updateUser: updateUser,
			updateUserImage: updateUserImage,
			setUserImg: setUserImg,
			getUserData: getUserData, // will return a users object by the display name
			getUserByID: getUserByID, // Will return a users object by the profile ID
			updateFavouritetracks: updateFavouritetracks, // send the updated Favourite tracks listing
			updateCart: updateCart, // Update the items in our cart
			getFaveTracks: getFaveTracks, // Diffrent end point
			getPurchasedTracks: getPurchasedTracks, // Diffrent end point

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
				//var tokenExp = jwtHelper.decodeToken(data.token).exp;
				setUser(data.user);
				setToken(data.token, tokenExp);
			};
			return resource.auth.getToken(credentials, initLogin).$promise;
		}

		// Logout
		function logout() {
			setToken(false);
			localStorage.deleteAllLocal();
		}

		// Get single use token from the API
		function getSingleUseToken() {
			return resource.auth.getSingleUseToken({action: 'single-use-token'}).$promise;
		}


		// Our token is about to expire. Lets go re-new it. Resolve the promise here
		function renewToken() {
			resource.auth.renewToken({action: 'renew-token'}).$promise.then(function(response) {
				var tokenExp = jwtHelper.decodeToken(response.token).exp;
				setToken(response.token, tokenExp);
			});
		}

		// Reset the users password - initial call
		function resetPasswordEmail(data) {
			data.action = 'request-password-reset';
			return resource.auth.requestPasswordEmail(data).$promise;
		}

		// Reset the users password
		function resetPassword(data) {
			data.action = 'password-reset';
			var initLogin = function(data) {
				var tokenExp = jwtHelper.decodeToken(data.token).exp;
				setUser(data.user);
				setToken(data.token, tokenExp);
			};
			return resource.auth.resetPassword(data, initLogin).$promise;
		}


		/**
		 *
		 * Users
		 *
		 */

		// create new user
		function createUser(input) {
			return resource.users.create(input).$promise;
		}

		// returns the user data
		function getUserInfo(id) {
			return resource.users.get({userId: id}).$promise;
		}

		// update users data
		function updateUser(id, updateData, actionPath) {
			return resource.users.update({userId: id, action: actionPath}, updateData).$promise;
		}

		// When we are always dealing with a real image object
		function updateUserImage(id, updateData, actionPath) {
			return resource.users.image({userId: id, action: actionPath}, updateData).$promise;
		}

		// For setting an image as facebook, gravatar, default etc (has to be a .create as it needs to be a POST request - sy says)
		function setUserImg(id, endpoint, updateData) {
			return resource.users.create({userId: id, action: endpoint}, updateData).$promise;
		}

		// Will return the profile for the displayName in the URL segment
		function getUserData(displayName) {
			return resource.users.get({'where[display_name]': displayName, 'limit' : 1}).$promise;
		}

		// Will return the profile for the displayName in the URL segment
		function getUserByID(userID) {
			return resource.users.get({'userId': userID}).$promise;
		}

		// Update favourite tracks, send the full array here or a empty array
		function updateFavouritetracks(userId, tracksArray) {
			return resource.users.update({userId: userId}, tracksArray).$promise;
		}

		// Update favourite tracks, send the full array here or a empty array
		function updateCart(userId, tracksObject) {
			return resource.users.update({userId: userId}, tracksObject).$promise;
		}

		// The fave tracks has a new endpoint so fire against to get favourited tracks
		function getFaveTracks(userId, queryObj) {
			return resource.users.get({'userId': userId, 'action': 'favourited-tracks'}, queryObj).$promise;
		}

		// The purchased tracks has a new endpoint so fire against to get favourited tracks
		function getPurchasedTracks(userId, queryObj) {
			return resource.users.get({'userId': userId, 'action': 'purchased-tracks'}, queryObj).$promise;
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

			/**
			 * If they have favourited_tracks in the user object add it to the local storage
			 */
			if(user.favourited_tracks){
				localStorage.addLocal('faveTracksCount', user.favourited_tracks.length);
			}

			/**
			 * If the user has lqa_viewed set it in the $localStorage
			 */
			if(user.lqa_viewed)
				localStorage.addLocal('laqViewed', user.lqa_viewed);

		}

		/**
		 * Adds he token to the local storage and sets the Auth $http header or removes the header
		 */
		function setToken(token, tokenExp) {
			$localStorage.token = {token: token, tokenExp: tokenExp};
			if (token) {
				$http.defaults.headers.common.Authorization = 'Bearer ' + token;
			} else {
				delete $localStorage.token;
				delete($http.defaults.headers.common.Authorization);
			}
		}



	}

})();
