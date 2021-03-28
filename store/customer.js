export const state = () => ({
  isCreateToggle: false,
  isEditToggle: false,
  idEdit: '',
})

export const mutations = {
  SET_FORM_CREATE($state, payload) {
    $state.isCreateToggle = payload
  },
  SET_FORM_EDIT($state, payload) {
    $state.idEdit = payload.id_edit
    $state.isEditToggle = payload.is_form_edit
  },
}
