var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
gulp.task('default', ['start']);

gulp.task('start', function () {
  nodemon({
    script: './bin/www'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
  .on('restart', function () {
      console.log('restarted!')
    })
})


gulp.task('test', function () {
    return gulp.src('./test/test.js')
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha());
});
