import gulp                 from 'gulp'
import requireDir           from 'require-dir'

import runSequence          from 'gulp-sequence'
import shell                from 'gulp-shell'


let dir = requireDir('./tasks');


gulp.task('dev', shell.task([
    "gulp init-base",
    "gulp md5",
    "NODE_ENV=development ./node_modules/.bin/nodemon ."
]));


gulp.task('default', shell.task([
    "NODE_ENV=development ./node_modules/.bin/nodemon ."
]));


gulp.task('clean', function (cb) {
    runSequence('clean-base','clean-deployed-react',cb)
});


gulp.task('preDeploy', function (cb) {
    runSequence('init-base', 'clean-deployed-react', 'pack-react','md5',cb)
});




