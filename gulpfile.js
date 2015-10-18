var gulp = require('gulp');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var mochaOptions = {
	ui : 'bdd',
	reporter: 'list'
};

gulp.task('mocha-backend', function() {
	return gulp.src(['tests/backend/*-test.js'], {read: false})
		.pipe(mocha({reporter: 'list'}));
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
	return gulp.src('css/*.sass')
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(concat({path: 'style.css', stat: {mode: '0666'}}))
		.pipe(gulp.dest('build/css/'));
});

gulp.task('test', ['mocha-backend']);
gulp.task('build', ['js-compress', 'css-compress']);
gulp.task('default', ['build']);

//var watcherJs = gulp.watch(['js/*.js'], ['js-compress']);
//watcherJs.on('change', function(event){
//	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
//});