import request from '@/utils/request'

export function getCoupon(data) {
  return request({
    url: '/getCoupon',
    method: 'post',
    data
  })
}
