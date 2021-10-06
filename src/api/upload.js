import request from '@/utils/request'

export function autograph() {
    return request({
      url: '/video_signnature/coursemanager/font/TcloudManager/getSignature',
      method: 'get'
    })
  }