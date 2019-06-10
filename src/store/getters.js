const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  router: state => state.user.router,
  fullRouters: state => state.router.fullRouters,
  dynamicRouters: state => state.router.dynamicRouters,
  buttons: state => state.user.buttons
}
export default getters
