import request from '@/utils/request'
export function getGroupInfo(data) {
  return request({
    url: '/getGroupInfo',
    method: 'post',
    data
  })
}
