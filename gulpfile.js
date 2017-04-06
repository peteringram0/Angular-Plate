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
 * - Run 'gulp'
 *
 * ::PRODUCTION ENVIROMENT:: (Watch function will not run and minified files will be loaded)
 * - Run 'gulp build --production'
 *
 * @author Peter Ingram <peter.ingram0@gmail.com>
 *
 * ## Version 2.5 ##
 * * With FA
 * * Fixed issue with re-load happening to quickly
 */

	// Dependencies
var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var git = require('git-rev');
var plugins = require('gulp-load-plugins')();
var streamqueue = require('streamqueue');
var bootstrap = require('bootstrap-styl');
var autoprefixer = require('autoprefixer-stylus');
var packageJSON = require('./package.json');
var settings = packageJSON.settings;

var ENV_DEV = require('./dev.json');
var ENV_PROD = require('./prod.json');

var fontAwesomeStylus;
if(settings.fonts)
	fontAwesomeStylus = require("fa-stylus");

// Settings
var reload = browserSync.reload; // Reload browserSync
var RELEASE_TAG; // Gets loaded from the GIT version on production builds (Makes sure when the app is updated its never cached)

var ENV = 'dev'; // Set dev enviroment unless we pass in --production
if(plugins.util.env.production)
	ENV = 'prod';

var onError = function(err) { }; // On error function
var productionMode = ((ENV === 'prod') ? true : false); // Production mode is true or false, used for gulp-if on tasks

// Function will look at GIT and get the current tag release. This is then appended as a version number
// on the scripts within the index.html page.
gulp.task('releaseTag', function(done) {
	git.short(function(str) {
		// RELEASE_TAG = str || 0;
		RELEASE_TAG = Math.floor(Math.random() * 10000) + 1;
		return done();
	});
});

/**
 * Any errors will be paused and show this warning !!
 * @param error
 */
function swallowError (error) {
	console.log(error.toString());
	this.emit('end')
}

// Styles
gulp.task('styles', function() {

	var vendorFiles = gulp.src(settings.vendorStyles);

	var styleFiles = gulp.src(settings.styles)
		.pipe(plugins.if(!productionMode, plugins.sourcemaps.init()))
		.pipe(plugins.stylus({
			use: [
				bootstrap(),
				autoprefixer({browsers: ["> 0%"]}),
				fontAwesomeStylus()
			]
		}))
		.on('error', swallowError)
		.pipe(plugins.if(!productionMode, plugins.sourcemaps.write()))
		.pipe(plugins.plumber({
			errorHandler: onError
		}));

	return streamqueue({objectMode: true}, vendorFiles, styleFiles)
		.pipe(plugins.concatCss('styles.css'))
		.pipe(plugins.if(productionMode, plugins.cleanCss({compatibility: 'ie8'})))
		.pipe(gulp.dest('dist'))
		// .pipe(reload({stream: true}));

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
		.pipe(plugins.order(settings.scriptsOrder), {base: 'src/'})
		.pipe(plugins.plumber({
			errorHandler: onError
		}))
		.pipe(plugins.concat('app.js'))
		.pipe(plugins.if(productionMode, plugins.uglify({mangle: false})));

	return streamqueue({objectMode: true}, vendorFiles, partialFiles, scriptFiles)
		.pipe(plugins.concat('app.js'))
		.pipe(gulp.dest('dist'))
		// .pipe(reload({stream: true}));

});

// Move and process the main index.html page
gulp.task('html', function() {
	gulp.src(settings.index)
		.pipe(plugins.preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG, apiURL: ((ENV === 'prod') ? ENV_PROD.apiURL : ENV_DEV.apiURL)}}))
		.pipe(plugins.if(productionMode, plugins.htmlmin({collapseWhitespace: true})))
		// .pipe(plugins.rename("angular.blade.php"))
		.pipe(gulp.dest('dist'))
		// .pipe(reload({stream: true}));
});

// Gulp cleaning task deletes the whole dist directory ready for the other scripts to re-build it
gulp.task('clean', function() {
	del(['dist/app.js']);
	del(['dist/styles.css']);
});

// Browser-sync setup task - Hostlocation from package.json
gulp.task('browser-sync', function() {

	if(settings.hostLocation) {
		browserSync.init(null, {
			proxy: settings.hostLocation
		});
	} else {
		browserSync.init({
			server: {
				baseDir: "./dist"
			}
		});
	}

});

// Move Assets file
gulp.task('assets', function() {

	gulp.src(settings.assets)
		.pipe(gulp.dest('dist'));

	if(settings.fonts)
		gulp.src(settings.fonts)
			.pipe(gulp.dest('dist/fonts'));

});

// Watch everything
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('src/**/*.styl', ['styles', browserSync.reload]);
	gulp.watch(settings.partials, ['scripts', browserSync.reload]);
	gulp.watch(settings.scripts, ['scripts', browserSync.reload]);
	gulp.watch(settings.assets, ['assets', browserSync.reload]);
	gulp.watch(settings.partials, ['html', browserSync.reload]);
	gulp.watch(settings.index, ['html', browserSync.reload]);
});

// Build the app
gulp.task('build', ['clean', 'releaseTag'], function() {
	gulp.start('assets', 'styles', 'scripts', 'html');
});

// Default task If we are in production mode only run the build, if we are in dev mode run build then watch
gulp.task('default', function() {
	if(productionMode)
		gulp.start('build');
	else
		gulp.start('build', 'watch');
});
