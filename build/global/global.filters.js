(function() {
    'use strict';

    angular
        .module('app.filters')
        .filter('unsafe', unsafe);

        unsafe.$inject = ['$sce'];

        /**
         * Filter used in ng-bind-html to be able to display HTML content not from this server
         * @author Peter Ingram <peter.ingram0@gmail.com>
         * @param  {[type]} $sce [description]
         */
        function unsafe($sce) {
            return $sce.trustAsHtml;
        }

})();