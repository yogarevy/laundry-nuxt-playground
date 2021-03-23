<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info" fixed="top">
      <b-navbar-brand href="#">Laundry</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav> -->
        <b-navbar-nav>
          <a href="javascript:void(0)" @click="slideSidebar()">
            <font-awesome-icon id="burgerbar" icon="bars" />
          </a>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ username }}</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0)" @click="logout">
              Sign Out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Navbar',
  data() {
    return {
      isToggle: true,
      username: this.$auth.$storage.getUniversal('user').username,
    }
  },
  methods: {
    ...mapMutations(['SET_IS_AUTH', 'SET_TOGGLE']),
    slideSidebar() {
      this.isToggle = !this.isToggle
      console.log('click ' + this.isToggle)
      this.SET_TOGGLE(this.isToggle)
    },
    async logout() {
      await this.$auth.logout()
      this.$auth.$storage.removeUniversal('user')
      this.SET_IS_AUTH(false)
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
#burgerbar {
  color: #fff;
}
</style>
