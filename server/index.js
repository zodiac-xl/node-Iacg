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
    .myUse('router/401')
    .myUse('router/404')
    .myUse('router/mock')
    .myUse('main')
    .myUse('redirect')
    .myUse('template')//后端模板
    .myUse('render')//后端渲染方法
    .myUse('router/autoPages')//页面路由
    .myUse('not_found');


export
default app;
