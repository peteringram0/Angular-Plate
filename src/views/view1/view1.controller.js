(function() {
	'use strict';

	angular
		.module('app.controllers')
		.controller('view1', view1);

	view1.$inject = ['apiFactory', 'localStorage'];

	function view1(apiFactory, localStorage) {

		var vm = this;

		// Login function trigged from view
		vm.login = function() {

			var creds = {
				email: 'peter.ingram0@gmail.com',
				pass: 'password'
			};

			apiFactory.login(creds).then(function(response) {
				console.log('resolved: ', response);
			});

		};

		vm.getLocalStorage = function() {
			console.log(localStorage.getStorage());
		}

	}

})();
