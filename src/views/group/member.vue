<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name" placeholder="请输入名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="请输入手机" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
                     @keyup.enter.native="handleSearch"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 主要表格 start -->
    <el-table :data="table" border style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="手机"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="移除学员" placement="top">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletedMember(prop.row)"></el-button>
          </el-tooltip>
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
  </div>
</template>

<script>
  import { getGroupMemberListFromApi, deleteGroupMemberItemToApi } from '@/api/groupMembers'
  
  import { filterNullOfObject } from '@/utils/index'
  
  export default {
    created() {
      this.initFetch()
    },
    data() {
      return {
        loading: false,
        table: [],
        search: {
          page: 1,
          size: 10,
          total: 0,
          name: null,
          phone: null
        }
      }
    },
    methods: {
      // 进入页面即读取数据
      initFetch() {
        // 格式化URL参数
        this.search.page = this.$route.query.page ? Number.parseInt(this.$route.query.page) : 1
        this.search.size = this.$route.query.size ? parseInt(this.$route.query.size) : 10
        this.search.name = this.$route.query.name ? this.$route.query.name : null
        this.search.phone = this.$route.query.phone ? this.$route.query.phone : null
        this.loading = true
        getGroupMemberListFromApi(this.$route.params.groupId, this.search).then(response => {
          this.search.total = Number.parseInt(response.total)
          this.table = response.data
        }).catch(err => console.log(err)).finally(() => {
          this.loading = false
        })
      },
      // 推入历史记录
      pushRoute() {
        console.log(this.search)
        // 过滤无用参数，否则会报错
        const query = filterNullOfObject(this.search)
        console.log(this.search)
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
      // 删除组成员
      deletedMember(row) {
        this.$confirm(`此操作将该『${row.name}』学员踢出群组, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteGroupMemberItemToApi(this.$route.params.groupId, row.id)).then(response => {
          this.table.forEach((item, index) => {
            if (item.id === row.id) {
              this.table.splice(index, 1)
            }
          })
        }).catch(err => console.log(err))
      }
    }
  }
</script>

<style>

</style>
