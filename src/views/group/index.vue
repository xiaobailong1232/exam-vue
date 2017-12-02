<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name" placeholder="请输入群组名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="搜索" placement="top-start">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" @keyup.enter.native="handleSearch"></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 操作按钮 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="添加群组" placement="top-start">
            <el-button type="success" @click="showAddForm" icon="el-icon-plus"></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 start -->
    
    <!-- 主要表格 start -->
    <el-table :data="table" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="prop">
          {{ prop.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column label="成员" width="70">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="查看成员列表" placement="top-start">
            <el-button v-if="prop.row.members_count" @click="goToMembers(prop.row.id)" size="mini" type="info">{{ prop.row.members_count }}</el-button>
            <el-button v-else size="mini" type="danger">{{ prop.row.members_count }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="属性">
        <template slot-scope="prop">
          <el-tag v-if="prop.row.labels.length > 0" v-for="item in prop.row.labels" :key="item.id" closable type="primary" @close="removeLabelFromGroup(prop.row, item)">{{item.name}}</el-tag>
          <el-button size="mini" @click="showAddGroupLabelForm(prop.row)">+ 标签</el-button>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" width="80">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="点击即可启用" placement="top" v-if="prop.row.deleted_at">
            <el-button size="mini" type="danger" @click="restoreItem(prop.row)">禁用</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="点击即可禁用" placement="top" v-else>
            <el-button size="mini" type="success" @click="deleteItem(prop.row)">启用</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="190">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="编辑信息" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"  v-if="!prop.row.deleted_at"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="单个添加" placement="top">
            <el-button size="mini" type="success" icon="el-icon-plus" @click="showAddMemberForm(prop.row)"  v-if="!prop.row.deleted_at"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Excel导入学员" placement="top">
            <el-button size="mini" type="info" icon="el-icon-upload" @click="goToImport(prop.row)"  v-if="!prop.row.deleted_at"></el-button>
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
    
    <!-- 弹出层：创建群组 start -->
    <el-dialog title="创建群组" :visible.sync="form.show" :width="'400px'">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="名称">
          <el-input v-model="form.data.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建群组 end -->
    
    <!-- 弹出层：修改群组基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="Name">
          <el-input v-model="edit.data.name" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改群组基本信息 end -->
    
    <!-- 弹出层：添加标签 start -->
    <el-dialog :title="label.status ? '编辑' : '详情'" :visible.sync="label.show">
      <el-form :model="label.data" :label-width="'120px'">
        <el-form-item label="大学">
          <el-select v-model="label.data.college" clearable filterable placeholder="请选择大学" :disabled="!label.status" :loading="labelLoading">
            <el-option
              v-for="item in groupCollegeLabels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="专业">
          <el-select v-model="label.data.major" clearable filterable placeholder="请选择专业" :disabled="!label.status" :loading="labelLoading">
            <el-option
              v-for="item in groupMajorLabels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="班级">
          <el-select v-model="label.data.class" clearable filterable placeholder="请选择班级" :disabled="!label.status" :loading="labelLoading">
            <el-option
              v-for="item in groupClassLabels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="label.status">
        <el-button @click="label.show = false">取 消</el-button>
        <el-button type="primary" @click="addLabelToGroup" :loading="label.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：添加标签 end -->
  
    <!-- 弹出层：创建用户 start -->
    <el-dialog title="添加群组成员" :visible.sync="member.show"  :width="'500px'">
      <el-form :model="member.data" :label-width="'100px'" :rules="member.rules" ref="addMemberForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="member.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="member.data.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="member.data.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="member.data.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input type="password" v-model="member.data.password_confirmation" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="member.show = false">取 消</el-button>
        <el-button type="primary" @click="addMember('addMemberForm')" :loading="member.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建用户 end -->
  </div>
</template>

<script>
  import {
    getGroupListFromApi,
    addGroupItemToApi,
    updateGroupItemToApi,
    deleteGroupItemToApi,
    restoreGroupItemToApi
  } from '@/api/group'
  
  import {
    addGroupLabelItemToApi,
    deleteGroupLabelItemToApi
  } from '@/api/groupLabel'
  
  import {
    addGroupMemberItemToApi
  } from '@/api/groupMembers'
  
  import { mapGetters } from 'vuex'
  
  import { filterNullOfObject } from '@/utils/index'

  import { isPhone } from '@/utils/validate'
  
  export default {
    created() {
      this.initFetch()
      // 读取Label标签
      if (this.groupCollegeLabels.length === 0) {
        this.labelLoading = true
        this.$store.dispatch('fetchLabelList').finally(() => {
          this.labelLoading = false
        })
      }
    },
    computed: {
      ...mapGetters(['groupCollegeLabels', 'groupClassLabels', 'groupMajorLabels'])
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
        } else if (value !== this.member.data.password) {
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
          delted_at: null
        },
        labelLoading: false, // 获取标签时的啊loading状态
        // 创建群组
        form: {
          show: false,
          loading: false,
          data: {
            name: null
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false, // 当false时，不显示。当true是，显示。
          status: false, // 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null, // 保存群组信息
          data: {
            name: null
          }
        },
        // 群组标签
        label: {
          show: false, // 当false时，不显示。当true是，显示。
          status: false, // 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null, // 保存群组信息
          data: {
            college: null,
            major: null,
            class: null
          }
        },
        // 成员
        member: {
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
        this.search.is_active = parseInt(this.$route.query.is_active) === 0 || this.$route.query.is_active ? parseInt(this.$route.query.is_active) : null
        this.loading = true
        getGroupListFromApi(this.search).then(response => {
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
      // 创建群组
      showAddForm() {
        this.form.show = true
      },
      // 添加群组
      addItem() {
        this.form.loading = true
        addGroupItemToApi(this.form.data).then(response => {
          this.table.unshift(response.data)
          this.form.show = false
        }).catch(err => console.log(err)).finally(() => this.form.loading = false)
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true
        this.edit.show = true
        this.edit.row = row
        this.edit.data.name = row.name
        this.edit.data.email = row.email
        this.edit.data.phone = row.phone
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true
        updateGroupItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.name = this.edit.data.name
          this.edit.row.email = this.edit.data.email
          this.edit.row.phone = this.edit.data.phone
          // 隐藏表单
          this.edit.show = false
        }).catch(err => console.log(err)).finally(() => this.edit.loading = false)
      },
      // 移除标签
      removeLabelFromGroup(row, item) {
        this.$confirm(`此操作将删除该群组的『${item.name}』标签, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteGroupLabelItemToApi(row.id, item.id)).then(response => {
          row.labels.forEach((val, key) => {
            if (val.id === item.id) {
              row.labels.splice(key, 1)
            }
          })
        }).catch(err => console.log(err))
      },
      // 展示添加群组标签表单
      showAddGroupLabelForm(row) {
        this.label.row = row
        this.label.show = true
        this.label.status = true
      },
      // 添加群组标签
      addLabelToGroup() {
        this.label.loading = true
        addGroupLabelItemToApi(this.label.row.id, this.label.data).then(response => {
          this.label.row.labels = []
          response.data.forEach(item => this.label.row.labels.push(item))
          this.label.show = false
        }).catch(err => console.log(err)).finally(() => this.label.loading = false)
      },
      // 查看成员
      goToMembers(groupId) {
        this.$router.push({ name: '群组成员', params: { groupId }})
      },
      // 删除
      deleteItem(row) {
        this.$confirm(`此操作将删除『${row.name}』群组, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteGroupItemToApi(row.id)).then(response => {
          row.deleted_at = true
        }).catch(err => console.log(err))
      },
      // 启用
      restoreItem(row) {
        this.$confirm(`此操作将启用『${row.name}』群组, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => restoreGroupItemToApi(row.id)).then(() => {
          row.deleted_at = false
        }).catch(err => console.log(err))
      },
      // 显示导入页面
      goToImport(row) {
        this.$router.push({ name: '导入成员', params: { groupId: row.id } })
      },
      // 展示添加群组成员表单
      showAddMemberForm(row) {
        this.member.show = true
        this.member.row = row
      },
      // 添加群组成员
      addMember(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.member.loading = true
            addGroupMemberItemToApi(this.member.row.id, this.member.data).then(() => {
              this.member.row.members_count += 1
              this.member.show = false
            }).catch(err => console.log(err)).finally(() => {
              this.member.loading = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
