import { constantRoutes } from '@/router'
import Layout from '@/layout'
export function recursionRouter(menus) {
  const dynamicRouters = []
  menus.forEach(menu => {
    const router = {
      // vue缓存组件使用，保证唯一性，并且和组件名一致。暂时乱写。。。
      name: `${menu.menueUrl}`,
      meta: {}
    }
    if (menu.menuePid === 0) {
      router.path = `/${menu.menueUrl}`
      router.component = Layout
      router.meta.title = menu.menueName
      router.meta.icon = menu.icon_view
      //  router.meta.resources = menu.resources
    } else {
      router.path = menu.menueUrl
      router.component = () => import(`@/views/${menu.menuePath}`)
      router.meta.title = menu.menueName
      router.meta.icon = menu.icon_view
      //  router.meta.resources = menu.resources
    }
    // 有子路由
    if (menu.children && menu.children.length > 0) {
      router.children = recursionRouter(menu.children)
    }
    dynamicRouters.push(router)
  })
  return dynamicRouters
}

const state = {
  fullRouters: [constantRoutes], // 完整路由链
  dynamicRouters: [] // 动态路由链
}

const mutations = {
  SET_ROUTERS: (state, dynamicRouters) => {
    state.dynamicRouters = dynamicRouters
    state.fullRouters = constantRoutes.concat(dynamicRouters)
  }
}

const actions = {
  /**
   * 生成动态路由
   * @param {Array} menus 后台返回的用户拥有的菜单权限集合
   */
  generateRouters({ commit }, menus) {
    return new Promise(resolve => {
      // 通配符路由
      const wildcardRouter = { path: '*', redirect: '/404', hidden: true }
      commit('SET_ROUTERS', recursionRouter(menus).concat(wildcardRouter))
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}