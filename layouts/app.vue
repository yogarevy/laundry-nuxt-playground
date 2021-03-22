<template>
  <div>
    <Navbar />
    <div class="wrapper">
      <Sidebar />
      <div
        id="content"
        :style="[
          !isSlideToggle
            ? {
                position: 'relative',
                width: '100%',
                'margin-left': '0px',
                padding: '20px',
              }
            : {
                position: 'relative',
                width: '100%',
                'margin-left': '250px',
                padding: '20px',
              },
        ]"
      >
        <Breadcrumb />
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Breadcrumb from '~/components/Breadcrumb.vue'
export default {
  components: { Breadcrumb },
  computed: {
    ...mapState(['isAuth', 'isSlideToggle']),
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.wrapper {
  margin-top: 56px;
  display: flex;
  width: 100%;
}

#content {
  position: relative;
  width: 100%;
  margin-left: 250px;
  padding: 20px;
}
</style>
