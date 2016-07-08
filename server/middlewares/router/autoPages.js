import URL              from 'url';
import path             from 'path';
import pathExists       from 'path-exists';

let pageRouteMap = {};

export default function (app, config) {

    return function *(next) {
        let url = URL.parse(this.request.url);
        let pageName = url.pathname.match(/[^.#?]{2,}/);

        pageName = pageName && pageName[0];

        if (pageName) {
            let viewPagePath = path.join(config.path.viewPages, pageName);
            let ftlPath = path.join(viewPagePath, "index.ftl");
            let htmlPath = path.join(viewPagePath, "index.html");

            let jsPath = path.join(viewPagePath, "index.js");
            let reactJsPath = path.join(viewPagePath, "index_react.js");

            let isPageRoute = false;
            if (!config.debug && pageRouteMap[pageName] != undefined) {
                isPageRoute = pageRouteMap[pageName];
            } else {
                isPageRoute = pathExists.sync(htmlPath) || pathExists.sync(ftlPath) || pathExists.sync(jsPath) || pathExists.sync(reactJsPath) || pathExists.sync(path.join(config.path.client, "static", "amd", "client", "pages", pageName, "index.js"));
            }
            pageRouteMap[pageName] = isPageRoute;
            if (isPageRoute) {
                this.status = 200;
                this.render(viewPagePath, pageName);
                return;
            }
        }
        yield next;


    };

};


