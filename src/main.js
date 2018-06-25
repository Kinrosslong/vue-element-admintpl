import Vue from 'vue';
import App from './App';
import router from './router';
// import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import "./assets/icon/iconfont.css"; //使用自己的icon图标
// import {Message} from 'element-ui'

Vue.use(ElementUI, { size: 'small' });
// Vue.prototype.$axios = axios; //axios不支持vue.use()方式声明使用 在其他vue组件中就可以this.$axios调用使用

//封装axios请求方式
import {get} from './http/index';
import {post} from './http/index';
Vue.prototype.get = get;
Vue.prototype.post = post;



//封装axios异常
// 超时设定
// axios.defaults.timeout = 10000;
// axios.interceptors.request.use(config => {
//     return config;
// }, err => {
//     this.$message.error(`请求超时!`);
//     return Promise.resolve(err);
// })

// // http response 拦截器
// axios.interceptors.response.use(response => {
//     // console.log(response)
//     if (response.status && response.status == 200) {
//         const data = response.data;
//         return data;
//     }
//     return;
// }, (error) => { // 这里是返回状态码不为200时候的错误处理
   
//     console.log(error.response); //响应错误数据
//     if (error.response) {
       
//         const data = error.response.data;
//         // 根据返回的code值来做不同的处理(和后端约定)
//         switch (error.response.status) {
//             case 401:
//                 // 认证异常 未登录
//                 router.push('/login');
//                 break;
//             case 403:
//                 // 403 没有权限 用户认证通过但是没有权限执行该操作
//                 if (data.message !== null) {
//                     Message.error(data.message);
//                 } else {
//                     Message.errot('没有权限');
//                 }
//                 break;
//             case 422:
//                 if(data.message !== null) {
//                     Message.error(data.message);
//                 } else {
//                     Message.error('验证规则错误');
//                 }
//             break;
//             case 500:
//                 // 错误
//                 if (data.message !== null) {
//                     Message.error(data.message);
//                 }
//                 break;
//             default:
//                 this.$message.error('未知系统错误~');
//                 return data;
//         }
//     } 
//     Message.error(error.response.data.message);
//     return Promise.resolve(error);
// });


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if(!role && to.path !== '/login'){
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');