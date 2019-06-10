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
export function getPowerByid(data) {
  return request({
    url: '/getPowerByid',
    method: 'post',
    data
  })
}
export function updataPowerByid(data) {
  return request({
    url: '/updataPowerByid',
    method: 'post',
    data
  })
}
export function addPower(data) {
  return request({
    url: '/addPower',
    method: 'post',
    data
  })
}
export function deletePowerByid(data) {
  return request({
    url: '/deletePowerByid',
    method: 'post',
    data
  })
}
