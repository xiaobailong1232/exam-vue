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
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" @keyup.enter.native="handleSearch"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="showAddForm" icon="el-icon-plus"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 主要表格 start -->
    <el-table :data="table" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="激活">
        <template slot-scope="prop">
          <el-button size="mini" :type="prop.row.is_active ? 'success' : 'danger'" @click="toggleActive(prop.row)">{{ prop.row.is_active ? '是' : '否' }}</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column label="角色">-->
        <!--<template slot-scope="prop">-->
          <!--<el-tag v-if="prop.row.roles.length > 0" v-for="item in prop.row.roles" :key="item.id" closable type="primary" @close="removeRoleFromUser(prop.row, item)">{{item.name}}</el-tag>-->
          <!--<el-button size="mini" @click="showAddUserRoleForm(prop.row)">+ 角色</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          <el-button size="mini" type="info" icon="el-icon-info" @click="showDetailForm(prop.row)"></el-button>
          <el-button size="mini" type="warning" icon="el-icon-refresh" @click="resetPassword(prop.row)"></el-button>
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
    <el-dialog title="创建用户" :visible.sync="form.show" :width="'400px'">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="姓名">
          <el-input v-model="form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.data.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.data.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.data.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="form.data.password_confirmation" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建用户 end -->
    
    <!-- 弹出层：修改用户基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="Name">
          <el-input v-model="edit.data.name" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="edit.data.email" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="edit.data.phone" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改用户基本信息 end -->
    
    <!-- 弹出层：添加角色 start -->
    <el-dialog :title="role.status ? '编辑' : '详情'" :visible.sync="role.show">
      <el-form :model="role.data" :label-width="'120px'">
        <el-form-item label="角色">
          <el-select v-model="role.data.role_id" placeholder="请选择角色" :disabled="!role.status" :loading="roleLoading">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="role.status">
        <el-button @click="role.show = false">取 消</el-button>
        <el-button type="primary" @click="addRoleToUser" :loading="role.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：添加角色 end -->
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
  } from '@/api/user';
  
  import {
    addUserRoleItemToApi,
    deleteUserRoleItemToApi,
  } from '@/api/userRole';
  
  import { mapGetters } from 'vuex';
  
  import { filterNullOfObject } from '@/utils/index';
  
  export default {
    created () {
      this.initFetch();
    },
    computed: {
      ...mapGetters(['roleOptions'])
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
          name: null,
          phone: null,
          is_active: null
        },
        roleLoading: false,// 获取角色时的啊loading状态
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
        // 用户角色
        role: {
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存用户信息
          data: {
            role_id: null
          }
        }
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
      addItem() {
        this.form.loading = true
        addUserItemToApi(this.form.data).then(response => {
          this.table.unshift(response.data);
          this.form.show = false;
        }).catch(err => console.log(err)).finally(() => this.form.loading = false);
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
        this.$prompt('您将要重置该用户的密码啊，请您输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{6,}$/,
          inputErrorMessage: '密码最少六位字符'
        }).then(({ value }) => {
          resetUserPasswordToApi(row.id, value ? value : 123456);
          this.$message('成功后会有信息提示，后台正在进行密码重置...');
        }).catch(err => console.log(err));
      },
      // 移除角色
      removeRoleFromUser(row, item) {
        this.$confirm(`此操作将删除该用户的『${item.name}』角色, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => deleteUserRoleItemToApi(row.id, item.id))
        .then(response => {
          row.roles.forEach((val, key) => {
            if (val.id === item.id) {
              row.roles.splice(key, 1)
            }
          })
        }).catch(err => console.log(err));
      },
      // 展示添加用户角色表单
      showAddUserRoleForm(row) {
        this.role.row = row;
        this.role.show = true;
        this.role.status = true;
        if (this.roleOptions.length === 0) {
          this.roleLoading = true;
          this.$store.dispatch('fetchRoleList').finally(() => this.roleLoading = false);
        }
      },
      // 添加用户角色
      addRoleToUser() {
        this.role.loading = true
        addUserRoleItemToApi(this.role.row.id, this.role.data).then(response => {
          this.role.row.roles.push(response.data)
          this.role.show = false
        }).catch(err => console.log(err)).finally(() => this.role.loading = false);
      }
    }
  }
</script>
