var gulp            = require('gulp'),
    plumber         = require('gulp-plumber'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync'),
    concat          = require('gulp-concat'),
    babel           = require('gulp-babel'),
    cssnano         = require('gulp-cssnano'),
    rename          = require('gulp-rename'),
    del             = require('del'),
    autoprefixer    = require('gulp-autoprefixer');

//compile and sync scss files
gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(['last 2 versions', '>1%'], {cascade: false}))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//sync all you browsers
gulp.task('browserSync', () => {
    browserSync({
        server: { baseDir: 'app'},
        notify: false //delete notification
    })
});

//delete dist folder, and create it again after compiling
gulp.task('clean', function() {
    return del.sync('dist')
});

//watch changes in sass folder
gulp.task('watch', ['browserSync'], () => { //['browserSync'..] - this runs all inside [] before watch
    gulp.watch('./app/sass/**/*.scss', ['sass']);
    gulp.watch('./app/*.html', browserSync.reload); //watch HTML
    gulp.watch('./app/js/*.js', browserSync.reload); //watch JS
});

// build for production
gulp.task('build', ['clean', 'sass'], () => {
    gulp.src('./app/css/easy-notification.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css'));

    gulp.src('./app/js/easyNotification.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./dist/js'));

    gulp.src('./app/img/easyNotification/**/*')
        .pipe(gulp.dest('./dist/img'));
});
