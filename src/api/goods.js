import request from "@/utils/request";

export function addGoods(data) {
  return request({
    url: "/product/add",
    method: "post",
    data
  });
}
export function editGoods(data) {
  return request({
    url: "/product/edit",
    method: "post",
    data
  });
}
export function delGoods(data) {
  return request({
    url: "/product/delete",
    method: "post",
    data
  });
}
export function getGoodsList(data) {
  return request({
    url: "/product/GetList",
    method: "post",
    data
  });
}
export function getJoinList(data) {
  return request({
    url: "/product/GetJoinList",
    method: "post",
    data
  });
}
export function JoinProduct(data) {
  return request({
    url: "/product/Join",
    method: "post",
    data
  });
}
export function getOrderList(data) {
  return request({
    url: "/order/GetList",
    method: "post",
    data
  });
}
export function OrderEdit(data) {
  return request({
    url: "/order/OrderEdit",
    method: "post",
    data
  });
}
export function ImportData(data) {
  return request({
    url: "/Import/ImportData",
    method: "post",
    data
  });
}
export function exportData(data) {
  return request({
    url: "/order/Export",
    method: "post",
    data
  });
}
export function OrderRepeatList(data) {
  return request({
    url: "/order/OrderRepeatList",
    method: "post",
    data
  });
}
export function ConfirmOrderRepeat(data) {
  return request({
    url: "/order/ConfirmOrderRepeat",
    method: "post",
    data
  });
}
export function GetImportResult(data) {
  return request({
    url: "/import/GetImportResult",
    method: "post",
    data
  });
}
export function DelImportResult(data) {
  return request({
    url: "/import/DelImportResult",
    method: "post",
    data
  });
}
export function DelOrder(data) {
  return request({
    url: "/order/DelOrder",
    method: "post",
    data
  });
}
export function UpdateAppUserStatis(data) {
  return request({
    url: "/appuser/UpdateAppUserStatis",
    method: "post",
    data
  });
}
export function GetCustomerList(data) {
  return request({
    url: "/appuser/GetList",
    method: "post",
    data
  });
}
export function UpdateOrder(data) {
  return request({
    url: "/appuser/UpdateOrder",
    method: "post",
    data
  });
}
export function AddAppUser(data) {
  return request({
    url: "/appuser/AddAppUser",
    method: "post",
    data
  });
}
export function GetPlatformStatis(data) {
  return request({
    url: "appuser/GetPlatformStatis",
    method: "post",
    data
  });
}
export function GetProductStatistics(data) {
  return request({
    url: "order/GetProductStatistics",
    method: "post",
    data
  });
}
export function UpdateOrderGood(data) {
  return request({
    url: "order/UpdateOrderGood",
    method: "post",
    data
  });
}
export function UpdateOrders(data) {
  return request({
    url: "order/UpdateOrder",
    method: "post",
    data
  });
}
