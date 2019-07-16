import request from '@/utils/request'

export function getClass() {
  return request({
    url: '/getClass',
    method: 'post'
  })
}

export function updataClassByid(data) {
  return request({
    url: '/updataClassByid',
    method: 'post',
    data
  })
}
export function updataClassShowByid(data) {
  return request({
    url: '/updataClassShowByid',
    method: 'post',
    data
  })
}
export function updataIsTagByid(data) {
  return request({
    url: '/updataIsTagByid',
    method: 'post',
    data
  })
}
export function updataClassIsNavByid(data) {
  return request({
    url: '/updataClassIsNavByid',
    method: 'post',
    data
  })
}
export function deleteClassByid(data) {
  return request({
    url: '/deleteClassByid',
    method: 'post',
    data
  })
}
export function addClass(data) {
  return request({
    url: '/addClass',
    method: 'post',
    data
  })
}
