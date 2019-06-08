import request from '@/utils/request'

export function getPower(data) {
  return request({
    url: '/getPower',
    method: 'post',
    data
  })
}
export function getPowerByPid(data) {
  return request({
    url: '/getPowerByPid',
    method: 'post',
    data
  })
}
