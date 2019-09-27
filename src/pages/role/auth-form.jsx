import React, {Component} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'

import menuConfig from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;

export default class AuthForm extends Component {

    static propTypes = {
        role:PropTypes.object
    }

    state ={
        checkedKeys:[]
    }

    constructor(props){
        super(props)
        //根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }
    }

    //为父组件提供获取最新menus数据的方法
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }

    //选中某个node时的回调
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuConfig)
    }

    //根据新传入的role来更新checkedKeys状态
    //当接收到新的属性时自动调用，在render之前
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    render(){

        const {role} = this.props
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol:{span:5},      //左侧label的宽度
            wrapperCol:{span:15}      //右侧包裹的宽度
        }

        return(
            <Form>
                <Item label='角色名称:' {...formItemLayout}>
                    <Input value={role.name} disabled></Input>    

                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
