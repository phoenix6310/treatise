import request from '@/utils/request'

export function autograph() {
  return request({
    url: '/video_signnature/coursemanager/font/TcloudManager/getSignature',
    method: 'get'
  })
}

export function uploadInfo(data) {
  return request({
    url: '/treatise/courseuser/dissertation/font/user/upload',
    method: 'post',
    data
  })
}

export function uploadScores(data) {
  return request({
      url: '/treatise/courseuser/dissertation/font/reviewer/updateUserScore',
      method: 'post',
      data
  })
}
// 学生答辩的提前分
export function updatePreScore(data) {
  return request({
      url: '/treatise/courseuser/dissertation/font/reviewer/updatePreScore',
      method: 'post',
      data
  })
}