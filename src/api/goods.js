import request from '@/utils/request';

export function addGoods(data) {
  return request({
    url: '/product/add',
    method: 'post',
    data
  })
}
export function editGoods(data) {
  return request({
    url: '/product/edit',
    method: 'post',
    data
  })
}
export function delGoods(data) {
  return request({
    url: '/product/delete',
    method: 'post',
    data
  })
}
export function getGoodsList(data) {
  return request({
    url: '/product/GetList',
    method: 'post',
    data
  })
}
export function getJoinList(data) {
  return request({
    url: '/product/GetJoinList',
    method: 'post',
    data
  })
}
export function JoinProduct(data) {
  return request({
    url: '/product/Join',
    method: 'post',
    data
  })
}
export function getOrderList(data) {
  return request({
    url: '/order/GetList',
    method: 'post',
    data
  })
}
export function ImportData(data) {
  return request({
    url: '/Import/ImportData',
    method: 'post',
    data
  })
}
export function exportData(data) {
  return request({
    url: '/order/Export',
    method: 'post',
    data
  })
}
export function OrderRepeatList(data) {
  return request({
    url: '/order/OrderRepeatList',
    method: 'post',
    data
  })
}
export function ConfirmOrderRepeat(data) {
  return request({
    url: '/order/ConfirmOrderRepeat',
    method: 'post',
    data
  })
}
