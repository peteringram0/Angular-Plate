(function() {
    'use strict';

    angular
        .module('app.factory')
        .factory('dataServiceFactory', dataServiceFactory);
    
    /**
     * This should be an overview of what this factory's job is.
     * 
     * @author Peter Ingram <peter.ingram@hutchhouse.com>
     */
    function dataServiceFactory() {

        var posts = [];

        var service = {
            add: add,
            getPosts: getPosts
        };

        return service;

        /**
         * Adds to the posts array
         * 
         * @author Peter Ingram <peter.ingram@hutchhouse.com>
         * @param  {[type]} type [description]
         * @param  {[type]} data [description]
         */
        function add(type, data) {
            posts.push({type: data});
        }

        /**
         * Returns the post array
         * 
         * @author Peter Ingram <peter.ingram@hutchhouse.com>
         * @return {[type]} [description]
         */
        function getPosts() {
            return posts;
        }

    }

})();