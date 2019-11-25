import { login, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  router: '',
  buttons: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_Router: (state, router) => {
    state.router = router
  },
  SET_Buttons: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ Name: username.trim(), Password: password })
        .then(response => {
          const data = response
          commit('SET_TOKEN', data.Data.Token)
          commit('SET_NAME', data.Data.name)
          localStorage.setItem('name', data.Data.name)
          setToken(data.Data.Token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const data = response
          //   commit('SET_Router', data.content.menue)
          commit('SET_NAME', data.content.userName)
          // commit('SET_Buttons', data.content.buttons)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      localStorage.removeItem('name')
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
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
