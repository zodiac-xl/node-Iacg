import gulp         from 'gulp'
import shell        from 'gulp-shell'
import path         from 'path'
import del          from 'del'
import config       from 'config'
import fu           from 'fileutil';
import _            from 'lodash'



gulp.task('pack-react',shell.task([
    'webpack'
]));