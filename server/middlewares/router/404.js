//
import koaRouter        from 'koa-router';




export default function (app, config) {

    let route = koaRouter();

    route
        .get('/404', function *(next) {
            this.body = `<div style="text-align: center;padding: 50px">非常抱歉，您访问的页面不存在</div>`;
        });


    app.use(route.routes())
        .use(route.allowedMethods());
};



