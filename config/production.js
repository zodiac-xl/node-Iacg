import path     from 'path';

let __root = (dir) => path.join(path.dirname(__dirname), dir);


const port = 8412;
export
default {
    port: port,
    onerror: {},
    debug: true
};
