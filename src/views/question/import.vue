<template>
  <div class="app-container">
    <div class="index" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中...">
      <input type="file" @change="importFile(this)" id="imFile" style="display: none"
             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
      <el-button class="button" @click="uploadFile()">导入Excel</el-button>
      <el-button class="button" type="primary" @click="addQuestions" v-if="excelData.length" :loading="loading">批量添加</el-button>
      <el-button class="button" type="danger" @click="excelData = []" v-if="excelData.length">清除数据</el-button>
      
      <el-button @click="dialogTableVisible = true">示例表格，点我查看</el-button>
  
      <el-dialog title="示例Excel表格" :visible.sync="dialogTableVisible" width="100%">
        <el-table :data="example.data" tooltip-effect="dark" border>
          <el-table-column label="title" prop="title" show-overflow-tooltip></el-table-column>
          <el-table-column label="type" prop="type" show-overflow-tooltip></el-table-column>
          <el-table-column label="star" prop="star" show-overflow-tooltip></el-table-column>
          <el-table-column label="comment" prop="comment" show-overflow-tooltip></el-table-column>
          <el-table-column label="1" prop="1" show-overflow-tooltip></el-table-column>
          <el-table-column label="2" prop="2" show-overflow-tooltip></el-table-column>
          <el-table-column label="3" prop="3" show-overflow-tooltip></el-table-column>
          <el-table-column label="4" prop="4" show-overflow-tooltip></el-table-column>
          <el-table-column label="answer" prop="answer" show-overflow-tooltip></el-table-column>
          <el-table-column label="book" prop="book" show-overflow-tooltip></el-table-column>
          <el-table-column label="chapter" prop="chapter" show-overflow-tooltip></el-table-column>
          <el-table-column label="section" prop="section" show-overflow-tooltip></el-table-column>
        </el-table>
        <p><el-tag type="primary">title：题目；type：题目类型；star：题目难度；comment：答案解析；1：选项1，2：选项2；3：选项3；4：选项4；answer：答案；book：所属书籍；chapter：所属章；section：所属节</el-tag></p>
        <p><el-tag type="danger">* 题目类型：1（单选），2（多选）</el-tag></p>
        <p><el-tag type="danger">* 难度选项：1，2，3，4，5</el-tag></p>
        <p><el-tag type="danger">* 答案选项对应的选项：1，2，3，4，当多选题时，只需要连写数字即可</el-tag></p>
        <p><el-tag type="danger">* 书籍、章、节必须与系统中设定的值一致，比如系统中有"中国近代史"，那么在这我必须写"中国近代史"，否则会录入失败</el-tag></p>
        <p><el-tag type="danger">* 表头请使用英文</el-tag></p>
      </el-dialog>
      
      <!--错误信息提示-->
      <el-dialog title="提示" v-model="errorDialog">
        <span>{{ errorMsg }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errorDialog=false">确认</el-button>
        </span>
      </el-dialog>
      
      <!-- 展示导入信息 start-->
      <el-table :data="excelData" tooltip-effect="dark" border>
        <el-table-column label="题目" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" show-overflow-tooltip>
          <template slot-scope="prop">
            <el-button v-if="parseInt(prop.row.type) === 1" size="mini" type="primary">单选</el-button>
            <el-button v-else size="mini" type="warning">多选</el-button>
          </template>
        </el-table-column>
        <el-table-column label="难度" prop="star" show-overflow-tooltip></el-table-column>
        <el-table-column label="答案解析" prop="comment" show-overflow-tooltip></el-table-column>
        <el-table-column label="选项1" prop="1" show-overflow-tooltip></el-table-column>
        <el-table-column label="选项2" prop="2" show-overflow-tooltip></el-table-column>
        <el-table-column label="选项3" prop="3" show-overflow-tooltip></el-table-column>
        <el-table-column label="选项4" prop="4" show-overflow-tooltip></el-table-column>
        <el-table-column label="答案" prop="answer" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属书籍" prop="book" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属章" prop="chapter" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属节" prop="section" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="prop">
            <el-tooltip class="item" effect="dark" content="删除此行数据" placement="top-start">
              <el-button icon="el-icon-delete" type="danger" size="mini" @click="deleteRow(prop.row)"></el-button>
            </el-tooltip>
            <!--<el-tooltip class="item" effect="dark" content="编辑此行数据" placement="top-start">-->
              <!--<el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditRow(prop.row)"></el-button>-->
            <!--</el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 展示导入信息 end-->
      
      <!-- 弹出层：修改用基本信息 start -->
      <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
        <el-form :model="edit.data" :label-width="'120px'">
          <el-form-item label="title">
            <el-input v-model="edit.data.title" auto-complete="off" :disabled="!edit.status"></el-input>
          </el-form-item>
          <el-form-item label="type">
            <el-input v-model="edit.data.type" auto-complete="off" :disabled="!edit.status"></el-input>
          </el-form-item>
          <el-form-item label="star">
            <el-input v-model="edit.data.star" auto-complete="off" :disabled="!edit.status"></el-input>
          </el-form-item>
          <el-form-item label="comment">
            <el-input v-model="edit.data.comment" auto-complete="off" :disabled="!edit.status"></el-input>
          </el-form-item>
          <el-form-item label="1">
            <el-input v-model="edit.data[1]" auto-complete="off" :disabled="!edit.status" placeholder="选项1"></el-input>
          </el-form-item>
          <el-form-item label="2">
            <el-input v-model="edit.data[2]" auto-complete="off" :disabled="!edit.status" placeholder="选项2"></el-input>
          </el-form-item>
          <el-form-item label="3">
            <el-input v-model="edit.data[3]" auto-complete="off" :disabled="!edit.status" placeholder="选项3"></el-input>
          </el-form-item>
          <el-form-item label="4">
            <el-input v-model="edit.data[4]" auto-complete="off" :disabled="!edit.status" placeholder="选项4"></el-input>
          </el-form-item>
          <el-form-item label="answer">
            <el-input v-model="edit.data.answer" auto-complete="off" :disabled="!edit.status" placeholder="1"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-show="edit.status">
          <el-button @click="edit.show = false">取 消</el-button>
          <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层：修改基本信息 end -->
    </div>
  </div>
</template>

<script>
  // 引入xlsx
  var XLSX = require('xlsx')
  
  import { batchAddQuestionsToApi } from '@/api/question'
  
  export default {
    name: 'ImportQuestions',
    created() {
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
      }
    },
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
            { title: '“大煮干丝”是哪个菜系的代表菜之一？', type: 1, star: 1, comment: '略', 1: '川菜', 2: '鲁菜', 3: '粤菜', 4: '淮扬菜', answer: 2, book: '厨子的笔记', chapter: '第十章', section: '第三节' },
            { title: '下列作品出自李贽的是？', type: 2, star: 3, comment: '李贽的作品有《焚书》、《西湖寻梦》', 1: '《焚书》', 2: '《西湖寻梦》', 3: '《高太史全集》', 4: '《续焚烧书》', answer: 12, book: '史记', chapter: '第一章', section: '第二节' }
          ]
        },
        // 编辑表单数据
        edit: {
          status: true,
          row: null,
          show: false,
          loading: false,
          data: {
            title: '',
            type: '',
            star: '',
            comment: '',
            1: '',
            2: '',
            3: '',
            4: '',
            answer: '',
            book: '',
            chapter: '',
            section: ''
          }
        },
        // 提交表单的数据
        myArray: []
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
        reader.onload = function(e) {
          const data = e.target.result
          if ($t.rABS) {
            // 手动转化
            $t.wb = XLSX.read(btoa(this.fixdata(data)), { type: 'base64' })
          } else {
            $t.wb = XLSX.read(data, { type: 'binary' })
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
      analyzeData: function(data) {
        return data
      },
      // 处理导入的数据
      dealFile: function(data) {
        this.imFile.value = ''
        this.fullscreenLoading = false
        if (data.length <= 0) {
          this.errorDialog = true
          this.errorMsg = '请导入正确信息'
        } else {
          this.excelData = data
          this.$message.success('导入完成，检查数据成功')
          this.manageData(data)
        }
      },
      // 文件流转BinaryString
      fixdata: function(data) {
        let o = ''
        let l = 0
        const w = 10240
        for (; l < data.byteLength / w; ++l) {
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        }
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },
      // 批量添加题目
      addQuestions() {
        // 查重
        if (this.uniqueArray(this.myArray, 'title')) {
          this.loading = true
          // 调用接口进行注册
          batchAddQuestionsToApi(this.myArray).then(() => {
            this.$message.success('批量导入成功')
            this.excelData = []
            this.$confirm('导入完成，是否立即跳转到题目列表?', '提示', {
              confirmButtonText: '立即跳转',
              cancelButtonText: '留在此页',
              type: 'warning'
            }).then(() => {
              this.$router.push({ name: '题目管理' })
            }).catch((err) => {
              console.log(err)
            })
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
      },
      // 去除一行数据
      deleteRow(row) {
        this.excelData.forEach((item, index) => {
          if (row.phone === item.phone) {
            this.excelData.splice(index, 1)
          }
        })
      },
      // 展示编辑表单
      showEditRow(row) {
        this.edit.row = row
        this.edit.show = true
        this.edit.data.name = row.name
        this.edit.data.phone = row.phone
        this.edit.data.email = row.email
      },
      // 更新信息
      updateItem() {
        this.edit.row.name = this.edit.data.name
        this.edit.row.email = this.edit.data.email
        this.edit.row.phone = this.edit.data.phone
        this.$message.success('更新成功')
        this.edit.show = false
      },
      // 根据名字筛选标签id
      getLabelIdByName(name) {
        const label = this.$store.state.label.list.filter(row => row.name === name)
        if (label.length === 0) {
          return false
        } else {
          return label[0]
        }
      },
      // 整理数据
      manageData(data) {
        data.forEach(item => {
          const question = {}
          const labels = []
          if (item.book) {
            const bookLabel = this.getLabelIdByName(item.book)
            if (!bookLabel) {
              this.$message.error(item.book + '书籍不在系统之中，请添加后再导入')
              return false
            } else {
              labels.push(bookLabel.id)
            }
          }
          if (item.chapter) {
            const chapterLabel = this.getLabelIdByName(item.chapter)
            if (!chapterLabel) {
              this.$message.error(item.chapter + ' 属性不在系统之中，请添加后再导入')
              return false
            } else {
              labels.push(chapterLabel.id)
            }
          }
          if (item.section) {
            const sectionLabel = this.getLabelIdByName(item.section)
            if (!sectionLabel) {
              this.$message.error(item.section + ' 属性不在系统之中，请添加后再导入')
              return false
            } else {
              labels.push(sectionLabel.id)
            }
          }
          question.title = item.title
          question.type = item.type
          question.star = item.star
          question.comment = item.comment
          if (item.answer.length > 1) {
            // 答案为多个
            const answers = item.answer.split('')
            question.options = [
              { id: 1, content: item[1], is_answer: answers.includes('1') ? 1 : 0 },
              { id: 2, content: item[2], is_answer: answers.includes('2') ? 1 : 0 },
              { id: 3, content: item[3], is_answer: answers.includes('3') ? 1 : 0 },
              { id: 4, content: item[4], is_answer: answers.includes('4') ? 1 : 0 }
            ]
          } else {
            // 答案为单个
            question.options = [
              { id: 1, content: item[1], is_answer: item.answer === '1' ? 1 : 0 },
              { id: 2, content: item[2], is_answer: item.answer === '2' ? 1 : 0 },
              { id: 3, content: item[3], is_answer: item.answer === '3' ? 1 : 0 },
              { id: 4, content: item[4], is_answer: item.answer === '4' ? 1 : 0 }
            ]
          }
          question.labels = labels
          this.myArray.push(question)
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
