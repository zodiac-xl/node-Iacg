//
import koaRouter        from 'koa-router';

//
import jsonResp          from 'koa-json-response';



export default function (app, config) {

    let alive = koaRouter();

    alive
        .get('/api/monitor/alive', function *(next) {
            this.jsonResp(200,
                "http健康检查成功！"
            );

        });

    //json response
    app.use(jsonResp());

    app.use(alive.routes())
        .use(alive.allowedMethods());
};



