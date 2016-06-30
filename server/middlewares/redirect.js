import URL              from 'url';

export default function (app, config) {


    return function *(next) {
        let url = URL.parse(this.request.url);
        let pageName = url.pathname.match(/[^.#?]{2,}/);
        pageName = pageName && pageName[0];


        let redirect = null;

        let home = '/home';
        if (!pageName) {
            redirect = home
        }
        if (redirect) {
            this.redirect(redirect);
            return;
        }
        yield next;
    };

}
;


