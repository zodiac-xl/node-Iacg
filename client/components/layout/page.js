import React, { Component }         from 'react';

import injectTapEventPlugin         from 'react-tap-event-plugin';

injectTapEventPlugin();



export default class Page extends Component {

    constructor(props) {
        super(props);
        this.initial();
    }

    initial() {
    }

    renderHeader() {
    }


    renderMain() {
    }


    renderFooter() {
    }

    render() {
        return (
            <div>
                <h1>I'm an base page!</h1>
                {this.renderHeader()}
                {this.renderMain()}
                {this.renderFooter()}
            </div>
        );
    }
};
