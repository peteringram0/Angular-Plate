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

		var localStorageObj = {
			user: {}
		};

		var service = {
			addLocal: addLocal,
			getStorage: getStorage,
			deleteLocal: deleteLocal,
			preLoad: preLoad,
			deleteAllLocal: deleteAllLocal,
			deleteAllLocalExceptUser: deleteAllLocalExceptUser,
		};

		return service;

		/**
		 * Add the item to local storage and the local object
		 * @author Peter Ingram <peter.ingram@hutchhouse.com>
		 */
		function addLocal(key, val) {

			//$localStorage[key] = val;
			localStorageObj[key] = val;

			/**
			 * If we are dealing with the user object add this to the $localStorage.
			 * Everything else just needs to go into memory
			 */
			if(key === 'user') {
				$localStorage[key] = val;
			}

		}

		/**
		 * Delete set keys from the localStorage object and the $localStorage
		 */
		function deleteLocal(key) {
			delete localStorageObj[key];
		}

		/**
		 * Delete All keys from the localStorage object and the $localStorage. Run though in a foreach so that we dont delete
		 * the parent object ref. So angular continues to dynamically update
		 */
		function deleteAllLocal() {

			$localStorage.$reset({
				laqViewed: localStorageObj.laqViewed
			});

			angular.forEach(localStorageObj, function(value, key) {
				if(key !== 'laqViewed')
					delete localStorageObj[key];
			});

		}

		/**
		 * Delete everything local apart from $localStorage.user and localStorageObj.user
		 */
		function deleteAllLocalExceptUser() {
			angular.forEach(localStorageObj, function(value, key) {
				if(key !== 'user') {
					delete localStorageObj[key];
				}
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
		 *
		 * @author Peter Ingram <peter.ingram@hutchhouse.com>
		 */
		function preLoad() {

			/**
			 * Move user from localStorage to the factory
			 */
			localStorageObj.user = $localStorage.user;

			/**
			 * Move the favetracks count
			 */
			localStorageObj.faveTracksCount = $localStorage.faveTracksCount;

			/**
			 * Low Quality Alert Viewed
			 */
			localStorageObj.laqViewed = $localStorage.laqViewed;

		}

	}

})();
