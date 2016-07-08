export default function (app) {
    return function *(next) {
        yield next;

        // if server return status code >= 400
        // that means server occur an error .
        //
        // 当服务器端检测到请求响应码 大于等于 400时 500以上会被onerror提前捕获
        // 重定向到404
        if (this.status >= 400) {
            console.log('not found', this.url)
            this.redirect('/404');
        }
    };
}
