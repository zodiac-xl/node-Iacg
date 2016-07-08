import React, { Component }         from 'react';
import  './less/page-header.less';


export default class Header extends Component {

    state = {};

    render() {
        let _this = this;


        return (
            <div className='header screen'>
                <div className='head'>
                    <img src='/images/xr.png' style={{height:'0.4rem',marginLeft:'0.1rem'}}/>

                    <div className='loginAout'>
                        <span>登录</span>
                        <span>注册</span>
                    </div>
                </div>
                <ul className="nav">
                    <li><a href="/">i站主页</a></li>
                    <li><a href="/">动漫情报局</a></li>
                    <li><a href="/">声优</a></li>
                    <li><a href="/">欢乐周边</a></li>
                    <li><a href="/">宅科技</a></li>
                    <li><a href="/">次元百科</a></li>
                    <li><a href="/IACG/index.html">最初的iacg</a></li>
                    <li><a href="/mydreamer/index.html">最初的开始</a></li>
                </ul>
            </div>
        )
    }
}

