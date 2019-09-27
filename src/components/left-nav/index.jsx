import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import './index.less'
import menuConfig from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import SubMenu from 'antd/lib/menu/SubMenu'
import memoryUtils from '../../utils/memoryUtils'

class LeftNav extends Component{

    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /**
         * 1.如果当前用户是admin
         * 2.当前用户有此item的权限即key有没有在menus中
         * 3.如果当前item是公开的
         */
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){       //4.如果当前用户有此item的子item权限
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }
        return false
    }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {

            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if(this.hasAuth(item)){
                if(!item.children){
                    pre.push((
                        <Menu.Item key = {item.key}>
                            <Link to = {item.key}>
                                <Icon type = {item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                }else{
                    pre.push((
                        <SubMenu 
                            key = {item.key}
                            title = {
                                <span>
                                    <Icon type = {item.icon} />
                                    <span>{item.title}</span>   
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                    if(item.children.find(cItem => path.indexOf(cItem.key) === 0)){
                        this.openKey = item.key
                    }
                    
                }
            }
            return pre
        },[])
    }

    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuConfig)
    }

    render(){

        let selectKey = this.props.location.pathname
        if(selectKey.indexOf('/product') === 0){   //当前请求的是商品或其子路由界面
            selectKey = '/product'
        }

        const openKey = this.openKey

        return(
            <div className="left-nav">
                <Link to='/home' className='logo-link'>
                    <img src={logo} alt='logo' />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys = {[selectKey]}
                    defaultOpenKeys = {[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu> 
            </div>
        )
    }
}

export default withRouter(LeftNav)