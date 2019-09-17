import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form,Input,Icon,Button,message} from 'antd'

import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item

class Login extends Component{

    /**
     * 登录
     */
    login = (event) => {
        event.preventDefault()     //阻止表单的默认事件

        this.props.form.validateFields(async(errors,values) => {
            if(!errors){
                const {username,password} = values
                const result = await reqLogin(username,password)
                if(result.status === 0){
                    message.success('登录成功')
                    const user = result.data
                    storageUtils.savaUser(user)
                    memoryUtils.user = user
                    this.props.history.replace('/')
                }else{
                    message.error(result.msg)
                }
            }else{
                console.log('检验失败')
            }
        })
    }


    /**
     * 自定义表单验证
     */
    validator = (rule,value,callback) => {
        // console.log(rule.value)
        const length = value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        if(!value){
            callback('密码必须输入')
        }else if(length<4){
            callback('密码长度必须大于4位')
        }else if(length>12){
            callback('密码长度必须小于12位')
        }else if(!pwdReg.test(value)){
            callback('密码必须由字母，数字，下划线组成')
        }else{
            callback()
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form

        if(memoryUtils.user && memoryUtils.user._id){
            return <Redirect to='/' />
        }

        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React 项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h3>用户登录</h3>
                    <Form onSubmit={this.login} className="login-form">
                        <Item>
                            {getFieldDecorator('username',{
                                rules:[
                                    {
                                        required:true,
                                        message:'用户名必须输入'
                                    },{
                                        max:12,
                                        message:'用户名长度不能超过12位'
                                    },
                                    {
                                        min:4,
                                        message:'用户名长度不能小于4位'
                                    },
                                    {
                                        pattern:/^[a-zA-Z0-9_]+$/,
                                        message:'用户名必须是由字母，数字，下划线组成'
                                    }
                                ]
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />
                              )
                            }
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                        {validator:this.validator}
                                    ]
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    />
                                )
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Form.create()(Login)