<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name" placeholder="请输入名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" @keyup.enter.native="handleSearch"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 操作按钮 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="showAddForm" icon="el-icon-plus"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 start -->
    
    <!-- 主要表格 start -->
    <el-table :data="table" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="prop">
          <el-button  v-if="prop.row.possessors.length > 0" v-for="item in prop.row.possessors" :key="item.id" size="mini" type="primary" @click="toggleActive(prop.row)">{{ item.possessor }}</el-button>
          <el-button  v-else type="danger">无</el-button>
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="prop">
          <el-tag v-if="prop.row.labels.length > 0" v-for="item in prop.row.labels" :key="item.id" closable type="primary" @close="removeLabelFromGroup(prop.row, item)">{{item.name}}</el-tag>
          <el-button size="mini" @click="showAddGroupLabelForm(prop.row)">+ 标签</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          <el-button size="mini" type="info" icon="el-icon-info" @click="showDetailForm(prop.row)"></el-button>
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
        <el-form-item label="标签">
          <el-select v-model="label.data.label_id" placeholder="请选择标签" :disabled="!label.status" :loading="labelLoading">
            <el-option
              v-for="item in groupLabelOptions"
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
  </div>
</template>

<script>
  import {
    getGroupListFromApi,
    addGroupItemToApi,
    updateGroupItemToApi,
    deleteGroupItemToApi,
    restoreGroupItemToApi,
  } from '@/api/group';
  
  import {
    addGroupLabelItemToApi,
    deleteGroupLabelItemToApi,
  } from '@/api/groupLabel';
  
  import { mapGetters } from 'vuex';
  
  import { filterNullOfObject } from '@/utils/index';
  
  export default {
    created () {
      this.initFetch();
    },
    computed: {
      ...mapGetters(['groupLabelOptions'])
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
          delted_at: null
        },
        labelLoading: false,// 获取标签时的啊loading状态
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
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存群组信息
          data: {
            name: null
          }
        },
        // 群组标签
        label: {
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存群组信息
          data: {
            label_id: null
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
        getGroupListFromApi(this.search).then(response => {
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
      // 开启 或 禁用群组
      toggleActive(row) {
        // 禁用群组
        if (row.is_active) {
          this.$confirm('此操作将禁用群组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => deleteGroupItemToApi(row.id))
          .then(response => row.is_active = 0)
          .catch(err => console.log(err));
        }
        // 启用群组
        else {
          this.$confirm('此操作将启用群组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => restoreGroupItemToApi(row.id))
          .then(response => row.is_active = 1).catch(err => console.log(err));
        }
      },
      // 创建群组
      showAddForm() {
        this.form.show = true;
      },
      // 添加群组
      addItem() {
        this.form.loading = true
        addGroupItemToApi(this.form.data).then(response => {
          this.table.unshift(response.data)
          this.form.show = false
        }).catch(err => console.log(err)).finally(() => this.form.loading = false)
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
        updateGroupItemToApi(this.edit.row.id, this.edit.data).then(() => {
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
        this.$prompt('您将要重置该群组的密码啊，请您输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{6,}$/,
          inputErrorMessage: '密码最少六位字符'
        }).then(({ value }) => {
          resetGroupPasswordToApi(row.id, value ? value : 123456);
          this.$message('成功后会有信息提示，后台正在进行密码重置...');
        }).catch(err => console.log(err));
      },
      // 移除标签
      removeLabelFromGroup(row, item) {
        this.$confirm(`此操作将删除该群组的『${item.name}』标签, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => deleteGroupLabelItemToApi(row.id, item.id))
        .then(response => {
          row.labels.forEach((val, key) => {
            if (val.id === item.id) {
              row.labels.splice(key, 1)
            }
          })
        }).catch(err => console.log(err));
      },
      // 展示添加群组标签表单
      showAddGroupLabelForm(row) {
        this.label.row = row;
        this.label.show = true;
        this.label.status = true;
        if (this.groupLabelOptions.length === 0) {
          this.labelLoading = true;
          this.$store.dispatch('fetchLabelList').finally(() => this.labelLoading = false);
        }
      },
      // 添加群组标签
      addLabelToGroup() {
        this.label.loading = true
        addGroupLabelItemToApi(this.label.row.id, this.label.data).then(response => {
          this.label.row.labels.push(response.data)
          this.label.show = false
        }).catch(err => console.log(err)).finally(() => this.label.loading = false);
      }
    }
  }
</script>
