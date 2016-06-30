import gulp                         from 'gulp'
import cmd2amd                      from 'cmd2amd'
import config                       from 'config'
import path                         from 'path'
import esformatter                  from 'esformatter';

import fs                           from 'fs'
import fu                           from 'fileutil';
import md5                          from 'md5'
import _                            from 'lodash';

//config
let distPath = config.path.client + '/static/amd';
let sourcePath = config.path.client + '/pages';
let rootPath = path.join(config.path.client, '../');
let moduleRoot = config.path.client + '/static';

let externals = {
    "jquery": "jQuery",
    "react": "React",
    "react-dom": "ReactDOM"
};
let needPackRegExp = [
    'side-bar',
    'node_modules'
];
let needWatch = true;
let sourceMaps = true;
let options = {
    distPath,
    sourcePath,
    rootPath,
    externals,
    needPackRegExp,
    moduleRoot,
    needWatch,
    sourceMaps
};

gulp.task('b', function (cb) {
    cmd2amd(options);
    cb();

});
