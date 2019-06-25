import request from '@/utils/request'

export function getRole(data) {
  return request({
    url: '/getRoles',
    method: 'post',
    data
  })
}
export function getPowerByRoleName(data) {
  return request({
    url: '/getPowerByRoleName',
    method: 'post',
    data
  })
}
export function updataRoleNameByid(data) {
  return request({
    url: '/updataRoleNameByid',
    method: 'post',
    data
  })
}
export function addRole(data) {
  return request({
    url: '/addRole',
    method: 'post',
    data
  })
}
export function deleteRoleByid(data) {
  return request({
    url: '/deleteRoleByid',
    method: 'post',
    data
  })
}
export function getRolesByid(data) {
  return request({
    url: '/getRolesByid',
    method: 'post',
    data
  })
}
export function updataRolesByid(data) {
  return request({
    url: '/updataRolesByid',
    method: 'post',
    data
  })
}
