import koa              from 'koa';
import config           from 'config';
import path             from 'path';
import URL              from 'url';

const app = koa();

app.myUse = function (middlewareName) {

    let app = this;
    let middleware = require(path.join(__dirname, "./middlewares/" + middlewareName + ".js"));
    let promise = middleware(app, config);
    promise && app.use(promise);
    return app;
};


app
    .myUse('error')//catch error
    .myUse('local2ip')
    .myUse('router/alive')
    .myUse('router/mock')
    .myUse('router/crossProxy')//访问非BD项目接口防跨域转发
    .myUse('main')
    .myUse('template')
    .myUse('render')
    .myUse('router/autoPages')
    .myUse('not_found');


export
default app;
