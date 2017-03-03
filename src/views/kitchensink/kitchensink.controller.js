(function () {
	'use strict';

	angular
		.module('app.controllers')
		.controller('kitchensinkController', kitchensinkController);

	kitchensinkController.$inject = ['SweetAlert'];

	function kitchensinkController(SweetAlert) {

		// Binding to view
		var vm = this;

		/**
		 * Setup
		 */
		vm.sweetAlert = function () {
			SweetAlert.swal("Good job!", "You clicked the button!", "success");
		};

	}

})();
