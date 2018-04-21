<template>
    <section class="app-main">
      <div style="margin:5px 0 0 20px;">
        <el-button @click="prev" size="mini">&lt;</el-button>
        <el-button @click="next" size="mini">&gt;</el-button>
      </div>
      <transition name="fade" mode="out-in">
        <router-view :key="key"></router-view>
      </transition>
    </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  methods: {
    prev() {
      this.$router.go(-1)
    },
    next() {
      this.$router.go(1)
    }
  }
}
</script>
