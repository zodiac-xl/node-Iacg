//for count
import responseTime         from 'koa-response-time';
import logger               from 'koa-logger';




//performance
import compress      from 'koa-compress';

//
import body         from 'koa-body';
import jsonResp     from 'koa-json-response';


import serve        from 'koa-static-regexp';
import favicon      from 'koa-favicon';

import onerror      from 'koa-onerror';

export default function (app, config) {


    if (!config.debug) {
        //response-time
        app.use(responseTime());

        //logger
        app.use(logger());

    }




    //Compress all things
    app.use(compress({
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    }));


    //body parser
    app.use(body());

    //json response
    app.use(jsonResp());


    //serve static files
    config.path.static.forEach(function (item) {
        app.use(serve(item.path, item.options));
    });

    // favicon
    app.use(favicon(config.path.favicon));


    //on-error
    //onerror(app, config.onerror);


};
