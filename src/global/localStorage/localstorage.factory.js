(function() {
	'use strict';

	angular
		.module('app.factory')
		.factory('localStorage', localStorage);

	localStorage.$inject = ['$localStorage'];

	/**
	 * All interaction with the storage provider needs to go though this factory. It will keep both the local storage
	 * and the factory object aligned so we can watch changes happening and have a better control over interaction
	 *
	 * @author Peter Ingram <peter.ingram0@gmail.com>
	 */
	function localStorage($localStorage) {

		var localStorageObj = {};

		var service = {
			addLocal: addLocal,
			getStorage: getStorage,
			deleteLocal: deleteLocal,
			preLoad: preLoad,
			deleteAllLocal: deleteAllLocal
		};

		return service;

		/**
		 * Add the item to local storage and the local object
		 */
		function addLocal(key, val) {

			$localStorage[key] = val;
			localStorageObj[key] = val;

		}

		/**
		 * Delete set keys from the localStorage object and the $localStorage
		 */
		function deleteLocal(key) {
			delete localStorageObj[key];
		}

		/**
		 * Delete All keys from the localStorage object and the $localStorage.
		 */
		function deleteAllLocal() {

			$localStorage.$reset();

			angular.forEach(localStorageObj, function(value, key) {
				delete localStorageObj[key];
			});

		}

		/**
		 * Returns the factory's local storage object not the real local storage (as these should be inline with each other)
		 */
		function getStorage() {
			return localStorageObj;
		}

		/**
		 * This function will run when you first load the page, its job is to check in your local storage and move everything
		 * into the factory object (so that the factory object is the same as the localStorage). Every update from then on
		 * will update in both places so everything is aligned.
		 */
		function preLoad() {

			angular.forEach($localStorage, function(value, key) {
				localStorageObj[key] = value
			});

		}

	}

})();
