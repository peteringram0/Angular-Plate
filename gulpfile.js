/*eslint-disable */

'use strict';

/**
 * Gulp file
 *
 *_____ ____  __  __ __  __          _   _ _____   _____
 / ____/ __ \|  \/  |  \/  |   /\   | \ | |  __ \ / ____|
 | |   | |  | | \  / | \  / |  /  \  |  \| | |  | | (___
 | |   | |  | | |\/| | |\/| | / /\ \ | . ` | |  | |\___ \
 | |___| |__| | |  | | |  | |/ ____ \| |\  | |__| |____) |
 \_____\____/|_|  |_|_|  |_/_/    \_\_| \_|_____/|_____/
 *
 * NODE_ENV=prod gulp everything && NODE_ENV=dev gulp || gulp (will run dev env) && NODE_ENV=homedev gulp
 *
 * ::OFFICE DEV ENVIROMENT::
 * - Run 'gulp' on its own or 'NODE_ENV=dev gulp'
 *
 * ::HOME DEV ENVIROMENT:: (Gives you access to the public API and un-minimized files)
 * - Run 'NODE_ENV=homedev gulp'
 *
 * ::PRODUCTION ENVIROMENT:: (Watch function will not run and minified files will be loaded)
 * - Run 'NODE_ENV=prod gulp everything'
 *
 *
 * @author Peter Ingram <peter.ingram@hutchhouse.com>
 */

/**
 * Declare dependencies
 */
var gulp = require('gulp'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	notify = require('gulp-notify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	del = require('del'),
	browserSync = require('browser-sync'),
	minifycss = require('gulp-minify-css'),
	bowerFiles = require('bower-files')(),
	ngHtml2Js = require('gulp-ng-html2js'),
	order = require('gulp-order'),
	chmod = require('gulp-chmod'),
	sourcemaps = require('gulp-sourcemaps'),
	preprocess = require('gulp-preprocess'),
	gulpif = require('gulp-if'),
	concatCss = require('gulp-concat-css'),
	git = require('git-rev'),
	eslint = require('gulp-eslint'),
	scsslint = require('gulp-scss-lint');

/**
 * This is the name of the .min file that will be generated by gulp.
 */
var appName = 'theme';

/**
 * Should match the host file entry
 */
var hostLocation = 'angularjsboilerplate.dev';

/**
 * Used by browser sync to trigger page reloads
 */
var reload = browserSync.reload;

/**
 * target directory where gulp will store application
 */
var target = 'dist';

/**
 * Bower file location, relative to gulp file
 */
var bower = 'bower_components';

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
	return gulp.src(['build/styles/styles.scss'])
		.pipe(scsslint({
			'config': 'lint.yml'
		}))
		.pipe(gulpif(!productionMode, sourcemaps.init()))
		.pipe(sass({
			includePaths: [
				bower + '/bootstrap-sass-official/assets/stylesheets',
				bower + '/fontawesome/scss',
			]
		}))
		//.pipe(gulpif(productionMode, concatCss(appName + '.css')))
		.pipe(gulpif(!productionMode, sourcemaps.write()))
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(gulpif(!productionMode, gulp.dest(target + '/css')))
		.pipe(gulpif(productionMode, rename({suffix: '.min'})))
		.pipe(gulpif(productionMode, minifycss()))
		.pipe(gulpif(productionMode, gulp.dest(target + '/css')))
});

/**
 * Move fontawesome from fontawsome
 */
gulp.task('fontawesome', function() { 
	return gulp.src([bower + '/fontawesome/fonts/**.*']) 
	.pipe(gulp.dest(target + '/fonts'));
});

/**
 * Move htaccess file
 */
gulp.task('htaccess', function() { 
	return gulp.src('build/**/.htaccess') 
	.pipe(gulp.dest(target)); 
});

/**
 * All our scripts are concatanated and created as APPNAME.js
 * Note: added in order which will process app.js first then everything else
 */
gulp.task('scripts', function() {
	return gulp.src(['build/**/*.js', '!build/**/*.test.js'])
		.pipe(preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG}}))
		.pipe(order([
			'app.js',
			'**/*.js'
		]), {base: 'build/'})
		.pipe(eslint(
			{rulePaths: ['/']}
		))
		.pipe(eslint.format())
		//.pipe(eslint.failAfterError()) Fail if any ESlint errors
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(concat(appName + '.js'))
		.pipe(gulpif(!productionMode, gulp.dest('dist/js')))
		.pipe(gulpif(productionMode, uglify({mangle: false})))
		.pipe(gulpif(productionMode, rename({suffix: '.min'})))
		.pipe(gulpif(productionMode, gulp.dest(target + '/js')))
		.pipe(browserSync.reload({stream: true}));
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
	gulp.src("build/**/*.tpl.html")
		.pipe(ngHtml2Js({
			moduleName: "partials"
		}))
		.pipe(concat("partials.js"))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest("./dist/partials"));

	/**
	 * Move the main index.html page
	 */
	gulp.src('./build/index.html')
		.pipe(preprocess({context: {ENV: ENV, RELEASE_TAG: RELEASE_TAG}}))
		.pipe(gulp.dest(target));

});

/**
 * Moves all images from within build to the target location
 */
gulp.task('images', function() {
	gulp.src(['./build/**/*.png', './build/**/*.jpg', './build/**/*.gif', './build/**/*.ico'])
		.pipe(chmod(755))
		.pipe(gulp.dest(target));
});

/**
 * gets all the bower files (From the bower.json list), excluding any that are specified within bower.json
 * and concatanates them all into a vendor.js file.
 */
gulp.task('concatbower', function() {
	return gulp.src(bowerFiles.js)
		.pipe(concat('vendor.min.js'))
		.pipe(gulpif(productionMode, uglify({mangle: false})))
		.pipe(gulp.dest(target + '/js'))
		.pipe(browserSync.reload({stream: true}));
});

/**
 * Runs the clean task first then runs everything needed to build up that target directory
 */
gulp.task('everything', ['clean', 'releaseTag'], function() {
	gulp.start('htaccess', 'concatbower', 'styles', 'scripts', 'images', 'html', 'fontawesome');
});

/**
 * This task watches all the specified area's, on any change it will run the associated task then trigger
 * a browersync reload.
 */
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('build/styles/**/*.scss', ['styles', browserSync.reload]);
	gulp.watch('build/**/*.js', ['scripts', browserSync.reload]);
	gulp.watch('build/images/**/*.*', ['images', browserSync.reload]);
	gulp.watch('build/**/*.tpl.html', ['html', browserSync.reload]);
	gulp.watch('build/index.html', ['html', browserSync.reload]);
	gulp.watch('build/**/*.test.js', ['scripts']);
});

/**
 * Browser-sync setup task
 */
gulp.task('browser-sync', function() {
	browserSync.init(null, {
		proxy: hostLocation
	});
});

/**
 * Default task that is run when you just run gulp on its own. Will first kick off browser-sync then run everything
 * followed by the watch function that will in turn trigger gulp functions on changes
 */
gulp.task('default', ['everything'], function() {
	gulp.start('watch', 'browser-sync');
});

/*eslint-enable */
