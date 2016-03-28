//
import URL              from 'url';

import proxy            from 'koa-proxy-url';
import httpQueryParse   from 'http-query-parse';

export default function (app, config) {

    app.use(proxy({
        match: /\/proxy/,
        url: function (http) {
            let source = httpQueryParse(http.request).source;
            if (source != undefined) {
                return source
            } else {
                return null;
            }
        },
        customHost: function (http) {
            let source = httpQueryParse(http.request).source;
            let url = URL.parse(source);
            return url.protocol+'//'+url.host;
        }
    }));

};
