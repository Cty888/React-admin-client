import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

//登录
export const reqLogin = (username,password) => ajax('/login', {username,password}, 'POST')

//请求百度地图天气预报
export function reqWeather(city) {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err,data) => {
            console.log(err,data)
            if(!err && data.status === 'success'){
                const {dayPictureUrl, weather} = data.results[0].weather_data[0] 
                resolve({dayPictureUrl, weather})
            }else{
                message.error('获取天气信息失败')
            }
        })
    })
    
}
reqWeather('北京')

//获取一级或某个二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})

//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add',{parentId, categoryName},'POST')

//更新品类名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update',{categoryId, categoryName},'POST')

