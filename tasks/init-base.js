import gulp             from 'gulp'
import runSequence      from 'run-sequence'
import concat           from 'gulp-concat'
import uglify           from 'gulp-uglify'
import uglifycss        from 'gulp-uglifycss'
import rename           from 'gulp-rename'
import sourcemaps       from 'gulp-sourcemaps'


import path             from 'path';
import config           from 'config';
import del              from 'del'

import copyDir          from 'copy-dir'

let createConfig = require(path.join(config.path.client, 'static', 'base', 'config.js'));
let source = createConfig.source;
let dist = createConfig.dist;


gulp.task('init-base', function (cb) {
    runSequence('clean-base', 'base-js', 'base-css', cb)
});

gulp.task('clean-base', function (cb) {
    del(dist.self, function () {
    });
    cb();
});

gulp.task('base-js', function () {
    return gulp.src(source.js).pipe(sourcemaps.init())
        //.pipe(uglify())
        .pipe(concat('base.js'))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist.js));
});
gulp.task('base-css', function () {
    return gulp.src(source.css).pipe(sourcemaps.init())
        .pipe(uglifycss())
        .pipe(concat('base.css'))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist.css));
});

