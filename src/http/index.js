
/*
* 封装axios异常
*/
import Vue from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router/index'; //该路由不能使用


// 超时设定
axios.defaults.timeout = 10000;
axios.interceptors.request.use(config => {
  return config;
}, err => {
  Message.error(`请求超时!`);
  return Promise.resolve(err);
})


// http response 拦截器
axios.interceptors.response.use(response => {
  // console.log(response)
  // console.log(response.data.message);
  if (response.status && response.status == 200) {
    const data = response.data;
    return data;
  }
  Message.error(response.message);
  return;
}, (error) => { // 这里是返回状态码不为200时候的错误处理

  // console.log(error.response); //响应错误数据
  if (error.response) {
    const data = error.response.data;
    // 根据返回的code值来做不同的处理(和后端约定)
    switch (error.response.status) {
      case 401:
        // 认证异常 未登录
        router.push('/login');
        break;
      case 403:
        // 403 没有权限 用户认证通过但是没有权限执行该操作
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.errot('没有权限');
        }
        break;
      case 404:
        if(data.message !== null) {
          router.push('/404');
          Message.error('找不到该页面!');
        } else {
          Message.error('找不到该页面!');
        }
        break;
      case 422:
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.error('验证规则错误');
        }
        break;
      case 500:
        // 错误
        if (data.message !== null) {
          Message.error(data.message);
        }
        break;
      default:
        Message.error('未知系统错误~');
        return data;
    }
  }
  // Message.error(error.response.data.message);
  return Promise.resolve(error);
});


let base = '/api';

export const get = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params
  });
};

export const post = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const uploadFile = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const put = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
};

