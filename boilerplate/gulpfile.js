const path = require('path');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babel = require('babelify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const moduleImporter = require('sass-module-importer');
const favicons = require("gulp-favicons");
const nunjucks = require('gulp-nunjucks');
const browserSync = require('browser-sync').create();

gulp.task('default', ['js', 'html', 'fonts', 'img', 'styles', 'favicon', 'serve']);

gulp.task('serve', () => {
    browserSync.init({
        server: "app"
    });

    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/html/**/*.html', ['html']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
});

gulp.task('html', () => {
    return gulp.src("src/html/**/*.html")
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('app'));
});

gulp.task('fonts', () => {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest('app/fonts'));
});

gulp.task('img', () => {
    return gulp.src("src/img/**/*")
        .pipe(gulp.dest('app/img'));
});

gulp.task('favicon', () => {
    return gulp.src('src/favicon.png')
        .pipe(favicons({
            pipeHTML: false
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('js', () => {
    var b = browserify({
        entries: './src/js/main.js',
        debug: true
    }).transform(babel);

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app'));
});

gulp.task('styles', () => {
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ importer: moduleImporter() }))
        .pipe(concat('bundle.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app'));
});