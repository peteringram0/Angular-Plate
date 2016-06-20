(function() {
	'use strict';

	angular
		.module('app.directive')
		.directive('helloWorld', helloWorld);

	function helloWorld() {

		var directive = {
			link: link,
			templateUrl: 'components/hello-world-directive/hello-world.directive.tpl.html',
			restrict: 'EA'
		};

		return directive;

		function link() {

			/* jshint validthis: true */
			//var vm = scope;

		}

	}

})();

