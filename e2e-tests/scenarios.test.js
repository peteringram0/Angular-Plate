(function () {

	'use strict';

	/* https://github.com/angular/protractor/blob/master/docs/toc.md */

	describe('my app', function() {

		browser.get('index.html');

		browser.waitForAngular();

		describe('view1', function() {

			beforeEach(function() {
				browser.get('/view1');
			});

			it('should render view1 when user navigates to /view1', function() {
				expect(element.all(by.css('p')).first().getText()).
					toMatch(/This is the partial for view 1/);
			});

		});

		describe('view2', function() {

			beforeEach(function() {
				browser.get('/view2');
			});

			it('should render view2 when user navigates to /view2', function() {
				expect(element.all(by.css('p')).first().getText()).
					toMatch(/This is the partial for view 2./);
			});

		});
	});

}());
