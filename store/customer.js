export const state = () => ({
  isCreateToggle: false,
})

export const mutations = {
  SET_FORM_CREATE($state, payload) {
    $state.isCreateToggle = payload
  },
}
