describe('test view1 module', function() {

  	beforeEach(module('app.factory'));

	it('dataServiceFactory posts should be an array', inject(
		function(
			dataServiceFactory
		) {
			var posts = dataServiceFactory.getPosts();
			expect({}.toString.call(posts)).toBe('[object Array]');
		}
	));

});