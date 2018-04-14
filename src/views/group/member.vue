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
          <el-input v-model="search.student_id" placeholder="请输入学号" @keyup.enter.native="handleSearch"></el-input>
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
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="手机" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="student_id" label="学号"></el-table-column>
      <el-table-column label="操作" width="190">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="编辑信息" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="top">
            <el-button size="mini" type="warning" icon="el-icon-refresh" @click="resetPassword(prop.row)"></el-button>
          </el-tooltip>
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
  
    <!-- 弹出层：修改用户基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="姓名">
          <el-input v-model="edit.data.name" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="edit.data.email" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="edit.data.phone" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="edit.data.student_id" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改用户基本信息 end -->
  </div>
</template>

<script>
  import { getGroupMemberListFromApi, deleteGroupMemberItemToApi } from '@/api/groupMembers'
  import { updateUserItemToApi, resetUserPasswordToApi, } from '@/api/user'
  
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
          phone: null,
          student_id: null
        },
        // 详情 与 编辑的属性
        edit: {
          show: false, // 当false时，不显示。当true是，显示。
          status: false, // 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null, // 保存用户信息
          data: {
            name: null,
            email: null,
            phone: null,
            student_id: null
          }
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
        this.search.student_id = this.$route.query.student_id ? this.$route.query.student_id : null
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
      },
      // 重置密码
      resetPassword(row) {
        this.$prompt('您将要重置该用户的密码，请您输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{6,}$/,
          inputErrorMessage: '密码最少六位字符'
        }).then(({ value }) => {
          resetUserPasswordToApi(row.id, value ? value : 123456)
          this.$message('成功后会有信息提示，后台正在进行密码重置...')
        }).catch(err => console.log(err))
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.name = row.name;
        this.edit.data.email = row.email;
        this.edit.data.phone = row.phone;
        this.edit.data.student_id = row.student_id;
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true;
        updateUserItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.name = this.edit.data.name;
          this.edit.row.email = this.edit.data.email;
          this.edit.row.phone = this.edit.data.phone;
          this.edit.row.student_id = this.edit.data.student_id;
          // 隐藏表单
          this.edit.show = false;
        }).catch(err => console.log(err)).finally(() => this.edit.loading = false);
      },
    }
  }
</script>

<style>

</style>
