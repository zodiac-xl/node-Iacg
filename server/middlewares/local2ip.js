import getIpAddresses   from 'get-ip-addresses';
console.log(getIpAddresses());


export default function (app, config) {

    return function *(next) {


        if (config.debug) {
            let host = this.host;
            let href = this.href;
            let ips = getIpAddresses();
            let localIp = null;
            ips.some(function (ip) {
                if (/192/.test(ip)) {//有线ip
                    localIp = ip;
                    return true;
                }
            })

            if (/localhost/.test(host) && localIp) {
                this.redirect(href.replace('localhost', localIp));
                return;
            }

        }
        yield next;
    }
}