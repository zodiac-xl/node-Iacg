export default function(app){
    return function *(next) {
        yield next;

        // if server return status code >= 400
        // that means server occur an error .
        //
        // 当服务器端检测到请求响应码 大于等于 400时
        // 为了提高用户体验，服务端将用户重定向到首页

        if(this.status >= 400){
            this.redirect('/');
        }
    };
}
