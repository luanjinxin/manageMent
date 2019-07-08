import request from '@/utils/request'

export function addArticle(data) {
  return request({
    url: '/addArticle',
    method: 'post',
    data
  })
}
export function getArticle(data) {
  return request({
    url: '/getArticle',
    method: 'post',
    data
  })
}
export function getArticleByid(data) {
  return request({
    url: '/getArticleByid',
    method: 'post',
    data
  })
}
export function updateArticleByid(data) {
  return request({
    url: '/updateArticleByid',
    method: 'post',
    data
  })
}
export function deleteArticleByid(data) {
  return request({
    url: '/deleteArticleByid',
    method: 'post',
    data
  })
}
export function setImgRecommend(data) {
  return request({
    url: '/setImgRecommend',
    method: 'post',
    data
  })
}
export function setArticleRecommend(data) {
  return request({
    url: '/setArticleRecommend',
    method: 'post',
    data
  })
}
export function setIsShowArticle(data) {
  return request({
    url: '/setIsShowArticle',
    method: 'post',
    data
  })
}
