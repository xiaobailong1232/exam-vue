<template>
  <el-menu mode="vertical" theme="dark"
           background-color="#334157"
           text-color="#a2aebf"
           active-text-color="#21a0ff"
           :default-active="$route.path">
    <sidebar-item :routes="routes"></sidebar-item>
  </el-menu>
</template>

<script>
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    routes() {
      return this.$router.options.routes
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;
}
</style>
