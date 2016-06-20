'use strict';

/**
 *
 *_____ ____  __  __ __  __          _   _ _____   _____
 / ____/ __ \|  \/  |  \/  |   /\   | \ | |  __ \ / ____|
 | |   | |  | | \  / | \  / |  /  \  |  \| | |  | | (___
 | |   | |  | | |\/| | |\/| | / /\ \ | . ` | |  | |\___ \
 | |___| |__| | |  | | |  | |/ ____ \| |\  | |__| |____) |
 \_____\____/|_|  |_|_|  |_/_/    \_\_| \_|_____/|_____/
 *
 * ::DEV ENVIROMENT::
 * - Run 'gulp' on its own or 'NODE_ENV=dev gulp'
 *
 * ::PRODUCTION ENVIROMENT:: (Watch function will not run and minified files will be loaded)
 * - Run 'NODE_ENV=prod gulp everything'
 *
 * @author Peter Ingram <peter.ingram0@gmail.com>
 */

// Dependencies
var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var git = require('git-rev');
var plugins = require('gulp-load-plugins')();
var historyApiFallback = require('connect-history-api-fallback');
var streamqueue = require('streamqueue');
var packageJSON = require('./package.json');
var settings = packageJSON.settings;

// Settings
var reload = browserSync.reload;
var RELEASE_TAG;
var ENV = process.env.NODE_ENV || 'dev'; // Environments. dev || prod
var onError = function(err) { }; // On error function
var productionMode = ((ENV === 'prod') ? true : false); // Production mode is true or false, used for gulp-if on tasks

// Function will look at GIT and get the current tag release. This is then appended as a version number
// on the scripts within the index.html page.
gulp.task('releaseTag', function(done) {
	git.tag(function(str) {
		RELEASE_TAG = str || 0;
		return done();
	});
});

// Styles
gulp.task('styles', function() {
	return gulp.src(settings.styles)
		.pipe(plugins.if(!productionMode, plugins.sourcemaps.init()))
		.pipe(plugins.scss({
			noCache: true,
			style: 'compressed'
		}))
		// .pipe(plugins.if(productionMode, plugins.concatCss('app.css')))
		.pipe(plugins.if(!productionMode, plugins.sourcemaps.write()))
		.pipe(plugins.plumber({
			errorHandler: onError
		}))
		.pipe(plugins.if(productionMode, plugins.minifyCss()))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
});

// Run though all the scripts, vendor, partials and app scripts
gulp.task('scripts', function() {

	var vendorFiles = gulp.src(settings.vendor)
		.pipe(plugins.if(productionMode, plugins.uglify({mangle: false})));

	var partialFiles = gulp.src(settings.partials)
		.pipe(plugins.ngHtml2js({
			moduleName: "partials"
		}))
		.pipe(plugins.if(productionMode, plugins.uglify()));

	var scriptFiles = gulp.src(settings.scripts)
		.pipe(plugins.preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG}}))
		.pipe(plugins.order(settings.scriptsOrder), {base: 'build/'})
		.pipe(plugins.plumber({
			errorHandler: onError
		}))
		.pipe(plugins.concat('app.js'))
		.pipe(plugins.if(productionMode, plugins.uglify({mangle: false})));

	return streamqueue({objectMode: true}, vendorFiles, partialFiles, scriptFiles)
		.pipe(plugins.concat('app.js'))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));

});

// Move and process the main index.html page
gulp.task('html', function() {
	gulp.src(settings.index)
		// .pipe(plugins.preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG}}))
		.pipe(plugins.if(productionMode, plugins.htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
});

// Gulp cleaning task deletes the whole dist directory ready for the other scripts to re-build it
gulp.task('clean', function() {
	del(['dist/']);
});

// Browser-sync setup task
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "dist",
			middleware: [historyApiFallback()]
		}
	});
});

// Move Assets file
gulp.task('assets', function() {
	return gulp.src(settings.assets)
		.pipe(gulp.dest('dist'));
});

// Watch everything
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('build/styles/**/*.scss', ['styles']);
	gulp.watch(settings.partials, ['scripts']);
	gulp.watch(settings.scripts, ['scripts']);
	gulp.watch(settings.assets, ['assets']);
	gulp.watch([settings.index, settings.partials], ['html']);
});

// Build the app
gulp.task('build', ['clean', 'releaseTag'], function() {
	gulp.start('assets', 'styles', 'html', 'scripts');
});

// Default task
gulp.task('default', ['build', 'watch']);
