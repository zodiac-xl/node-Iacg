import onerror from 'koa-onerror';


export default function (app) {

    app.on('error', (err, ctx = this) => {
        err.state = ctx.state;
        console.error('app on error:', err, err.stack.split('\n'), ctx.status, ctx.url);
    });

    onerror(app, {
        all: function (err) {
            this.body = '<div style="margin: 20px;text-align: center">服务器出现问题了，已经通知相关工作人员，如比较紧急请联系@吴小龙</div>';
            return;
        }
    });
}
