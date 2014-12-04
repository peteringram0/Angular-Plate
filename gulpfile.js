'use strict';

/**
 * SDM gulp file
 * @author Peter Ingram <peter.ingram@hutchhouse.com>
*/

/**
 * Declare dependencies
 */
var gulp = require('gulp'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	notify = require('gulp-notify'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
	del = require('del'),
	browserSync = require('browser-sync'),
	minifycss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
  bowerFiles = require('bower-files')(),
  ngHtml2Js = require("gulp-ng-html2js"),
  order = require("gulp-order");

/**
 * This is the name of the .min file that will be generated by gulp.
 */
var appName = 'angularjsboilerplate';

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
 * On error function, leave blank as we want to use plumber reporting
 */
var onError = function(err) {
};

/**
 * Styles gulp task, used for only our styles.scss file
 */
gulp.task('styles', function() {
  return gulp.src('build/styles/styles.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(gulp.dest(target+'/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(target+'/css'));
});

/**
 * Vendor styles. Gulp combines all third party styles into vendor.min.css file. This is so we can have
 * some seperation between our own CSS and vendor CSS. SCSS sheets we want to compile need to be specified
 * in here.
 */
gulp.task('vendorstyles', function() {
  return gulp.src('build/styles/vendor.scss')
    .pipe(sass({
      includePaths: [
        bower + '/bootstrap-sass-official/assets/stylesheets',
        bower + '/fontawesome/scss',
      ]
    }))
    .on('error', notify.onError(function(error){
      return 'Error: '+error.message;
    }))
    .pipe(gulp.dest(target+'/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(target+'/css'));
});

/**
 * Move fonts from fontawsome
 */
gulp.task('fonts', function() { 
  return gulp.src(bower + '/fontawesome/fonts/**.*') 
    .pipe(gulp.dest(target+'/fonts')); 
});

/**
 * Move htaccess file
 */
gulp.task('htaccess', function() { 
  return gulp.src('build/.htaccess') 
    .pipe(gulp.dest(target)); 
});

/**
 * All our scripts are concatanated and created as APPNAME.js
 */
gulp.task('scripts', function() {
  return gulp.src(['build/**/*.js', '!build/**/*.test.js'])
    .pipe(order([
      'app.js',
      '**/*.js'
    ]), {base: 'build/'})
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(concat(appName+'.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify({ mangle: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(target+'/js'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 * Gulp cleaning task deletes the whole dist directory ready for the other scripts to re-build it
 */
gulp.task('clean', function(cb) {
  del(['dist/'], cb);
});

gulp.task('html',function(){

  /**
   * All .tpl files
   */
  gulp.src("build/**/*.tpl.html")
    .pipe(ngHtml2Js({
      moduleName: "partials"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("./dist/partials"))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/partials"))

  /**
   * Move the main index.html page
   */
  gulp.src('./build/index.html')
    .pipe(gulp.dest(target));

});

/**
 * Moves all images from within build to the target location
 */
gulp.task('images', function(){
  gulp.src('./build/images/**/*.*')
  	.pipe(gulp.dest(target));
});

/**
 * gets all the bower files (From the bower.json list), excluding any that are specified within bower.json
 * and concatanates them all into a vendor.js file.
 */
gulp.task('concatbower', function(){
  return gulp.src(bowerFiles.js)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(target+'/js'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 * Runs the clean task first then runs everything needed to build up that target directory
 */
gulp.task('everything', ['clean'], function() {
  gulp.start('htaccess', 'concatbower', 'styles', 'scripts', 'images', 'html', 'vendorstyles', 'fonts');
});

/**
 * This task watches all the specified area's, on any change it will run the associated task then trigger
 * a browersync reload.
 */
gulp.task('watch', ['browser-sync'], function(){
  gulp.watch('build/styles/**/*.scss', ['styles', browserSync.reload]);
  gulp.watch('build/**/*.js', ['scripts', browserSync.reload]);
  gulp.watch('build/images/**/*.*', ['images', browserSync.reload]);
  gulp.watch('build/**/*.tpl.html', ['html', browserSync.reload]);
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
gulp.task('default', ['everything'], function () {
	gulp.start('watch', 'browser-sync');
});