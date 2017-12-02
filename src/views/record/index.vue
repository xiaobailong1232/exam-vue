<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.exam_name" placeholder="请输入考试名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.user_name" placeholder="请输入学员姓名" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" @keyup.enter.native="handleSearch"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 主要表格 start -->
    <el-table :data="table" border style="width: 100%" v-loading="loading">
      <el-table-column label="考试名称">
        <template slot-scope="prop">{{ prop.row.exam.name }}</template>
      </el-table-column>
      <el-table-column label="学员姓名">
        <template slot-scope="prop">{{ prop.row.user.name }}</template>
      </el-table-column>
      <el-table-column prop="total_score" label="卷面分"></el-table-column>
      <el-table-column prop="actual_score" label="成绩"></el-table-column>
      <el-table-column prop="created_at" label="答题时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-button size="mini" type="info" @click="getItem(prop.row.exam_id)">答题记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 主要表格 start -->
    
    <!-- 分页 start -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="search.page"
      :page-sizes="[10, 25, 50, 100]"
      :page-size="search.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="search.total">
    </el-pagination>
    <!-- 分页 end -->
    
    <el-dialog title="详情" :visible.sync="record.show" width="80%" v-loading="record.loading" >
      <div v-for="(item, index) in record.data" :key="item.id">
        <el-card class="box-card" style="margin-bottom: 5px;">
          <div slot="header" class="clearfix">
            <span>{{ ++index }} . {{ item.question.title }}</span>
            <el-tag :type="item.is_right ? 'success' : 'danger'">{{ item.is_right ? '回答正确' : '回答错误' }}</el-tag>
          </div>
          <p v-for="option in item.question.options">{{ option.id }} . {{ option.content }}</p>
          <el-tag type="info">用户答案: {{ item.answer }}</el-tag>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getRecordListFromApi,
    getRecordItemFromApi
  } from '@/api/record'
  
  import { filterNullOfObject } from '@/utils/index'
  
  export default {
    created() {
      this.initFetch()
    },
    data() {
      return {
        // 基础数据
        loading: false,
        table: [],
        search: {
          page: 1,
          size: 10,
          total: 0,
          user_name: null,
          exam_name: null,
          exam_id: null
        },
        record: {
          loading: false,
          show: false,
          data: {}
        }
      }
    },
    methods: {
      // 进入页面即读取数据
      initFetch() {
        // 格式化URL参数
        this.search.page = this.$route.query.page ? Number.parseInt(this.$route.query.page) : 1
        this.search.size = this.$route.query.size ? parseInt(this.$route.query.size) : 10
        this.search.user_name = this.$route.query.user_name ? this.$route.query.user_name : null
        this.search.exam_name = this.$route.query.exam_name ? this.$route.query.exam_name : null
        this.search.exam_id = this.$route.query.exam_id ? this.$route.query.exam_id : null
        this.loading = true
        getRecordListFromApi(this.search).then(response => {
          this.search.total = Number.parseInt(response.total)
          this.table = response.data
        }).catch(err => console.log(err)).finally(() => this.loading = false)
      },
      // 推入历史记录
      pushRoute() {
        // 过滤无用参数，否则会报错
        const query = filterNullOfObject(this.search)
        this.$router.push({
          path: this.$route.path,
          query: query
        })
      },
      // 切换分页大小
      handleSizeChange(val) {
        this.search.size = val
        this.pushRoute()
      },
      // 当前页切换
      handleCurrentChange(val) {
        this.search.page = val
        this.pushRoute()
      },
      // 搜索
      handleSearch() {
        this.pushRoute()
      },
      // 获取答题记录详情
      getItem(exam_id) {
        this.record.loading = true
        this.record.show = true
        getRecordItemFromApi(exam_id).then(response => {
          this.record.data = response.data
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.record.loading = false
        })
      }
    }
  }
</script>

<style>
  .text {
    font-size: 14px;
  }
  
  .item {
    margin-bottom: 18px;
  }
</style>
