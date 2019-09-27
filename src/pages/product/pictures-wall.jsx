import React from 'react'
import {Upload, Icon, Modal, message} from 'antd'
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants'

//用于图片上传的组件
export default class PicturesWall extends React.Component{

    static propTypes = {
        imgs:PropTypes.array
    }

    state = {
        previewVisible:false,      //标识是否显示大图预览
        previewImage:'',           //大图的url
        fileList:[
            // {
            //     uid:'-1',      //文件的唯一标识
            //     name:'xxx.png',      //图片文件名
            //     status:'done',     //图片的状态:done-已上传，uploading-正在上传，removed-已删除
            //     url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'        //图片地址
            // },
        ],
    }

    constructor(props) {
        super(props)

        let fileList = []

        //如果传入了imgs属性
        const {imgs} = this.props
        if(imgs && imgs.length>0){
            fileList = imgs.map((img,index) => ({
                uid:-index,
                name:img,
                status:'done',
                url:BASE_IMG_URL + img
            }))
        }

        //初始化状态
        this.state = {
            previewVisible:false,     
            previewImage:'',
            fileList
        }
    }

    //获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    
    //隐藏Modal
    handleCanel = () => {
        this.setState({previewVisible:false})
    }

    handlePreview = (file) => {
        //显示指定file对应的大图
        this.setState({
            previewImage:file.url || file.thumbUrl,
            previewVisible:true
        })
    }

    /**
     * file:当前操作的图片文件(上传/删除)
     * fileList:所有已经上传图片文件对象的数组
     */
    handleChange = async({file,fileList}) => {
        // console.log('handleChange',file.status,file)

        //一旦上传成功，将当前上传的file的信息修正(name,url)
        if(file.status === 'done'){
            const result = file.response    
            if(result.status === 0){
                message.success('上传图片成功')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            }else{
                message.error('上传图片失败')
            }
        }else if(file.status === 'removed'){   //删除图片
            const result = await reqDeleteImg(file.name)
            if(result.status === 0){
                message.success('删除图片成功')
            }else{
                message.error('删除图片失败')
            }
        }

        //在操作过程中更新fileList状态
        this.setState({fileList})
    }

    render(){
        const {previewVisible, previewImage,fileList} = this.state

        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
        );

        return(
            <div>
                <Upload
                    action="/manage/img/upload"    //上传图片的接口地址
                    accept="image/*"    //只接受图片格式的文件
                    listType="picture-card"       //图片显示的样式(卡片样式)
                    name="image"            //发送到后台的文件参数名(ajax的请求链接的参数)
                    fileList={fileList}     //指定所有已上传图片文件对象的数组
                    onPreview={this.handlePreview}       //
                    onChange={this.handleChange}         //
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCanel}>
                    <img alt='example' style={{width:'100%'}} src={previewImage} />
                </Modal>
            </div>
        )
    }
}
