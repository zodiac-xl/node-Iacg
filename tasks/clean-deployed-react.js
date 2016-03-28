import gulp         from 'gulp'

import path         from 'path'
import del          from 'del'
import config       from 'config'
import fu           from 'fileutil';
import _            from 'lodash'



gulp.task('clean-deployed-react', function(cb){

    const files = fu.list(config.path.view, {
        excludeDirectory: true, //不包含文件夹
        matchFunction: function(item){
            return item.name.match(/react/);
        }
    });

    _.each(files,function(file){
        del(file,function(){
        });
    });
    cb();

});