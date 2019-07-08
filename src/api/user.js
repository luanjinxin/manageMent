import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/getPre',
    method: 'post'
  })
}

export function logout() {}
export function getUser(data) {
  return request({
    url: '/getUser',
    method: 'post',
    data
  })
}
export function updataUserHideReplyByid(data) {
  return request({
    url: '/updataUserHideReplyByid',
    method: 'post',
    data
  })
}
export function updataUserIsBlackListByid(data) {
  return request({
    url: '/updataUserIsBlackListByid',
    method: 'post',
    data
  })
}
export function updataRoleIdByid(data) {
  return request({
    url: '/updataRoleIdByid',
    method: 'post',
    data
  })
}
export function updataLoginPwdByid(data) {
  return request({
    url: '/updataLoginPwdByid',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/addUser',
    method: 'post',
    data
  })
}
export function deleteUseryid(data) {
  return request({
    url: '/deleteUseryid',
    method: 'post',
    data
  })
}
