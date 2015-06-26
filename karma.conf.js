module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'dist/js/vendor.min.js',
			'dist/partials/partials.min.js',
			'dist/js/theme.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'build/**/*.test.js'
		],
		exclude: [],
		preprocessors: {},
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false
	});
};