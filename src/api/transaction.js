import request from '@/utils/request'
export function getGroupInfo(data) {
  return request({
    url: '/getGroupInfo',
    method: 'post',
    data
  })
}
export function getOrder(data) {
  return request({
    url: '/getOrder',
    method: 'post',
    data
  })
}
export function getUserInfoByMobile(data) {
  return request({
    url: '/getUserInfoByMobile',
    method: 'post',
    data
  })
}
