import request from '@/utils/request'

export function getFriendly() {
  return request({
    url: '/getFriendly',
    method: 'post'
  })
}
export function updataFriendlyByid(data) {
  return request({
    url: '/updataFriendlyByid',
    method: 'post',
    data
  })
}

export function deleteFriendlyByid(data) {
  return request({
    url: '/deleteFriendlyByid',
    method: 'post',
    data
  })
}

export function addFriendly(data) {
  return request({
    url: '/addFriendly',
    method: 'post',
    data
  })
}
