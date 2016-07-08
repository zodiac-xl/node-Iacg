import fs               from 'fs';
import path             from 'path';
import pathExists       from 'path-exists';
import config           from 'config';
import md5Map           from '../md5Map';

let readFile = function (src) {
    return fs.readFileSync(src, {'encoding': 'utf8'})
};

function render(viewPagePath, pageName, locals = {}) {

    let data = config;
    data.imgPath = config.path.imgPath;
    data.pageName = pageName;
    data.pageId = locals.$id || pageName;
    data.title = locals.$title || config.name;
    data.keywords = locals.$keywords || config.keywords;
    data.description = locals.$description || config.description;

    let ftlFilePath = path.join(viewPagePath, "/index.ftl");
    let htmlFilePath = path.join(viewPagePath, "/index.html");

    let cssPath;
    let jsPath;
    let reactJsPath;
    let reactCssPath;


    cssPath = path.join(pageName, "index.css");
    jsPath = path.join(pageName, "index.js");
    reactJsPath = path.join(pageName, "index_react.js");
    reactCssPath = path.join(pageName, "index_react.css");

    data.stylesheets = [];
    //检查是否有页面入口css index.css index_react.css
    if (pathExists.sync(path.join(config.path.viewPages, cssPath))) {
        data.stylesheets.push(cssPath);
    }
    if (pathExists.sync(path.join(config.path.viewPages, reactCssPath))) {
        data.stylesheets.push(reactCssPath);
    }

    data.javascipts = [];
    //检查是否有页面入口js和jsx index.js or index_react.js

    if (pathExists.sync(path.join(config.path.viewPages, jsPath))) {
        jsPath = (!config.debug && md5Map[reactJsPath]) ? (jsPath + '?' + md5Map[jsPath]) : jsPath;
        data.javascipts.push(jsPath);
    }

    data.requirejavascipts = [];
    if (config.cmd2amd) {
        let entryJs = path.join('/amd/client/pages/', pageName, 'index.js');
        let entryJsPath = path.join(config.path.client, 'static', entryJs);
        if (pathExists.sync(entryJsPath)) {
            data.requirejavascipts.push(entryJs);
        }
    } else {
        if (pathExists.sync(path.join(config.path.viewPages, reactJsPath))) {
            reactJsPath = (!config.debug && md5Map[reactJsPath]) ? (reactJsPath + '?' + md5Map[reactJsPath]) : reactJsPath;
            data.javascipts.push(reactJsPath);
        }
    }


    //判断页面类型
    let pageType;
    if (pathExists.sync(ftlFilePath)) {
        pageType = "ftl";
    } else if (pathExists.sync(htmlFilePath)) {
        pageType = "html";
    } else {
        pageType = "react";
    }

    //根据页面类型选用不同模板layout.html or transition-layout.html
    switch (pageType) {
        case "ftl":
            data.body = this.fm.renderSync(path.join("/", path.relative(config.path.view, ftlFilePath)), data);
            break;
        case "html":
            data.body = readFile(htmlFilePath);
            break;
        case "react":
            data.body = "";

            //可选 使用react server后端渲染body
            //data.body = ReactDOMServer.renderToString(
            //    <Page {...locals} />
            //);
            break;
    }

    if (pageType == "react") {
        this.body = this.tpl(data);
    } else {
        this.body = this.transitionTpl(data);
    }

}


export default function (app, config) {

    return function *(next) {
        this.type = 'text/html';
        this.set('Cache-Control', 'no-cache');
        this.set('Connection', 'keep-alive');
        this.render = render;
        yield next;
    };

};
