(function() {
    'use strict';

    angular
        .module('app', [
        	'ngRoute',
            'ngLodash',
            'app.routes',
            'app.factory',
			'app.controllers',
            'app.filters',
            'ui.router',
            'partials'
        ]);

    angular.module('app.routes', ['ngRoute','ui.router']);
    angular.module('app.factory', ['ngResource']);
    angular.module('app.controllers', []);
    angular.module('app.filters', []);

})();