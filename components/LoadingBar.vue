<template>
  <div v-if="loading" class="loading-page text-primary">
    <b-spinner class="align-middle spining" label="Large Spinner"></b-spinner>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      setTimeout(() => (this.loading = false), 2000)
    },
  },
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  text-align: center;
  padding-top: 300px;
  z-index: 1000;
}

.spining {
  width: 3rem;
  height: 3rem;
}
</style>
