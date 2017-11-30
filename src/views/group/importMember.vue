<template>
  <div class="app-container">
    <div class="index" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中...">
      <input type="file" @change="importFile(this)" id="imFile" style="display: none"
             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
      <el-button class="button" @click="uploadFile()">导入Excel</el-button>
      <el-button class="button" type="primary" @click="registerUsers" v-if="excelData.length" :loading="loading">批量注册
      </el-button>
      <el-button class="button" type="danger" @click="excelData = []" v-if="excelData.length">清除数据</el-button>
      
      <el-button @click="dialogTableVisible = true">示例表格，点我查看</el-button>
  
      <el-dialog title="示例Excel表格" :visible.sync="dialogTableVisible">
        <el-table :data="example.data" border>
          <el-table-column property="name" label="name"></el-table-column>
          <el-table-column property="phone" label="phone"></el-table-column>
          <el-table-column property="email" label="email"></el-table-column>
        </el-table>
        <el-tag type="danger">表头请使用英文：name、phone、email</el-tag>
      </el-dialog>
      
      <!--错误信息提示-->
      <el-dialog title="提示" v-model="errorDialog" size="tiny">
        <span>{{ errorMsg }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errorDialog=false">确认</el-button>
        </span>
      </el-dialog>
      
      <!--展示导入信息-->
      <el-table :data="excelData" tooltip-effect="dark" border>
        <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="邮箱" prop="email" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机" prop="phone" show-overflow-tooltip></el-table-column>
      </el-table>
      <h3 style="color:red;">批量导入的用户，密码默认为 ： <el-tag type="primary">手机后六位</el-tag> </h3>
    </div>
  </div>
</template>

<script>
  // 引入xlsx
  var XLSX = require('xlsx')
  
  import { batchRegister } from '@/api/user'
  
  export default {
    name: 'ImportMembers',
    data() {
      return {
        dialogTableVisible: false,
        // 加载中
        fullscreenLoading: false,
        // 注册loading
        loading: false,
        // 导入文件el
        imFile: '',
        // 错误信息弹窗
        errorDialog: false,
        // 错误信息内容
        errorMsg: '',
        excelData: [],
        example: {
          show: false,
          data: [
            { name: '张三', email: '11231231@qq.com', phone: '13812341234' },
            { name: '李四', email: 'asdas@qq.com', phone: '18812341234' },
            { name: '王五', email: '123123@qq.com', phone: '19912312312' }
          ]
        }
      }
    },
    mounted() {
      this.imFile = document.getElementById('imFile')
    },
    methods: {
      // 点击导入按钮
      uploadFile() {
        this.imFile.click()
      },
      // 导入excel
      importFile() {
        this.fullscreenLoading = true
        const obj = this.imFile
        if (!obj.files) {
          this.fullscreenLoading = false
          return
        }
        const f = obj.files[0]
        const reader = new FileReader()
        const $t = this
        reader.onload = function (e) {
          const data = e.target.result
          if ($t.rABS) {
            // 手动转化
            $t.wb = XLSX.read(btoa(this.fixdata(data)), {type: 'base64'})
          } else {
            $t.wb = XLSX.read(data, {type: 'binary'})
          }
          const json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
          console.log(typeof json)
          $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
        }
        if (this.rABS) {
          reader.readAsArrayBuffer(f)
        } else {
          reader.readAsBinaryString(f)
        }
      },
      // 此处可以解析导入数据
      analyzeData: function (data) {
        return data
      },
      // 处理导入的数据
      dealFile: function (data) {
        console.log(data)
        this.imFile.value = ''
        this.fullscreenLoading = false
        if (data.length <= 0) {
          this.errorDialog = true
          this.errorMsg = '请导入正确信息'
        } else {
          this.excelData = data
        }
      },
      // 文件流转BinaryString
      fixdata: function (data) {
        let o = ''
        let l = 0
        const w = 10240
        for (; l < data.byteLength / w; ++l) {
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        }
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },
      // 批量注册用户
      registerUsers() {
        if (this.excelData.length === 0) {
          this.$message.error('注册用户不能为空')
          return false
        }
        // 查重
        if (this.uniqueArray(this.excelData, 'name') && this.uniqueArray(this.excelData, 'phone') && this.uniqueArray(this.excelData, 'email')) {
          this.loading = true
          // 调用接口进行注册
          batchRegister(this.$route.params.groupId, this.excelData).then(() => {
            this.$message.success('批量导入成功')
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.loading = false
          })
          
        }
      },
      // 数组去重
      uniqueArray(data, key) {
        const first = data[0][key]
        console.log(data)
        return data.every((item, index) => {
          console.log(item[key], first, index)
          if (item[key] === first && index !== 0) {
            this.$message.error(item[key] + '，重复了！')
            return false
          } else {
            return true
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-table th > .cell {
    text-align: center;
  }
  
  .button {
    margin-bottom: 20px;
  }
</style>
