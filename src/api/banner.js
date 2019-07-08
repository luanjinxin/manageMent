import request from '@/utils/request'

export function getBanner() {
  return request({
    url: '/getBanner',
    method: 'post'
  })
}
export function updataBannerByid(data) {
  return request({
    url: '/updataBannerByid',
    method: 'post',
    data
  })
}

export function deleteBannerByid(data) {
  return request({
    url: '/deleteBannerByid',
    method: 'post',
    data
  })
}

export function addBanner(data) {
  return request({
    url: '/addBanner',
    method: 'post',
    data
  })
}
