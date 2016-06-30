//工具
import fu                           from 'fileutil';
import _                            from 'lodash';
import path                         from 'path';
import jsonResp                     from 'koa-json-response';


export default function (app, config) {


    if (config.debug) {



        //json response
        app.use(jsonResp());
        const files = fu.list(path.join(config.path.server, "routers/mock"), {
            excludeDirectory: true, //不包含文件夹
            matchFunction: function (item) {
                return true;
            }
        });

        _.forIn(files, function (file) {
            let route = require(file);
            app.use(route.routes())
                .use(route.allowedMethods());
        });
    }


};


