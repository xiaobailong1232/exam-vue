<template>
  <div class="dashboard-container">
    <img src="http://on64ewxzt.bkt.clouddn.com/%E5%9B%BE%E4%B8%89%EF%BC%88%E9%80%8F%E6%98%8E%E5%BA%95%EF%BC%89.PNG"
         style="background: aliceblue; " />
    <div class='dashboard-text' style="font-size: 20px;">{{name}} 你好，欢迎使用 <span style="color: #67C23A;">北京联合大学</span> 考评系统</div>
    <!--<div class='dashboard-text'>身份: <span v-for='role in roles' :key='role'>{{role}}</span></div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
