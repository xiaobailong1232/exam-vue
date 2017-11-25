<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px;font-weight: bold">试卷：{{ paper.name }}</span>
        <el-button style="font-size: 18px;float: right; padding: 3px 0" type="text" @click="goToEdit">我要修改</el-button>
      </div>
      
      <el-row v-for="(question, index) in paper.questions" :key="index">
        <el-col :span="24" style="margin-bottom: 10px;">
          <span style="font-weight: bold">{{ (index + 1) }}</span> . {{ question.title }}
          <span>（ {{ question.pivot.score }} 分）</span>
        </el-col>
        <el-col :span="24" v-for="option in question.options" :key="option.id" style="margin-bottom: 5px;">
          <el-tag :type="option.is_answer ? 'success' : 'info'">{{ String.fromCharCode(64 + option.id) }} . {{ option.content }}</el-tag>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { getPaperItemFromApi } from '@/api/paper'
  
  export default {
    name: 'exam-paper',
    created() {
      this.initFetch()
    },
    data() {
      return {
        loading: false,
        paper: {}
      }
    },
    methods: {
      // 初始化读取数据
      initFetch() {
        this.loading = true
        getPaperItemFromApi(this.$route.params.paperId).then(response => {
          this.paper = response.data
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      },
      // 进入编辑页面
      goToEdit() {
        this.$router.push({name: '试卷题目修改', params: { paperId: this.$route.params.paperId }})
      }
    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }
</style>
