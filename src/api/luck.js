import request from '@/utils/request'

export function getLuckId(data) {
  return request({
    url: '/getLuckId',
    method: 'post',
    data
  })
}
// 查询奖品产品
export function selectLuckProduct(data) {
  return request({
    url: '/selectLuckProduct',
    method: 'post',
    data
  })
}
// 删除奖品产品
export function deleteLuckProduct(data) {
  return request({
    url: '/deleteLuckProduct',
    method: 'post',
    data
  })
}
// 添加奖品产品
export function addLuckProduct(data) {
  return request({
    url: '/addLuckProduct',
    method: 'post',
    data
  })
}
// 修改奖品产品
export function updateLuckProduct(data) {
  return request({
    url: '/updateLuckProduct',
    method: 'post',
    data
  })
}
// 修改奖品产品
export function selectCustomer(data) {
  return request({
    url: '/selectCustomer',
    method: 'post',
    data
  })
}
// 修改奖品产品
export function selectLuckProductList(data) {
  return request({
    url: '/selectLuckProductList',
    method: 'post',
    data
  })
}
// 修改奖品发货状态
export function updateLuckProductList(data) {
  return request({
    url: '/updateLuckProductList',
    method: 'post',
    data
  })
}
// 修改奖品发货状态new
export function updateLuckIsSend(data) {
  return request({
    url: '/updateLuckIsSend',
    method: 'post',
    data
  })
}
// 查询中奖设置
export function getLuckSetting() {
  return request({
    url: '/getLuckSetting',
    method: 'post'
  })
}
// 修改中奖设置
export function updateLuckSetting(data) {
  return request({
    url: '/updateLuckSetting',
    method: 'post',
    data
  })
}
// 修改中奖设置
export function updateLuckProductListRemarks(data) {
  return request({
    url: '/updateLuckProductListRemarks',
    method: 'post',
    data
  })
}
// 查询红包金额
export function updateRedboxSetting(data) {
  return request({
    url: '/updateRedboxSetting',
    method: 'post',
    data
  })
}
// 设置红包金额
export function getRedboxSetting(data) {
  return request({
    url: '/getRedboxSetting',
    method: 'post',
    data
  })
}
// 获取抽奖红包key
export function getRedboxId(data) {
  return request({
    url: '/getRedboxId',
    method: 'post',
    data
  })
}
// 查询红包获奖人员
export function getRedboxList(data) {
  return request({
    url: '/getRedboxList',
    method: 'post',
    data
  })
}
