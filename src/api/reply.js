import request from '@/utils/request'

export function getReply(data) {
  return request({
    url: '/getReply',
    method: 'post',
    data
  })
}
export function addReply(data) {
  return request({
    url: '/addReply',
    method: 'post',
    data
  })
}
export function setIsShowReply(data) {
  return request({
    url: '/setIsShowReply',
    method: 'post',
    data
  })
}
