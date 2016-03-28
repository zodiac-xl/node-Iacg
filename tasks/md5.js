import gulp                         from 'gulp'
import esformatter                  from 'esformatter';

import path                         from 'path';
import fs                           from 'fs'
import config                       from 'config'
import fu                           from 'fileutil';
import md5                          from 'md5'
import _                            from 'lodash';


function getFiles() {
    var files = [];


    var baseJsPath = path.join(config.path.client, 'static', 'base', 'dist', 'js');
    var baseJsFiles = fu.list(baseJsPath, {
        excludeDirectory: true, //不包含文件夹
        matchFunction: function (item) {
            return item.name.match(/.js$/);
        }
    });

    var pageJsFiles = fu.list(path.join(config.path.client, 'view', 'pages'), {
        excludeDirectory: true, //不包含文件夹
        matchFunction: function (item) {
            return item.name.match(/.js$/);
        }
    });
    files = files.concat(baseJsFiles, pageJsFiles);
    return files;
}


let readFile = function (src) {
    return fs.readFileSync(src, {'encoding': 'utf8'})
};

gulp.task('md5', function (cb) {
    var dist = path.join(config.path.server, 'md5Map.js');
    var files = getFiles();
    var md5Map = {};
    _.each(files, function (file) {
        var name = file;
        var relatePagesPath = null;
        var relateStaticPath = null;

        relatePagesPath = absolute(path.join(config.path.client, 'view', 'pages'), file);
        relateStaticPath = absolute(path.join(config.path.client, 'static'), file)
        name = relatePagesPath || relateStaticPath || file;
        md5Map[name] = md5(readFile(file));
    });

    fs.writeFileSync(dist, esformatter.format('export default ' + JSON.stringify(md5Map)), 'utf8');
    cb();
});


function absolute(dirname, path) {
    var pattern = new RegExp(dirname, 'g');
    pattern.exec(path);
    var lastIndex = pattern.lastIndex;

    var result = null;

    if (lastIndex) {
        result = path.substr(lastIndex);
    }
    return result;
}



