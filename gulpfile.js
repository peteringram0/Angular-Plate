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
 *
 * ::PRODUCTION ENVIROMENT:: (Watch function will not run and minified files will be loaded)
 * - Run 'NODE_ENV=prod gulp everything'
 *
 *
 * @author Peter Ingram <peter.ingram0@gmail.com>
 */

/**
 * Declare dependencies
 */
var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var git = require('git-rev');
var plugins = require('gulp-load-plugins')();
var historyApiFallback = require('connect-history-api-fallback');

var settings = {
	scripts: ['build/**/*.js', '!build/assets/*.js'],
	scriptsOrder: ['app.js', '**/*.js'],
	vendor: ['node_modules/angular/angular.min.js', 'node_modules/angular-ui-router/release/angular-ui-router.min.js'],
	partials: ['build/**/*.tpl.html', '!build/index.html'],
	styles: 'build/styles/styles.scss',
	assets: 'build/assets/**/*.*',
	index: 'build/index.html'
};

var reload = browserSync.reload;

/**
 * Environments. There are two current types on environments in this app
 *
 * dev || prod
 */
var ENV = process.env.NODE_ENV || 'dev';

/**
 * On error function, leave blank as we want to use plumber reporting
 */
var onError = function(err) {
};

/**
 * Production mode is true or false, used for gulp-if on tasks
 */
var productionMode = ((ENV === 'prod') ? true : false);

/**
 * Function will look at GIT and get the current tag release. This is then appended as
 * a version number on the scripts within the index.html page.
 */
var RELEASE_TAG;
gulp.task('releaseTag', function(done) {
	git.tag(function(str) {
		RELEASE_TAG = str || 0;
		return done();
	});
});

/**
 * Styles gulp task, used for only our styles.scss file.
 *
 * We have two tasks for styles. One produces a min and the other a full with a source map.
 * This is as you can minify after producing a sourcemap and we want the other not to contain the map.
 */
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
		.pipe(plugins.if(!productionMode, gulp.dest('dist')))
		.pipe(plugins.if(productionMode, plugins.rename({suffix: '.min'})))
		.pipe(plugins.if(productionMode, plugins.minifyCss()))
		.pipe(plugins.if(productionMode, gulp.dest('dist')))
		.pipe(reload({stream: true}));
});

/**
 * All our scripts are concatanated and created as APPNAME.js
 * Note: added in order which will process app.js first then everything else
 */
gulp.task('scripts', function() {

	return gulp.src(settings.scripts)
		.pipe(plugins.preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG}}))
		.pipe(plugins.order(settings.scriptsOrder), {base: 'build/'})
		.pipe(plugins.plumber({
			errorHandler: onError
		}))
		.pipe(plugins.concat('app.js'))
		.pipe(plugins.if(!productionMode, gulp.dest('dist')))
		.pipe(plugins.if(productionMode, plugins.uglify({mangle: false})))
		.pipe(plugins.if(productionMode, plugins.rename({suffix: '.min'})))
		.pipe(plugins.if(productionMode, gulp.dest('dist')))
		.pipe(reload({stream: true}));

});

/**
 * Gulp cleaning task deletes the whole dist directory ready for the other scripts to re-build it
 */
gulp.task('clean', function(cb) {
	del(['dist/'], cb);
});

gulp.task('html', function() {

	/**
	 * All .tpl files
	 */
	gulp.src(settings.partials)
		.pipe(plugins.ngHtml2js({
			moduleName: "partials"
		}))
		.pipe(plugins.concat("partials.js"))
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest("dist"))
		.pipe(reload({stream: true}));

	/**
	 * Move the main index.html page
	 */
	gulp.src(settings.index)
		.pipe(plugins.preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG}}))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));

});

/**
 * gets all the bower files (From the bower.json list), excluding any that are specified within bower.json
 * and concatanates them all into a vendor.js file.
 */
gulp.task('concatvendor', function() {
	return gulp.src(settings.vendor)
		.pipe(plugins.concat('vendor.min.js'))
		.pipe(plugins.if(productionMode, plugins.uglify({mangle: false})))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
});

/**
 * Browser-sync setup task
 */
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "dist",
			middleware: [ historyApiFallback() ]
		}
	});
});

/**
 * Move Assets file
 */
gulp.task('assets', function() {
	return gulp.src(settings.assets)
		.pipe(gulp.dest('dist'));
});

/**
 * This task watches all the specified area's, on any change it will run the associated task then trigger
 * a browersync reload.
 */
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('build/styles/**/*.scss', ['styles']);
	gulp.watch(settings.scripts, ['scripts']);
	gulp.watch(settings.assets, ['assets']);
	gulp.watch([settings.index,settings.partials], ['html']);
});

/**
 * Runs the clean task first then runs everything needed to build up that target directory
 */
gulp.task('everything', function() {
	gulp.start('assets', 'styles', 'html', 'scripts', 'concatvendor');
});

/**
 * Default task that is run when you just run gulp on its own. Will first kick off browser-sync then run everything
 * followed by the watch function that will in turn trigger gulp functions on changes
 */
gulp.task('default', ['clean', 'releaseTag', 'everything', 'watch'], function() { });
