import Page, {page}              from '../../components/layout/page-layout'


import  './index.less';

import  News  from './cards/news'

@page
export default
class Home extends Page {

    renderMain() {
        return (
            <div style={{textAlign:'center'}}>
                <News/>
            </div>
        )
    }
}

