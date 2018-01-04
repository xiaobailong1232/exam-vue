<template>
  <div class="app-container">
      <div v-for="row in getLabelByUpid(0)">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="color: #2D2F33;">
            <span>{{ row.name }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="updateItem(row)">&nbsp;&nbsp;修改&nbsp;&nbsp;</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addItemTwo(row)">&nbsp;&nbsp;新增&nbsp;&nbsp;</el-button>
          </div>
          
          <el-collapse v-model="activeId" accordion v-if="table.length > 0" v-loading="!table.length" style="border-left: #c0ccda;">
            <el-collapse-item v-for="item in getLabelByUpid(row.id)" :key="item.id" :name="item.id">
              <template slot="title">
                {{ item.name }}
                <div style="float:right;margin-right:4rem;">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateItem(item)"></el-button>
                </div>
              </template>
              <div v-for="son in getLabelByUpid(item.id)">
                <el-row>
                  <el-col :span="24">
                    <el-button size="mini">{{ son.name }}</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateItem(son)"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteItem(son)"></el-button>
                  </el-col>
                </el-row>
              </div>
              <el-row>
                <el-col :span="24">
                  <el-input size="mini" v-model="label.data.name" style="width:200px;"></el-input>
                  <el-button @click="addItem(item)" size="mini" type="success">添加</el-button>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </div>
</template>

<script>
  import {
    updateLabelItemToApi,
    deleteLabelItemToApi
  } from '@/api/label'
  
  export default {
    created() {
      this.initFetch()
    },
    data() {
      return {
        // 基础数据
        table: [],
        activeId: null,
        label: {
          loading: false,
          data: {
            name: null,
            upid: null,
            level: null
          }
        },
        edit: {
          loading: false,
          data: {
            name: null,
            upid: null,
            level: null
          }
        }
      }
    },
    methods: {
      // 进入页面即读取数据
      initFetch() {
        if (this.$store.state.label.list.length === 0) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.$store.dispatch('fetchLabelList').then(response => {
            this.table = this.$store.state.label.list
          }).catch(err => console.log(err)).finally(() => {
            loading.close()
          })
        } else {
          this.table = this.$store.state.label.list
        }
      },
      // 添加标签
      addItem(row) {
        this.label.loading = true
        this.label.data.upid = row.id
        this.label.data.level = (row.level + 1)
        this.$message.info('正在添加中...')
        this.$store.dispatch('addLabelItem', this.label.data).then(() => {
          this.$message.success('添加成功')
          this.label.data.name = null
        }).catch(err => console.log(err)).finally(() => {
          this.label.loading = false
        })
      },
      // 更新信息
      updateItem(row) {
        this.$prompt('您正在更改标签，请输入标签名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{1,}/,
          inputErrorMessage: '最小长度为1'
        }).then(({ value }) => {
          this.edit.loading = true
          this.edit.data.name = value
          this.edit.data.level = row.level
          this.edit.data.upid = row.upid
          this.$message.info('正在修改中...')
          return updateLabelItemToApi(row.id, this.edit.data)
        }).then(() => {
          // 原数据更新
          row.name = this.edit.data.name
          row.level = this.edit.data.level
          row.upid = this.edit.data.upid
          this.$message.success('修改成功...')
          this.edit.show = false
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.edit.loading = false
        })
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
      // 根据upid获取标签
      getLabelByUpid(upid) {
        return this.table.filter(item => {
          return item.upid === upid
        })
      },
      // 添加二级标签
      addItemTwo(row) {
        this.$prompt('您正在添加标签，请输入标签名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{1,}/,
          inputErrorMessage: '最小长度为1'
        }).then(({ value }) => {
          this.edit.loading = true
          const data = {
            name: value,
            upid: row.id,
            level: row.level
          }
          this.$message.info('正在添加中...')
          this.$store.dispatch('addLabelItem', data)
        }).then(() => {
          this.$message.success('添加成功')
        }).catch(err => console.log(err))
      }
    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 5px;
  }
</style>
