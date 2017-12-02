<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name" placeholder="请输入姓名" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="请输入手机" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.is_active" placeholder="请选择状态" clearable filterable>
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="搜索" placement="top-start">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" @keyup.enter.native="handleSearch"></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="添加管理员账户" placement="top-start">
            <el-button type="primary" @click="showAddForm" icon="el-icon-plus"></el-button>
          </el-tooltip>
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
      <el-table-column label="状态" width="80">
        <template slot-scope="prop">
          <el-button size="mini" :type="prop.row.is_active ? 'success' : 'danger'" @click="toggleActive(prop.row)">{{ prop.row.is_active ? '激活' : '禁用' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
            <el-button size="mini" type="info" icon="el-icon-info" @click="showDetailForm(prop.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="top-start">
            <el-button size="mini" type="warning" icon="el-icon-refresh" @click="resetPassword(prop.row)"></el-button>
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
  
    <!-- 弹出层：创建用户 start -->
    <el-dialog title="创建后台用户" :visible.sync="form.show"  :width="'500px'">
      <el-form :model="form.data" :label-width="'100px'" :rules="form.rules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.data.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.data.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.data.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input type="password" v-model="form.data.password_confirmation" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem('addForm')" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建用户 end -->
    
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
  import {
    getUserListFromApi,
    getUserItemFromApi,
    addUserItemToApi,
    updateUserItemToApi,
    deleteUserItemToApi,
    restoreUserItemToApi,
    resetUserPasswordToApi,
  } from '@/api/user'
  
  import { mapGetters } from 'vuex'
  
  import { filterNullOfObject } from '@/utils/index'
  
  import { isPhone } from '@/utils/validate'
  
  export default {
    created () {
      this.initFetch()
    },
    data() {
      const validatePassword = (rule, value, callback) => {
        if (!value || value === '' || value === undefined) {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码最小长度为6'))
        } else {
          callback()
        }
      }
      const validatePassword2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.data.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入手机'))
        } else if (!isPhone(value)) {
          callback(new Error('手机不合法!'))
        } else {
          callback()
        }
      }
      return {
        // 基础数据
        loading: false,
        table: [],
        search: {
          page: 1,
          size: 10,
          total: 0,
          name: null,
          phone: null,
          is_active: null
        },
        // 创建用户
        form: {
          show: false,
          loading: false,
          data: {
            name: null,
            email: null,
            phone: null,
            password: null,
            password_confirmation: null
          },
          rules: {
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
            ],
            phone: [
              { required: true, message: '请输入手机', trigger: 'blur' },
              { validator: validatePhone, trigger: 'blur' }
            ],
            email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePassword, trigger: 'blur' }
            ],
            password_confirmation: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePassword2, trigger: 'blur' }
            ]
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存用户信息
          data: {
            name: null,
            email: null,
            phone: null,
          }
        },
      }
    },
    methods: {
      // 进入页面即读取数据
      initFetch() {
        // 格式化URL参数
        this.search.page = this.$route.query.page ? Number.parseInt(this.$route.query.page) : 1;
        this.search.size = this.$route.query.size ? parseInt(this.$route.query.size) : 10;
        this.search.name = this.$route.query.name ? this.$route.query.name : null;
        this.search.phone = this.$route.query.phone ? this.$route.query.phone : null;
        this.search.is_active = parseInt(this.$route.query.is_active) === 0 || this.$route.query.is_active ? parseInt(this.$route.query.is_active) : null;
        this.loading = true;
        getUserListFromApi(this.search).then(response => {
          this.search.total = Number.parseInt(response.total);
          this.table = response.data
        }).catch(err => console.log(err)).finally(() => this.loading = false);
      },
      // 推入历史记录
      pushRoute() {
        // 过滤无用参数，否则会报错
        const query = filterNullOfObject(this.search);
        this.$router.push({
          path: this.$route.path,
          query: query
        });
      },
      // 切换分页大小
      handleSizeChange (val) {
        this.search.size = val;
        this.pushRoute();
      },
      // 当前页切换
      handleCurrentChange(val) {
        this.search.page = val;
        this.pushRoute();
      },
      // 搜索
      handleSearch() {
        this.pushRoute();
      },
      // 开启 或 禁用用户
      toggleActive(row) {
        // 禁用用户
        if (row.is_active) {
          this.$confirm('此操作将禁用用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => deleteUserItemToApi(row.id))
          .then(response => row.is_active = 0)
          .catch(err => console.log(err));
        }
        // 启用用户
        else {
          this.$confirm('此操作将启用用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => restoreUserItemToApi(row.id))
          .then(response => row.is_active = 1).catch(err => console.log(err));
        }
      },
      // 创建用户
      showAddForm() {
        this.form.show = true;
      },
      // 添加用户
      addItem(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.loading = true
            addUserItemToApi(this.form.data).then(response => {
              this.table.unshift(response.data);
              this.form.show = false;
            }).catch(err => console.log(err)).finally(() => this.form.loading = false);
          } else {
            return false;
          }
        });
      },
      // 详细信息
      showDetailForm(row) {
        this.edit.status = false;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.name = row.name;
        this.edit.data.email = row.email;
        this.edit.data.phone = row.phone;
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.name = row.name;
        this.edit.data.email = row.email;
        this.edit.data.phone = row.phone;
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true;
        updateUserItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.name = this.edit.data.name;
          this.edit.row.email = this.edit.data.email;
          this.edit.row.phone = this.edit.data.phone;
          // 隐藏表单
          this.edit.show = false;
        }).catch(err => console.log(err)).finally(() => this.edit.loading = false);
      },
      // 重置密码
      resetPassword(row) {
        this.$prompt('您将要重置该用户的密码，请您输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{6,}$/,
          inputErrorMessage: '密码最少六位字符'
        }).then(({ value }) => {
          resetUserPasswordToApi(row.id, value ? value : 123456);
          this.$message('成功后会有信息提示，后台正在进行密码重置...');
        }).catch(err => console.log(err));
      },
    }
  }
</script>
