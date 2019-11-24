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
