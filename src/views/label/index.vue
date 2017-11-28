<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-row>
        <el-col :span="4">
          <el-input v-model="search.name" placeholder="请输入名称" width="90%" @keyup.enter.native="handleSearch"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 操作按钮 start -->
    <div class="search-bar" style="margin-top: 10px;">
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
      <el-table-column prop="name" label="名称" width="180">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="查看子集" placement="top">
            <el-button size="mini" @click="showSon(prop.row)">{{ prop.row.name }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="查看同级标签" placement="top">
            <el-button size="mini" @click="showPeer(prop.row)">{{ prop.row.level }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="upid" label="父级ID">
        <template slot-scope="prop">
          <el-tooltip class="item" effect="dark" content="查看父级标签" placement="top">
            <el-button size="mini" @click="showFather(prop.row)">{{ prop.row.upid }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)" v-if="prop.row.level > 2"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteItem(prop.row)" v-if="prop.row.level > 2"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 主要表格 start -->
    
    <!-- 弹出层：创建标签 start -->
    <el-dialog title="创建标签" :visible.sync="form.show" :width="'1000px'">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="名称">
          <el-input v-model="form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级">
          <el-radio-group v-model="form.data.upid">
            <el-radio-button v-for="item in levelEqualTwo" :key="item.id" :value="item.id" :label="item.id">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建标签 end -->
    
    <!-- 弹出层：修改标签基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="名称">
          <el-input v-model="edit.data.name" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="父级">
          <el-radio-group v-model="edit.data.upid">
            <el-radio-button v-for="item in levelEqualTwo" :key="item.id" :value="item.id" :label="item.id">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改标签基本信息 end -->
  
  </div>
</template>

<script>
  import {
    updateLabelItemToApi,
    deleteLabelItemToApi
  } from '@/api/label'
  
  import { mapGetters } from 'vuex'
  
  export default {
    created() {
      this.initFetch()
    },
    computed: {
      ...mapGetters(['levelEqualTwo'])
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
          name: null
        },
        labelLoading: false, // 获取标签时的啊loading状态
        // 创建标签
        form: {
          show: false,
          loading: false,
          data: {
            name: null,
            level: null,
            upid: null
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false, // 当false时，不显示。当true是，显示。
          status: false, // 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null, // 保存标签信息
          data: {
            name: null,
            level: null,
            upid: null
          }
        }
      }
    },
    methods: {
      // 进入页面即读取数据
      initFetch() {
        if (this.$store.state.label.list.length === 0) {
          this.loading = true
          this.$store.dispatch('fetchLabelList').then(response => {
            this.table = this.$store.state.label.list
          }).catch(err => console.log(err)).finally(() => {
            this.loading = false
          })
        } else {
          this.table = this.$store.state.label.list
        }
      },
      // 创建标签
      showAddForm() {
        this.form.show = true
      },
      // 添加标签
      addItem() {
        this.form.loading = true
        this.$store.state.label.list.forEach(item => {
          if (parseInt(item.id) === parseInt(this.form.data.upid)) {
            this.form.data.level = parseInt(item.level) + 1
          }
        })
        this.$store.dispatch('addLabelItem', this.form.data).then(response => {
          this.table.unshift(response.data)
          this.form.show = false
        }).catch(err => console.log(err)).finally(() => {
          this.form.loading = false
        })
      },
      // 详细信息
      showDetailForm(row) {
        this.edit.status = false
        this.edit.show = true
        this.edit.row = row
        this.edit.data.name = row.name
        this.edit.data.level = row.level
        this.edit.data.upid = row.upid
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true
        this.edit.show = true
        this.edit.row = row
        this.edit.data.name = row.name
        this.edit.data.level = row.level
        this.edit.data.upid = row.upid
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true
        updateLabelItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.name = this.edit.data.name
          this.edit.row.level = this.edit.data.level
          this.edit.row.upid = this.edit.data.upid
          // 隐藏表单
          this.edit.show = false
        }).catch(err => console.log(err)).finally(() => this.edit.loading = false)
      },
      // 删除
      deleteItem(row) {
        this.$confirm(`此操作将删除『${row.name}』题目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteLabelItemToApi(row.id)).then(response => {
          this.table.forEach((item, key) => {
            if (item.id === row.id) {
              this.table.splice(key, 1)
            }
          })
        }).catch(err => console.log(err))
      },
      // 查看子集
      showSon(row) {
        console.log(row)
        const rows = this.$store.state.label.list.filter(item => item.upid === row.id)
        if (rows.length === 0) {
          this.$message.warning('没有子级了')
        } else {
          this.table = rows
        }
      },
      // 展示父级
      showFather(row) {
        if (row.upid === 0) {
          this.$message.warning('已经是顶级了')
          this.table = this.$store.state.label.list
        } else {
          const rows = this.$store.state.label.list.filter(item => Number.parseInt(item.id) === row.upid)
          if (rows.length === 0) {
            this.$message.warning('没有父级了')
          } else {
            this.table = rows
          }
        }
      },
      // 搜索
      handleSearch() {
        if (this.search.name) {
          const rows = this.$store.state.label.list.filter(item => item.name.indexOf(this.search.name) >= 0)
          if (rows.length === 0) {
            this.$message.warning('没有任何匹配项')
          } else {
            this.table = rows
          }
        } else {
          this.table = this.$store.state.label.list
        }
      },
      // 展示同级
      showPeer(row) {
        console.log(row)
        this.table = this.$store.state.label.list.filter(item => item.level === row.level)
      }
    }
  }
</script>
