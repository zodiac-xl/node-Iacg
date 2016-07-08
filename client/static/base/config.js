import path             from 'path';
let __s = (dir) => path.join(__dirname, "source", dir);
let __p = (dir) => path.join(__dirname, "../plugin", dir);
let __d = (dir) => path.join(__dirname, "dist", dir);

export default {
    source: {
        js: [
            //react jquery
            __s('react-with-addons.js'),
            __s('react-dom.js'),
            __s('jquery-2.1.4.js'),
            __s('color-console.js'),


            //plugin

            //toastr
            __p('toastr/toastr.js'),


            //require
            __s('require.js'),
            __s('require-config.js')

        ],
        css: [


            __s('reset.css'),
            __s('app.css'),

            //toastr
            __p('toastr/toastr.css'),


        ],

    },


    dist: {
        js: __d("js"),
        css: __d("css"),
        self: __d('')
    }
};
