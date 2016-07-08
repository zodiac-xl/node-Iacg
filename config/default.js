import path     from 'path';

let __root = (dir) => path.join(path.dirname(__dirname), dir);


export default Object.assign(require('../package.json'), {
    name: "I站",
    path: {
        client: __root('client'),

        server: __root('server'),


        static: [
            {
                path: __root('client/view/pages'),
                options: {
                    regexp: "/(.js|.css||.jsx)$/",
                    defer: false,
                    maxAge: 2 * 60 * 60 * 1000
                }
            },
            {
                path: __root('client/static'),
                options: {
                    defer: false,
                    maxAge: 2 * 60 * 60 * 1000
                }
            },
            {
                path: __root('myweb'),
                options: {
                    defer: false,
                    maxAge: 0
                }
            }
        ],

        view: __root('client/view'),
        reactPages: __root('client/pages'),
        viewPages: __root('client/view/pages'),

        //layout
        layout: __root('client/layout.html'),
        transitionLayout: __root('client/transition-layout.html'),


        //components
        components: __root('components'),

        //static detail
        imgPath: "/images",
        favicon: __root('client/static/images/favicon.ico')

    }
});
