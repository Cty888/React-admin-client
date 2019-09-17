import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import './index.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dateUtils'
import menuConfig from '../../config/menuConfig'
import LinkButton from '../link-button/link-button'


class Header extends Component{

    state = {
        weather:'',
        dayPictureUrl:'',
        timeNow:formateDate(Date.now())
    }

    //获取当前天气
    getWeahter = async() => {
        const {dayPictureUrl, weather} = await reqWeather('南京')
        this.setState({
            dayPictureUrl,
            weather
        })
    }

    //获取当前时间
    getTime = () => {
        this.intervalId = setInterval(() => {
            this.setState({timeNow:formateDate(Date.now())})
        },1000)
    }

    //获取当前路径
    getTitle = (path) => {
        let title
        menuConfig.forEach(menu => {
            if(menu.key === path){
                title = menu.title
            }else if(menu.children){
                menu.children.forEach(item => {
                    if(item.key === path){
                        title = item.title
                    }
                })
            }
        })
        return title
    }

    //退出
    logout = () => {
        Modal.confirm({
            content:'是否确定退出登录',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
            onCancel(){
                console.log('Canel')
            }
        })
    }

    componentDidMount(){
        this.getWeahter()
        this.getTime()
    }

    componentWillUnmount(){
        clearInterval(this.intervalId)
    }

    render(){

        const {username} = memoryUtils.user
        const {dayPictureUrl, weather, timeNow} = this.state

        const path = this.props.location.pathname
        const title = this.getTitle(path)

        return(
            <div className="header">
                <div className="header-top">
                    <span>hello,{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        <span>{title}</span>
                    </div>
                    <div className="header-bottom-right">
                        <span className="time-now">{timeNow}</span>
                        <img src={dayPictureUrl} />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)