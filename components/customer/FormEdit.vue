<template>
  <div>
    <!-- TRANSITION ANIMATION FORM -->
    <transition name="slide-fade">
      <div v-if="isEditToggle" id="form-create">
        <!-- SPINNER SHOW WHEN LOAD DATA -->
        <div v-if="isLoading" class="text-center text-primary is-loading">
          <b-spinner class="align-middle load-spinner"></b-spinner>
        </div>
        <!-- BUTTON CLOSE FORM -->
        <a href="javascript:void(0)" class="form-close" @click="formClose()">
          <font-awesome-icon id="close_form" icon="times" />
        </a>
        <h2>Ubah Customer</h2>
        <hr />
        <!-- FORM START -->
        <ValidationObserver ref="formCustomer">
          <b-form>
            <!-- ALERT SECTION FOR ERROR -->
            <b-alert v-model="showAlert" variant="danger" dismissible>
              {{ errorMessage }}
            </b-alert>
            <!-- NAME FIELD -->
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
            <!-- EMAIL FIELD -->
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
            <!-- PHONE NUMBER FIELD -->
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
            <!-- ADDRESS DIELD -->
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
            <!-- STATUS FIELD -->
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
            <!-- BUTTON SAVE -->
            <b-button
              block
              variant="primary"
              :disabled="loading"
              @click="updateCustomer"
            >
              <template v-if="loading">
                <b-spinner small variant="light" label="Spinning"></b-spinner>
                Loading...
              </template>
              <template v-else> Update </template>
            </b-button>
          </b-form>
        </ValidationObserver>
      </div>
    </transition>
    <!-- OVERLAY SHOW WHEN FORM OPENED -->
    <div v-if="isEditToggle" class="overlay"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
export default {
  name: 'FormEdit',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: { sendparam: { type: [String], default: '' } }, // get data param from parent to child
  data() {
    return {
      customer: {
        customer_name: '',
        email: '',
        phone_number: '',
        customer_address: '',
        is_active: false,
        group_id: '',
      },
      loading: false,
      isLoading: false,
      showAlert: false,
      errorMessage: '',
    }
  },
  computed: {
    ...mapState('customer', ['isEditToggle', 'idEdit']), // Get data from toggle to open Form Edit
    getIdParam() {
      return this.idEdit
    }, // function get id data that stored from state
  },
  watch: {
    getIdParam(idParam) {
      if (idParam !== '') {
        this.fetchEditData(idParam)
      }
    }, // watching changes of id data
  },
  methods: {
    // Function for close form edit and reset all field
    formClose() {
      const formClose = { id_edit: '', is_form_edit: false }
      this.$store.commit('customer/SET_FORM_EDIT', formClose)
      this.customer = {
        id: '',
        customer_name: '',
        email: '',
        phone_number: '',
        customer_address: '',
        is_active: false,
      }
    },
    // Function to get validate from server and show to form field
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? (valid !== false ? null : valid) : null
    },
    // Start client side validation field phone number only allow number
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
    // Fetching data by id when data action edit clicked by user
    fetchEditData(idParam) {
      this.isLoading = true
      this.$axios
        .get('/api/customer/show/' + idParam)
        .then((res) => {
          if (res.status === 200) {
            let isActive = res.data.data.item.is_active
            if (isActive === 1) {
              isActive = true
            } else {
              isActive = false
            }
            this.customer = {
              id: res.data.data.item.id,
              customer_name: res.data.data.item.customer_name,
              email: res.data.data.item.email,
              phone_number: res.data.data.item.phone_number,
              customer_address: res.data.data.item.customer_address,
              is_active: isActive,
              group_id: res.data.data.item.group_id,
            }
            this.isLoading = false
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.$swal({
              text: err.response.statusText,
              icon: 'error',
              allowOutsideClick: false,
              preConfirm: (errResult) => {
                this.formClose()
              },
            })
          } else {
            this.$swal({
              text: err.response.data.meta.errors[0][0].errors,
              icon: 'error',
              allowOutsideClick: false,
              preConfirm: (errResult) => {
                this.formClose()
              },
            })
          }
        })
    },
    // Function for update edited data of custumer
    updateCustomer() {
      // inital data
      if (this.loading) {
        return
      }
      this.loading = true
      this.showAlert = false
      const idCustomer = this.customer.id
      const data = {
        customer_name: this.customer.customer_name,
        email: this.customer.email,
        phone_number: this.customer.phone_number,
        customer_address: this.customer.customer_address,
        is_active: this.customer.is_active ? 1 : 0,
        group_id: this.customer.group_id,
      }
      // Process update customer
      this.$swal({
        title: 'Ubah data customer?',
        html:
          'Silakan periksa kembali data yang sudah diinputkan sebelum diubah.',
        icon: 'warning',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ubah!',
        cancelButtonText: 'Batal',
        preConfirm: (confirm) => {
          return this.$axios
            .post('/api/customer/edit/' + idCustomer, data)
            .then((res) => {
              this.loading = false
              this.formClose()
              this.$swal({
                text: 'Data berhasil diupdate',
                icon: 'success',
                allowOutsideClick: false,
                preConfirm: (success) => {
                  this.$emit('events', this.sendparam)
                },
              })
            })
            .catch((error) => {
              this.loading = false
              if (error.response.status !== 422) {
                this.showAlert = true
                this.errorMessage = error.response.data.meta.errors[0][0].errors
                this.$swal({
                  text: error.response.data.meta.errors[0][0].errors,
                  icon: 'error',
                  allowOutsideClick: false,
                })
              } else {
                this.$refs.formCustomer.setErrors(error.response.data.errors[0])
              }
            })
        },
        allowOutsideClick: () => !this.$swal.isLoading(),
      }).then((result) => {
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

.is-loading {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 700px;
  z-index: 102;
  background-color: #fff;
}
.load-spinner {
  margin-top: 45%;
  width: 3rem;
  height: 3rem;
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
