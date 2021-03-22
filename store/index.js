export const state = () => ({
  isAuth: false,
  isSlideToggle: true,
})

export const mutations = {
  SET_IS_AUTH($state, payload) {
    $state.isAuth = payload
  },
  SET_TOGGLE($state, payload) {
    $state.isSlideToggle = payload
  },
}

export const actions = {
  nuxtServerInit({ commit }, context) {
    commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
  },
}
