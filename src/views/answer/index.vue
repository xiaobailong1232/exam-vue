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
      <el-table-column prop="level" label="等级"></el-table-column>
      <el-table-column prop="upid" label="父级ID"></el-table-column>
      <el-table-column prop="record" label="Record"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          <el-button size="mini" type="info" icon="el-icon-info" @click="showDetailForm(prop.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteItem(prop.row)"></el-button>
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
    
    <!-- 弹出层：创建功能 start -->
    <el-dialog title="创建功能" :visible.sync="form.show" :width="'400px'">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="名称">
          <el-input v-model="form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="form.data.level" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级">
          <el-input v-model="form.data.upid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="record">
          <el-input v-model="form.data.record" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建功能 end -->
    
    <!-- 弹出层：修改功能基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="Name">
          <el-input v-model="edit.data.name" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="edit.data.level" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级">
          <el-input v-model="edit.data.upid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="record">
          <el-input v-model="edit.data.record" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改功能基本信息 end -->
  
  </div>
</template>

<script>
  import {
    getRecordListFromApi,
    addRecordItemToApi,
    updateRecordItemToApi,
    deleteRecordItemToApi,
  } from '@/api/record'
  
  import { mapGetters } from 'vuex'
  
  import { filterNullOfObject } from '@/utils/index'
  
  export default {
    created() {
      this.initFetch()
    },
    computed: {
    
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
        },
        labelLoading: false,// 获取标签时的啊loading状态
        // 创建功能
        form: {
          show: false,
          loading: false,
          data: {
            name: null,
            level: null,
            upid: null,
            record: null
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存功能信息
          data: {
            name: null,
            level: null,
            upid: null,
            record: null
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
        this.search.level = this.$route.query.level ? this.$route.query.level : null;
        this.search.upid = this.$route.query.upid ? this.$route.query.upid : null;
        this.loading = true;
        getRecordListFromApi(this.search).then(response => {
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
      // 创建功能
      showAddForm() {
        this.form.show = true;
      },
      // 添加功能
      addItem() {
        this.form.loading = true
        addRecordItemToApi(this.form.data).then(response => {
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
        this.edit.data.level = row.level;
        this.edit.data.upid = row.upid;
        this.edit.data.record = row.record;
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.name = row.name;
        this.edit.data.level = row.level;
        this.edit.data.upid = row.upid;
        this.edit.data.record = row.record;
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true;
        updateRecordItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.name = this.edit.data.name;
          this.edit.row.level = this.edit.data.level;
          this.edit.row.upid = this.edit.data.upid;
          this.edit.row.record = this.edit.data.record;
          // 隐藏表单
          this.edit.show = false;
        }).catch(err => console.log(err)).finally(() => this.edit.loading = false);
      },
      // 删除
      deleteItem(row) {
        this.$confirm(`此操作将删除『${row.name}』题目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteRecordItemToApi(row.id)).then(response => {
          this.table.forEach((item, key) => {
            if (item.id === row.id) {
              this.table.splice(key, 1)
            }
          })
        }).catch(err => console.log(err));
      }
    }
  }
</script>
