import React, {Component}  from 'react'
import {Card, Icon, List} from 'antd'
import LinkButton from '../../components/link-button/link-button'

import {reqCategory} from '../../api'

const Item = List.Item

export default class ProductDetail extends Component{

    state = {
        cName1: '',     //一级分类名称
        cName2:'',      //二级分类名称
    }

    async componentDidMount () {
        //得到当前商品的分类id
        const {pCategoryId, categoryId} = this.props.location.state

        //因为父id没设置好，有错不可显示，故注释掉

        // if(categoryId === '0'){     //一级分类下的商品，只需要查询一个名字
        //     const result = await reqCategory(categoryId)
        //     if(result.status === 0){
        //         const cName1 = result.data.name
        //         console.log(cName1)
        //         this.setState({
        //             cName1
        //         })
        //     }
        // }else{      //二级分类下的商品，需要查询两个名字
        //         // 通过多个await方式发多个请求，后面一个请求是在前一个请求成功返回之后才发送的
        //     const result1 = await reqCategory(categoryId)
        //     const result2 = await reqCategory(pCategoryId)
        //     console.log(result2,result1)
        //     if(result1.status === 0 && result2.status === 0){
        //         const cName1 = result1.data.name
        //         const cName2 = result2.data.name
        //         console.log(cName2,cName1)
        //         this.setState({
        //             cName1,
        //             cName2
        //         })
        //     }

            //一次性发送多个请求，只有都成功了，才正常处理
            // const results = await Promise.all([reqCategory(categoryId), reqCategory(pCategoryId)])
            // const cName1 = results[0].data.name
            // const cName2 = results[1].data.name
            // this.setState({
            //     cName1,
            //     cName2
            // })
        // }


        
    }

    render(){

        //读取携带过来的state数据
        const product = this.props.location.state
        const {cName2,cName1} = this.state

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style = {{marginRight:10,fontSize:20}}
                        onClick = {() => this.props.history.goBack()}    
                    /> 
                    <span>商品详情</span>
                </LinkButton>
            </span>
        )

        return(
            <Card title = {title}  className='product-details'>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{product.price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1} {cName2?'--->'+cName2:''}</span>
                    </Item>
                    {/* <Item>
                        <span className='left'>商品图片</span>
                        <span>
                            {
                                product.imgs.map(img => {
                                    <img key={img} className='product-img' src={img} 
                                        alt='image'  />
                                })
                            }
                        </span>
                    </Item> */}
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML = {{__html:product.detail}}></span>
                    </Item>
                </List> 
            </Card>
        )
    }
}