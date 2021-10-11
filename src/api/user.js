import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/treatise/courseuser/dissertation/font/login/email',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/treatise/courseuser/dissertation/font/user/info',
        method: 'get',
        params: {
            token
        }
    })
}

// 发送验证码
export function sendEmailCode(params) {
    return request({
        url: '/treatise/courseuser/dissertation/sys/vcode/email',
        method: 'get',
        params
    })
}

export function getProgress(params) {
    return request({
        url: '/treatise/courseuser/dissertation/font/reviewer/userlist',
        method: 'get',
        params
    })
}

