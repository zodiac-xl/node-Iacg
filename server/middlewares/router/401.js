//
import koaRouter        from 'koa-router';




export default function (app, config) {

    const ADMIN_CONTACT = 'wxlgame0105@163.com。';

    let route = koaRouter();

    route
        .get('/401', function *(next) {
            this.body = `<div style="text-align: center;padding: 50px">非常抱歉，您没有权限访问本页面。如需开通权限，请联系${ADMIN_CONTACT}</div>`;
        });


    app.use(route.routes())
        .use(route.allowedMethods());
};



