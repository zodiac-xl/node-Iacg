import React, { Component } from 'react';
import  './less/page-footer.less';

export default class Footer extends React.Component {
    static propTypes = {
        className: React.PropTypes.string
    };

    static defaultProps = {
        className: ''
    };

    render() {
        return (

            <div className="footer screen">
                <dl>
                    <dt>关于</dt>
                    <dd><a href="/aboutus" className="text-humble">关于我们</a></dd>
                    <dd><a href="/team" className="text-humble">社团成员</a></dd>
                    <dd><a href="/log" className="text-humble">系统日记</a></dd>
                </dl>
                <dl>
                    <dt>声明</dt>
                    <dd><a href="/service" className="text-humble">服务条款</a></dd>
                    <dd><a href="/eporting" className="text-humble">兼容报告</a></dd>
                    <dd><a href="/copyright" className="text-humble">版权信息</a></dd>
                </dl>
                <dl>
                    <dt>联系</dt>
                    <dd><a href="/contact" className="text-humble">问题举报</a></dd>
                    <dd><a href="/contact" className="text-humble">意见反馈</a></dd>
                    <dd><a href="/contact" className="text-humble">招募人员</a></dd>
                </dl>
                <dl>
                    <dt>Iacg</dt>
                    <dd>© 2016 Iacg All Rights Reserved</dd>
                </dl>
            </div>
        )
    }
}
