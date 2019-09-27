import React, {Component} from 'react'
import {Card, Button, Table, message, Modal} from 'antd'

import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'

export default class Role extends Component{

    state = {
        roles:[],     //所有角色的列表
        role:{},      //选中的role
        isShowAdd:false,     //是否显示添加界面
        isShowAuth:false,    //是否显示设置权限界面
    }

    constructor(props){
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time) => formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
            }
        ]
    }

    getRoles = async() => {
        const result = await reqRoles()
        if(result.status === 0){
            const roles = result.data
            this.setState({
                roles
            })
        }else{

        }
    }

    onRow = (role) => {
        return{
            onClick:event => {   //点击行
                this.setState({
                    role
                })
            }
        }
    }

    //添加角色
    addRole = () => {
        //进行表单验证，只有通过才继续
        this.form.validateFields(async(error,value) => {
            if(!error){

                this.setState({
                    isShowAdd:false
                })

                //收集输入数据
                const {roleName} = value
                this.form.resetFields()

                const result = await reqAddRole(roleName)
                if(result.status === 0){
                    message.success('添加角色成功')
                    //新产生的角色
                    const role = result.data
                    //更新roles状态

                    // const roles = this.state.roles
                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({
                    //     roles
                    // })

                    //更新roles状态，基于原本状态数据更新
                    this.setState(state => ({
                        roles:[...state.roles,role]
                    }))
                }else{
                    message.error('添加角色失败')
                }
            }
        })
    }

    //更新角色
    updateRole = async() => {

        //隐藏确认框
        this.setState({
            isShowAuth:false
        })

        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()

        const result = await reqUpdateRole(role)
        if(result.status === 0){
            // this.getRoles()
            //如果当前更新的是自己角色的权限则强制退出
            if(role._id === memoryUtils.user.role_id){
                message.error('当前角色权限已更新请重新登录')
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }else{
                message.success('设置角色权限成功')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
            
        }
    } 

    componentWillMount(){
        this.initColumn()
    }

    componentDidMount(){
        this.getRoles()
    }

    render(){

        const {roles, role, isShowAdd, isShowAuth} = this.state

        const title = (
            <span>
                <Button type='primary' style={{marginRight:10}}
                    onClick={() => this.setState({isShowAdd:true})}>创建角色</Button>
                <Button type='primary' disabled={!role._id}
                    onClick={() => this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )

        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles} 
                    columns={this.columns} 
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{type:'radio',selectedRowKeys:[role._id]}}
                    onRow={this.onRow}
                />

                <Modal
                    title='添加角色'
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {this.setState({isShowAdd:false})
                    this.form.resetFields()
                }}
                >
                    <AddForm setForm={(form) => this.form = form} />
                </Modal>

                <Modal
                    title='设置角色权限'
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {this.setState({isShowAuth:false})
                }}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}