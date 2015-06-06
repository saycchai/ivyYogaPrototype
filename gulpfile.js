var karma = require('karma').server;

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var browserify = require('browserify');
var source = require('vinyl-source-stream2');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var fse = require('fs-extra');
var shell = require('gulp-shell');
var rimraf = require('gulp-rimraf');
var replace = require('gulp-replace-task');  
var args = require('yargs').argv;
var runSequence = require('run-sequence');
var size = require('gulp-size');
var jshint = require('gulp-jshint');
var jsonminify = require('gulp-jsonminify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

function extend(a, b){
	for(var key in b)
		if(b.hasOwnProperty(key))
			a[key] = b[key];
    return a;
}

//if user supply the argument --platform, then use that supplied platform
//otherwise default is the os platform, if it is mac (darwin), then ios, otherwise use android
var osPlatform = process.platform === 'darwin'? 'ios' : 'android';
var platform = args.platform || osPlatform;

console.log('platform: ' + platform);

// Read the settings from the right file
var ionicFilename = 'ionic.project';
var ionicSettings = JSON.parse(fse.readFileSync('./' + ionicFilename, 'utf8'));

//Get the environment from the command line
//default is dev
var config = args.config || 'dev';
var configFilename = config + '.json';

console.log('config file: ' + configFilename);

var settings = JSON.parse(fse.readFileSync('./src/config/' + configFilename, 'utf8'));

extend(settings, {"platform": platform})
extend(settings, ionicSettings);

var srcPath = './src/www';
var testPath = './src/test';
var tmpPath = './tmp';
var tmpWwwPath = './tmp/www';
var tmpTestPath = './tmp/test';
var wwwPath = './www';

var paths = {
	srcJsPath: [srcPath + '/main.js', srcPath + '/app/**/*.js', srcPath + '/services/**/*.js', srcPath + '/directives/**/*.js', srcPath + '/filters/**/*.js']
	, tmpJsPath: [tmpWwwPath + '/main.js', tmpWwwPath + '/app/**/*.js', tmpWwwPath + '/services/**/*.js', tmpWwwPath + '/directives/**/*.js', tmpWwwPath + '/filters/**/*.js']
	, sass: ['./scss/**/*.scss']
};

gulp.task('default', ['build-www']);

gulp.task('test', function(callback) {
	return runSequence(
		'prepare-tmp'
		, 'run-test'
		, callback
	);
});

gulp.task('package-www', function(callback) {
	return runSequence(
		'test'
		, 'clean-www'
		, 'build-www'
		, callback
	);
});

gulp.task('build-www', function(callback) {
	return runSequence(
		'prepare-tmp'
		, 'copy-tmp-to-www'
		, 'clean-tmp'
		, callback
	);
});

gulp.task('prepare-tmp', function(callback) {
	return runSequence(
		'lint'
		, 'clean-tmp'
		, 'copy-src-to-tmp'
		, 'replace'
		, ['minify-css', 'minify-js', 'minify-json', 'minify-image'] //parallel tasks
		, callback
	);
});


gulp.task('clean-tmp', function() {
	return gulp.src([tmpPath], {base: './', read: false })
    .pipe(rimraf({ force: true }))
	.on('end', function(){console.log('... end clean-tmp');})
	;
});

gulp.task('clean-www', function() {
	return gulp.src(['./www'], {base: './', read: false })
    .pipe(rimraf({ force: true }))
	.on('end', function(){console.log('... end clean-www');})
	;
});

gulp.task('clean', function(callback) {
	return runSequence(['clean-tmp', 'clean-www'], callback);
});

gulp.task("lint", function() {
     return gulp.src(paths.srcJsPath)
        .pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		;
});

gulp.task('copy-src-to-tmp', function() {
	return gulp.src('./src/**/*', {read: true })
    .pipe(gulp.dest(tmpPath))
	.on('end', function(){console.log('... end copy-src-to-tmp');})
	;
});

/**
* replace config value for different environments (dev, qa, prd etc)
**/
gulp.task('replace', function () {  
	// Replace each placeholder with the correct value for the variable.  
	return gulp.src([tmpPath + '/**/*.js', tmpPath + '/**/*.html'], {base: tmpPath})  
	  .pipe(replace({
		patterns: [
		  {
			json: settings
		  }
		]
	  }))
	  .pipe(gulp.dest(tmpPath))
	  .on('end', function(){console.log('... end replace');})
	  ;
});

/**
* minify image
*/
gulp.task('minify-image', function() {
  return gulp.src([tmpWwwPath + '/img/**/*.jpg', tmpWwwPath + '/img/**/*.gif', tmpWwwPath + '/img/**/*.png', tmpWwwPath + '/img/**/*.jpeg'], {base: tmpWwwPath})
	.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
    .pipe(gulp.dest(tmpWwwPath))
    .pipe(size())
	.on('end', function(){console.log('... end minify-image');})
	;
});

/**
* minify json files
*/
gulp.task('minify-json', function() {
  return gulp.src(tmpWwwPath + '/**/*.json', {base: tmpWwwPath})
    .pipe(jsonminify())
    .pipe(gulp.dest(tmpWwwPath))
    .pipe(size())
	.on('end', function(){console.log('... end minify-json');})
	;
});

/**
* minify css
*/
gulp.task('minify-css', function() {
  return gulp.src(tmpWwwPath + '/css/**/*.css', {base: tmpWwwPath})
    .pipe(minifyCss({"keepSpecialComments": 0}))
    .pipe(gulp.dest(tmpWwwPath))
    .pipe(size())
	.on('end', function(){console.log('... end minify-css');})
	;
});

/**
* minify js
*/
gulp.task('minify-js', function() {
  return gulp.src(paths.tmpJsPath)
	.pipe(concat('app.bundle.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
//	.pipe(uglify({mangle: false}))
//		.on('error', gutil.log)
//		.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(tmpWwwPath))
	.pipe(size())
	.on('end', function(){console.log('... end minify-js');})
	;
});


/**
* browserify all the js files
*/
/*
gulp.task('browserify', function() {
	var b = browserify({
			entries: tmpPath + '/index.js'
			, debug: true
		});
		
    return b.bundle()
        // vinyl-source-stream makes the bundle compatible with gulp
        .pipe(source('app.bundle.js')) // Desired filename
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		   // Add transformation tasks to the pipeline here.
			.pipe(uglify({mangle: false}))
			.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
        // Output the file
        .pipe(gulp.dest(tmpPath))
		.on('end', function(){console.log('... end browserify');})
		;
});
*/

gulp.task('copy-tmp-to-www', function() {
	return gulp.src([tmpWwwPath + '/**/*', '!' + tmpWwwPath + '/**/index.js', '!' + tmpWwwPath + '/app/**/*.js', '!' + tmpWwwPath + '/{services,services/**}', '!' + tmpWwwPath + '/{directives,directives/**}'], {base: tmpWwwPath, read: true })
    .pipe(gulp.dest(wwwPath))
	.on('end', function(){console.log('... end copy-tmp-to-www');})
	;
});



/**
* Test task, run test once and exit
*/
gulp.task('run-test', function(done) {
    return karma.start({
        configFile: __dirname + '/tmp/test/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    })
	;
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

//Ionic Serve Task
gulp.task('run-ionic',shell.task([
  'ionic serve'
]));

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

//Ionic Serve Task
gulp.task('platform-add',
	shell.task(['ionic platform add ' + platform])
);


gulp.task('platform-build',
	shell.task(['ionic build ' + platform])
);

gulp.task('platform-emulate',
		shell.task(['ionic emulate ' + platform])
);


gulp.task('emulate',function(callback) {
	return runSequence('package-www', 'platform-add', 'platform-build', 'platform-emulate', callback);
});
