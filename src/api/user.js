import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/UserLogin',
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
