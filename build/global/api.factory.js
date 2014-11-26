(function() {
    'use strict';

    angular
        .module('app.factory')
        .factory('httpService', httpService);

	httpService.$inject = ['$resource', 'config', 'dataServiceFactory'];

	function httpService($resource, config, dataServiceFactory) {
        
        var service = {
            get: get
        };

        return service;

        /**
         * [get description]
         * @author Peter Ingram <peter.ingram0@gmail.com>
         * @param  {string} type   [posts || pages]
         * @param  {[type]} id     [post id || page title]
         */
        function get(type, id) {
            getAPI(type, id).$promise.then(function(results){
                dataServiceFactory.add(type, results);
                return;
            });
        }
      
        /**
         * [getAPI description]
         * @author Peter Ingram <peter.ingram0@gmail.com>
         * @param  {[type]} type [description]
         * @param  {[type]} id   [description]
         * @return {[type]}      [description]
         */
        function getAPI(type, id) {
            var post1 = $resource('http://api.wordpress4.1/wp-json/'+type+'/'+id,
                { },
                {
                    'query': { 
                        method: 'GET',
                    }
                }
            );
            var post1Query = post1.query();
            return post1Query;
        }

    }


})();