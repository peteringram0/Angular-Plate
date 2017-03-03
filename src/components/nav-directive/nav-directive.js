(function () {
    'use strict';

    angular
        .module('app.directive')
        .directive('navDirective', navDirective);

    navDirective.$inject = ['$state', 'localStorage'];

    function navDirective($state, localStorage) {

        var directive = {
            link: link,
            templateUrl: 'components/nav-directive/nav-directive.tpl.html',
            restrict: 'EA',
        };

        return directive;

        function link(scope, element, attrs) {

            /* jshint validthis: true */
            var vm = scope;

            // Bind the local
            vm.local = localStorage.localStorageObj;

            /**
             * Logout
             */
            vm.logout = function () {
                localStorage.deleteAllLocal();
                $state.go('wrapper.login');
            };

        }

    }

})();
