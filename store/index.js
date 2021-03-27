export const state = () => ({
  isAuth: false,
  isSlideToggle: true,
  counter: 0,
})

export const mutations = {
  SET_IS_AUTH($state, payload) {
    $state.isAuth = payload
  },
  SET_TOGGLE($state, payload) {
    $state.isSlideToggle = payload
  },
  increment(state) {
    state.counter++
  },
}

export const actions = {
  nuxtServerInit({ commit }, context) {
    commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
  },
}
