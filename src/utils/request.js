import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  TokenKey,
  getToken,
  removeToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: '/',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 * 10 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['Authorization'] = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4eHN5QGZvdW5kZXIuY29tIiwidXNlcklkIjoiMjhmOTYxNWIzOGJjMTFlOTg4NDM4Y2VjNGI5YjMyMWYiLCJuYW1lIjoi6LaF57qn566h55CG5ZGYIiwic3RhdHVzIjoiMCIsIm9yZ0lkIjoiMCIsImV4cCI6MTYzNDk4NDA4M30.GjEqYJ5mEuUPixNF_UFfnz5wJpnym4o56xV-CEUsMXKa1QgP_uptR4bT3UfqWTbnIuvbqmZ7CzG3kuM4mUVgFdx1TwMrxjVPUHElLDoH5Ac5DzRkd0VwxS9XXbl2iqYLSLLgfeola9-jUG4fmkBirr44JkM7wDGzCuqJWULWH6Y'

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers[TokenKey] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 1) {
      return res
    } else if (res.code === 5) {
      Message({
        message: res.message.err,
        type: 'error',
        duration: 5 * 1000
      })
      removeToken()
    } else {
      Message({
        message: res.message.err+11,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    console.log(error.status)
    return Promise.reject(error)
  }
)

export default service