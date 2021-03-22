<template>
  <ol class="breadcrumb">
    <li v-for="(item, i) in crumbs" :key="i" class="item">
      <nuxt-link :to="item.to" class="title">
        {{ item.title }}
      </nuxt-link>
    </li>
  </ol>
</template>

<script>
import startCase from 'lodash.startcase'

export default {
  name: 'Breadcrumb',
  computed: {
    crumbs() {
      const pathArray = this.$route.path.split('/')
      pathArray.shift()
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        if (path) {
          breadcrumbArray.push({
            to: breadcrumbArray[idx - 1]
              ? '/' + breadcrumbArray[idx - 1].path + '/' + path
              : '/' + path,
            title: startCase(path),
          })
        }
        return breadcrumbArray
      }, [])
      return breadcrumbs
    },
  },
}
</script>

<style scoped>
li a {
  font-size: small;
}
</style>
