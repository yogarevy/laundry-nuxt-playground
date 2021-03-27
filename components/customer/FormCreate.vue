<template>
  <div>
    <transition name="slide-fade">
      <div v-if="isCreateToggle" id="form-create">
        <a href="javascript:void(0)" class="form-close" @click="formClose()">
          <font-awesome-icon id="close_form" icon="times" />
        </a>
        <h2>Tambah Customer</h2>
        <hr />
        <ValidationObserver ref="formCustomer">
          <b-form>
            <b-alert v-model="showAlert" variant="danger" dismissible>
              {{ errorMessage }}
            </b-alert>
            <ValidationProvider
              v-slot="errors"
              vid="customer_name"
              name="customer_name"
            >
              <b-form-group
                id="customer_name_group"
                label="Name"
                label-for="customer_name"
              >
                <b-form-input
                  id="customer_name"
                  v-model="customer.customer_name"
                  type="text"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Name"
                ></b-form-input>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider
              v-slot="errors"
              vid="customer_email"
              name="customer_email"
            >
              <b-form-group
                id="customer_email_group"
                label="Email"
                label-for="customer_email"
              >
                <b-form-input
                  id="customer_email"
                  v-model="customer.email"
                  type="email"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="eg: example@example.com"
                ></b-form-input>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider
              v-slot="errors"
              vid="phone_number"
              name="phone_number"
            >
              <b-form-group
                id="phone_number_group"
                label="Phone Number"
                label-for="phone_number"
              >
                <b-form-input
                  id="phone_number"
                  v-model.number="customer.phone_number"
                  type="number"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="eg: 085123456789"
                  @keydown="filterKey"
                  @input="filterInput"
                ></b-form-input>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider
              v-slot="errors"
              vid="customer_address"
              name="customer_address"
            >
              <b-form-group
                id="customer_address_group"
                label="Address"
                label-for="customer_address"
              >
                <b-form-textarea
                  id="customer_address"
                  v-model="customer.customer_address"
                  placeholder="Address"
                  rows="3"
                  max-rows="6"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                ></b-form-textarea>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider v-slot="errors" vid="status" name="status">
              <b-form-group id="status_group" label="Status" label-for="status">
                <b-form-checkbox
                  v-model="customer.is_active"
                  name="check-button"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                  switch
                >
                  <b>
                    ({{ customer.is_active === true ? 'Active' : 'Deactive' }})
                  </b>
                </b-form-checkbox>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <b-button
              block
              variant="primary"
              :disabled="loading"
              @click="saveCustomer"
            >
              <template v-if="loading">
                <b-spinner small variant="light" label="Spinning"></b-spinner>
                Loading...
              </template>
              <template v-else> Save </template>
            </b-button>
          </b-form>
        </ValidationObserver>
      </div>
    </transition>
    <div v-if="isCreateToggle" class="overlay"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
export default {
  name: 'FormCreate',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      customer: {
        customer_name: '',
        email: '',
        phone_number: '',
        customer_address: '',
        is_active: false,
      },
      loading: false,
      showAlert: false,
      errorMessage: '',
    }
  },
  computed: {
    ...mapState('customer', ['isCreateToggle']),
  },
  methods: {
    formClose() {
      this.$store.commit('customer/SET_FORM_CREATE', false)
      this.customer = {
        customer_name: '',
        email: '',
        phone_number: '',
        customer_address: '',
        is_active: false,
      }
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? (valid !== false ? null : valid) : null
    },
    filterKey(e) {
      const key = e.key
      // If is '.' key, stop it
      if (key === '.') return e.preventDefault()
      // If is 'e' key, stop it
      if (key === 'e' || key === 'E') return e.preventDefault()
      // If is '-' key, stop it
      if (key === '-') return e.preventDefault()
    },
    filterInput(e) {
      if (e.length > 13) {
        return (this.customer.phone_number = '')
      }
      // This can also prevent copy + paste invalid character
      this.customer.phone_number = e.replace(/[^0-9]+/g, '')
      return this.customer.phone_number
    },
    saveCustomer() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.showAlert = false
      const data = {
        customer_name: this.customer.customer_name,
        email: this.customer.email,
        phone_number: this.customer.phone_number,
        customer_address: this.customer.customer_address,
        is_active: this.customer.is_active ? 1 : 0,
      }
      console.log(data)
      this.$swal
        .fire({
          title: 'Simpan data customer?',
          html:
            'Silakan periksa kembali data yang sudah diinputkan sebelum disimpan.',
          icon: 'warning',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          confirmButtonColor: '#17a2b8',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Simpan!',
          cancelButtonText: 'Batal',
          preConfirm: (confirm) => {
            return this.$axios
              .post('/api/customer/create', data)
              .then((res) => {
                this.loading = false
                this.$swal.fire({
                  text: 'Data berhasil disimpan',
                  icon: 'success',
                  allowOutsideClick: false,
                  preConfirm: (success) => {
                    this.$emit('events', '?limit=5&page=1')
                    this.formClose()
                  },
                })
              })
              .catch((error) => {
                this.loading = false
                console.log(error.response)
                if (error.response.status !== 422) {
                  this.showAlert = true
                  this.errorMessage = error.response.data.errors[0][0].errors
                } else {
                  this.$refs.formCustomer.setErrors(
                    error.response.data.errors[0]
                  )
                }
              })
          },
          allowOutsideClick: () => !this.$swal.isLoading(),
        })
        .then((result) => {
          console.log(result)
          if (!result.isConfirmed) {
            this.loading = false
          }
        })
    },
  },
}
</script>

<style scoped>
#form-create {
  width: 700px;
  padding: 2em 3em;
  position: fixed;
  z-index: 103;
  top: 56px;
  right: 0;
  background: #fff;
  height: calc(100vh - 55px);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  transition: all 0.5s ease-in-out;
}

#form-create.active {
  margin-left: -100%;
}

.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active di bawah versi 2.1.8 */ {
  transform: translateX(100%);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 101;
  background-color: rgba(0, 0, 0, 0.6);
}

#close_form {
  font-size: 24px;
}

@media (max-width: 768px) {
  #form-create {
    margin-left: -100%;
  }
  #form-create.active {
    margin-left: 0;
  }
}
</style>
