import React        from 'react';
import ReactDOM     from 'react-dom';
import _            from 'lodash';
import Header       from '../include/header';
import Footer       from '../include/footer';

import BasePage     from './page';




export default class PageLayout extends BasePage {


    static page(Page) {
        $(function () {
            console.log('✓', 'Ready');
            let container = document.getElementById('app');
            ReactDOM.render(<Page/>, container);


            let $screens = $('.screen');

            function setContainerWidth() {
                if (document.body.clientWidth >= 1400) {
                    $screens.addClass('widescreen');
                } else {
                    $screens.removeClass('widescreen');
                }
            }

            setContainerWidth();
            window.onresize = setContainerWidth;
        });
    }

    render() {


        return (
            <div>
                <Header />

                <div className="body-main screen">
                    {this.renderMain()}
                </div>
                <Footer />
            </div>
        );
    }
}
