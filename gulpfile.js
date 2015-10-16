var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var mochaOptions = {
	ui : 'bdd',
	reporter: 'list'
};

gulp.task('mocha-frontend', function() {
	return gulp.src('js/tests/_index.html')
		.pipe(mochaPhantomJS(mochaOptions));
});

gulp.task('mocha-backend', function() {
	return gulp.src(['tests/*-test.js'], {read: false})
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('js-compress', function()
{
	return gulp.src(['js/eventEmitter.js','js/template.js','js/chat.js','js/client.js'])
		.pipe(concat({path: 'app.js', stat: {mode: '0666'}}))
		.pipe(uglify())
		.pipe(gulp.dest('build/js/'));
});

gulp.task('css-compress', function()
{
	return gulp.src('css/*.css')
		.pipe(minifyCss())
		.pipe(concat({path: 'style.css', stat: {mode: '0666'}}))
		.pipe(gulp.dest('build/css/'));
});

gulp.task('test', ['mocha-backend', 'mocha-frontend']);
gulp.task('build', ['js-compress', 'css-compress']);