var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var mocha = require('gulp-mocha');

var mochaOptions = {
	ui : 'bdd',
	reporter: 'list'
};

gulp.task('mocha-frontend', function() {
	return gulp.src('js/tests/index.html')
		.pipe(mochaPhantomJS(mochaOptions));
});

gulp.task('mocha-backend', function() {
	return gulp.src(['tests/*-test.js'], {read: false})
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('test', ['mocha-backend', 'mocha-frontend']);