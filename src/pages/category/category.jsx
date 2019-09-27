import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'

import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api/index'
import LinkButton from '../../components/link-button/link-button'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{

    state = {
        loading:false,   //是否正在加载数据
        categorys: [],   //一级分类列表
        subCategorys: [],   //二级分类列表
        parentId: '0',   // 当前需要显示的分类列表的id
        parentName: '',  // 分类名称
        showStatus: 0,   //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }

    getColums = () => {
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              width:300,
              render:(category) => (
                  <span>
                      <LinkButton onClick = {() => {this.showUpdate(category)}}>修改分类</LinkButton>
                      {/**如何向事件回调函数传递参数:先定义一个匿名函数，在函数调用处理的函数并传入数据 */}
                      {this.state.parentId === '0' ? <LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null}  
                  </span>
              )
            }
        ];
    }

    /**
     * parentId:如果没有指定根据状态中的parentId请求,如果指定了根据指定的请求
     */
    getCategorys = async(parentId) => {
        parentId = parentId || this.state.parentId
        //在发请求前，显示loading
        this.setState({loading:true})
        const result = await reqCategorys(parentId)
        this.setState({loading:false})
        if(result.status === 0){
            const categorys = result.data
            if(parentId === '0'){
                this.setState({categorys})
            }else{
                this.setState({
                    subCategorys:categorys
                })
            } 
        }else{
            message.error('获取分类列表失败')
        }
    }

    showCategorys = () => {
        this.setState({
            parentId: '0' ,
            parentName: '',
            subCategorys: []
        })
    }

    /**
     * 显示指定一级分类对象的二级列表
     */
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        },() => {    //在状态更新且重新render()后执行
            this.getCategorys()
        })
    }

    /**响应点击取消，隐藏确定框 */
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        //隐藏
        this.setState({
            showStatus: 0
        })
    }

    /**显示添加的确认框 */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /**添加分类 */
    addCategory = () => {
        this.form.validateFields(async(err,values) => {
            if(!err){
                //隐藏确认框
                this.setState({
                    showStatus:0
                })
                // const {parentId,categoryName} = this.form.getFieldsValue()
                const {parentId,categoryName} = values
                //清除输入数据
                this.form.resetFields()
                const result = await reqAddCategory(parentId, categoryName)
                if(result.status === 0){
                    //添加的分类就是当前分类列表下的分类
                    if(parentId === this.state.parentId){
                        //重新获取当前分类列表
                        this.getCategorys()
                    }else if(parentId === '0'){
                        this.getCategorys('0')
                    }
                }
            }
        }) 
    }


    /**显示更新的确认框 */
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    /**更新分类 */
    updateCategory = () => {
        //进行表单验证，只有通过才处理
        this.form.validateFields(async(err,values) => {
            if(!err){
                //隐藏确认框
                this.setState({
                    showStatus:0
                })
                //准备数据
                const categoryId = this.category._id
                // const categoryName =this.form.getFieldValue('categoryName')
                const {categoryName} = values
                //清除输入数据
                this.form.resetFields()

                //发请求更新分类 
                const result = await reqUpdateCategory({categoryId, categoryName})
                if(result.status === 0){
                //重新显示列表
                    this.getCategorys()
                }
            }
        })
        
    }

    /**
     * 为第一次render()准备数据
     */
    componentWillMount(){
        this.getColums()
    }

    /**
     * 执行异步操作
     */
    componentDidMount(){
        //获取一级分类列表
        this.getCategorys()
    }


    render(){

        const {categorys,subCategorys,loading,parentId,parentName,showStatus} = this.state

        //读取指定的分类
        const category = this.category || {}

        //card的左侧
        
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>&nbsp;&nbsp;
                <Icon type='arrow-right'/>&nbsp;&nbsp;
                <span>{parentName}</span>
            </span>   
        )

        //card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type="plus" />
                添加
            </Button>
        )


        return(
            <Card title={title}  extra={<a href="#">{extra}</a>} >
                <Table 
                    dataSource={parentId === '0' ? categorys : subCategorys} 
                    columns={this.columns} 
                    pagination = {{defaultPageSize:5,showQuickJumper:true}}
                    loading = {loading}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys = {categorys} parentId = {parentId} 
                        setForm = {(form) => {this.form = form}}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName = {category.name} 
                        setForm = {(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
            
        )
    }
}