(function() {
	'use strict';

	angular
		.module('app.controllers')
		.controller('view1', view1);

	view1.$inject = ['apiFactory', 'localStorage'];

	function view1(apiFactory, localStorage) {

		// Assign evertything to vm
		var vm = this;

		/**
		 * Login function test
		 */
		vm.login = function() {

			var creds = {
				email: 'peter.ingram0@gmail.com',
				password: 'password'
			};

			apiFactory.login(creds)
				.then(function(response) {
					console.log(response);
				});

		}

	}

})();
