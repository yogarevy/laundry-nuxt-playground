<template>
  <div class="container">
    <div>
      <h1 class="title">laundry-web</h1>
      <br />
      <b-card header-tag="header">
        <template #header>
          <h6 class="mb-0">Login</h6>
        </template>
        <ValidationObserver ref="form">
          <b-form>
            <b-alert v-model="showAlert" variant="danger" dismissible>
              {{ errorMessage }}
            </b-alert>
            <ValidationProvider v-slot="errors" vid="email" name="email">
              <b-form-group id="email-group" label-for="email">
                <b-form-input
                  id="email"
                  v-model="auth.email"
                  type="email"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Email"
                ></b-form-input>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider v-slot="errors" vid="password" name="password">
              <b-form-group
                id="password"
                class="password-icon"
                label-for="password"
              >
                <b-form-input
                  id="password"
                  v-model="auth.password"
                  :type="type"
                  :state="getValidationState(errors)"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Password"
                ></b-form-input>
                <i
                  v-if="getValidationState(errors) !== false"
                  class="icon-input"
                  @click="switchVisibility"
                >
                  <font-awesome-icon :icon="icon" />
                </i>
                <b-form-invalid-feedback class="input-live-feedback">
                  {{ errors.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <b-button
              block
              variant="primary"
              :disabled="loading"
              @click="onSubmit"
            >
              <template v-if="loading">
                <b-spinner small variant="light" label="Spinning"></b-spinner>
                Loading...
              </template>
              <template v-else> Login </template>
            </b-button>
          </b-form>
        </ValidationObserver>
      </b-card>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-console
import { mapMutations } from 'vuex'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  auth: false,
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      auth: {
        email: '',
        password: '',
        fcm_token: '',
      },
      type: 'password',
      icon: ['far', 'eye'],
      loading: false,
      errorMessage: '',
      showAlert: false,
      stateEmail: null,
      emailMessage: '',
      statePassword: null,
    }
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    ...mapMutations(['SET_IS_AUTH']),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? (valid !== false ? null : valid) : null
    },
    onSubmit() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.showAlert = false
      this.$auth
        .loginWith('local', {
          data: {
            email: this.auth.email,
            password: this.auth.password,
            fcm_token: 'fcm_token',
          },
        })
        .then((res) => {
          this.loading = false
          const user = res.data.user
          this.$auth.setUser(user)
          this.SET_IS_AUTH(true)
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          this.loading = false
          this.errForm = []
          if (error.response.status !== 422) {
            this.showAlert = true
            this.errorMessage = error.response.data.meta.errors[0][0].errors
          } else {
            this.$refs.form.setErrors(error.response.data.errors[0])
          }
        })
    },
    switchVisibility() {
      if (this.type === 'password') {
        this.type = 'text'
        this.icon = ['far', 'eye-slash']
      } else {
        this.type = 'password'
        this.icon = ['far', 'eye']
      }
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.password-icon {
  position: relative;
}

.icon-input {
  position: absolute;
  color: rgba(0, 0, 0, 0.54);
  right: 15px;
  bottom: calc(0.5rem - 1px);
}

.icon-input:hover {
  cursor: pointer;
}

.input-live-feedback {
  text-align: left;
}
</style>
