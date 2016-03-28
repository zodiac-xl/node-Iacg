import fs               from 'fs';
import URL              from 'url';
import path             from 'path';
import pathExists       from 'path-exists';



export default function (app, config) {

    return function *(next) {

        let url = URL.parse(this.request.url);
        let pageName = url.pathname.match(/[^.#?]{2,}/);

        if (pageName) {
            pageName = pageName[0];
        }else{
            pageName ='home';
        }


        if (pageName) {
            let viewPagePath = path.join(config.path.viewPages, pageName);
            let ftlPath = path.join(viewPagePath, "index.ftl");
            let jsPath = path.join(viewPagePath, "index.js");
            let reactJsPath = path.join(viewPagePath, "index_react.js");
            if (pathExists.sync(ftlPath)||pathExists.sync(jsPath) || pathExists.sync(reactJsPath)) {
                this.status = 200;
                this.render(viewPagePath, pageName);
                return;
            }
        }
        yield next;


    };

};


