import fs               from 'fs';
import _                from 'lodash';
import Freemarker       from 'freemarker.js';



export default function (app, config) {

    let freemarker = new Freemarker({
        viewRoot: config.path.view,
        options: {
            /** for fmpp */
        }
    });

    let layout = fs.readFileSync(config.path.layout);
    let lodashTemplate = _.template(layout);


    return function *(next) {
        this.tpl = lodashTemplate;
        this.fm = freemarker;
        yield next;
    };
};
