// 在http.js中引入axios
import axios from 'axios'; // 引入axios
// vant的toast提示框组件，大家可根据自己的ui组件更改。
import {
    Message,
    MessageBox
} from 'element-ui'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_DEV_REQUEST_DOMAIN_PREFIX + process.env.VUE_APP_BASE_API;
}

//超时限制
axios.defaults.timeout = 30000;

//请求头文本类型
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断vuex中是否存在token
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        const token = "";
        token && (config.headers.Authorization = token);
        return config;
    },
    error => {
        return Promise.error(error);
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 404请求不存在
                case 404:
                    Message.error('网络请求不存在');
                    break;
                    // 其他错误，直接抛出错误提示
                default:
                    Message.error(res.data.msg);
            }
            return Promise.reject(error.response);
        }
    }
);

export function http(httpDefaultOpts, config) {
    if (httpDefaultOpts.data == undefined) {
        httpDefaultOpts.data = {};
    }
    return new Promise((resolve, reject) => {
        axios(httpDefaultOpts)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}