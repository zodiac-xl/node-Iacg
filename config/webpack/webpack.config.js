import path             from 'path';
import glob             from 'glob';
import config           from 'config';
import _                from 'lodash';
import baseConfig       from './base.config';

let __root = (dir) => path.join(path.dirname(__dirname), dir);


let entries = {};

let needWatch =false;
if(config.debug){
    needWatch = true;
}

glob.sync(config.path.reactPages + "/**/*.jsx")
    .forEach((f) => {
        let name = path.relative(config.path.reactPages, f).replace(/.jsx$/, '_react');
        //if(!/task/.test(name)){
        //    return;
        //}
        entries[name] = f;
    });

export default _.extend({}, baseConfig, {
    //entry: {
    //    'Apply': config.path.client+'/components/business/apply/apply.js',
    //},
    //output: {
    //    path: config.path.client,
    //    filename: 'Apply.js',
    //    library: 'Apply',
    //    libraryTarget: 'umd'
    //},
    entry: entries,
    output: {
        path: config.path.viewPages,
        filename: '[name].js',
        library: 'Page',
        libraryTarget: 'var'
    },
    watch:needWatch,

    externals: {
        "jquery": "jQuery",
        "react": "React",
        "react-dom": "ReactDOM"
    }
    //externals: [
    //
    //    {
    //        'react': {
    //            root: 'React',
    //            commonjs2: 'react',
    //            commonjs: 'react',
    //            amd: 'react'
    //        }
    //    },
    //    {
    //        'react-dom': {
    //            root: 'ReactDOM',
    //            commonjs2: 'react-dom',
    //            commonjs: 'react-dom',
    //            amd: 'react-dom'
    //        }
    //    }
    //]
});