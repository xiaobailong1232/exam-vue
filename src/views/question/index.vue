<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.title" placeholder="请输入题目名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.type" placeholder="请选择类型" filterable clearable>
            <el-option v-for="item in [{id:1, name: '单选'}, {id: 2, name: '多选'}]" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.book" placeholder="请选择书籍" filterable clearable>
            <el-option v-for="item in questionBookLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.chapter" placeholder="请选择章" filterable clearable>
            <el-option v-for="item in questionChapterLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.section" placeholder="请选择节" filterable clearable>
            <el-option v-for="item in questionSectionLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.knowledge" placeholder="请选择知识点" filterable clearable>
            <el-option v-for="item in questionKnowledgeLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.star" placeholder="请选择难度" filterable clearable>
            <el-option v-for="item in questionStarLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
                     @keyup.enter.native="handleSearch"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 start -->
    
    <!-- 操作按钮 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="添加题目" placement="top-start">
            <el-button type="primary" @click="showAddForm" icon="el-icon-plus"></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
        <el-tooltip class="item" effect="dark" content="Excel导入" placement="top-start">
          <router-link :to="{ name: '导入题目' }">
            <el-button class="el-icon-upload"></el-button>
          </router-link>
        </el-tooltip>
      </el-form-item>
        <el-form-item>
            <el-button @click="bacthDeleteToApi" :loading="batchDeleteLoading">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 start -->
    
    <!-- 主要表格 start -->
    <el-table :data="table" border style="width: 100%" v-loading="loading"
              @selection-change="handleSelectionChange">
      <el-table-column type="expand">
      <template slot-scope="prop">
        <div v-for="(item,index) in prop.row.options" :key="index">
          <el-row>
            <el-col :span="24">
              <el-tag :type="item.is_answer ? 'success' : 'info'">{{ index + 1 }} . {{ item.content }}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <img :src="item.image" v-if="item.image" style="height: 150px;">
            </el-col>
          </el-row>
        </div>
      </template>
    </el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="title" label="题目名称" width="300"></el-table-column>
      <el-table-column label="图片" width="400">
        <template slot-scope="prop">
          <el-button size="mini" @click="imageShow = !imageShow">{{ !imageShow ? '展示' : '隐藏' }}</el-button>
          <img :src="prop.row.image" v-if="imageShow && prop.row.image" style="height: 150px;">
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80">
        <template slot-scope="prop">
          <el-tag :type="parseInt(prop.row.type) === 1 ? 'info' : 'warning'">
            {{ parseInt(prop.row.type) === 1 ? '单选' : '多选' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="难度" prop="star" width="60"></el-table-column>
      <el-table-column label="属性">
        <template slot-scope="prop">
          <el-tag v-if="prop.row.labels.length > 0" v-for="item in prop.row.labels" :key="item.id" closable
                  type="primary" @close="removeLabelFromQuestion(prop.row, item)">{{item.name}}
          </el-tag>
          <el-button size="mini" @click="showAddQuestionLabelForm(prop.row)">+ 标签</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="prop">{{ prop.row.user.name }}</template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="prop">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delteItem(prop.row)"></el-button>
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
    
    <!-- 弹出层：创建题目 start -->
    <el-dialog title="创建题目" :visible.sync="form.show" width="1000px">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="题目">
          <el-input v-model="form.data.title" auto-complete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="图片补充">
          <el-tooltip class="item" effect="dark" content="当没有图片时，您可以选择不上传" placement="top-start">
            <qiniu-uploader ref="question" @success="handleQuestionUpload"></qiniu-uploader>
          </el-tooltip>
        </el-form-item>
        
        <el-form-item label="类型">
          <el-select v-model="form.data.type" placeholder="请选择类型">
            <el-option v-for="item in questionTypeLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度星级">
          <el-select v-model="form.data.star" placeholder="请选择类型">
            <el-option v-for="item in questionStarLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-input v-model="form.data.comment" auto-complete="off"></el-input>
        </el-form-item>
        
        <template v-for="(item, index) in form.data.options">
          <el-form-item :label="'选项' + (index + 1)">
            <el-input v-model="form.data.options[index].content" auto-complete="off">
              <el-button slot="prepend" style="color: #FA5555;" icon="el-icon-close"
                         @click="toggleAnswer(form.data.options[index])" v-if="!form.data.options[index].is_answer">错误
              </el-button>
              <el-button slot="prepend" style="color: #67C23A;" icon="el-icon-check"
                         @click="toggleAnswer(form.data.options[index])" v-else>正确
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="图片补充" v-if="index === 0">
            <qiniu-uploader ref="optionA" @success="handleOptionUpload1"></qiniu-uploader>
          </el-form-item>
          <el-form-item label="图片补充" v-if="index === 1">
            <qiniu-uploader ref="optionB" @success="handleOptionUpload2"></qiniu-uploader>
          </el-form-item>
          <el-form-item label="图片补充" v-if="index === 2">
            <qiniu-uploader ref="optionC" @success="handleOptionUpload3"></qiniu-uploader>
          </el-form-item>
          <el-form-item label="图片补充" v-if="index === 3">
            <qiniu-uploader ref="optionD" @success="handleOptionUpload4"></qiniu-uploader>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建题目 end -->
    
    <!-- 弹出层：展示题目详情、修改题目基本信息 start -->
    <el-dialog :visible="edit.show" :show-close="false">
      <div slot="title">
        <el-row>
          <el-col :span="20">
            <span>{{ edit.status ? '编辑' : '详情' }}</span>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <el-button @click="edit.show = false" size="mini" type="text">X</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="题目">
          <el-input v-model="edit.data.title" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        
        <el-form-item label="原图">
          <img :src="edit.data.image" v-if="edit.data.image">
        </el-form-item>
        
        <el-form-item label="重新上传">
          <el-tooltip class="item" effect="dark" content="当没有图片时，您可以选择不上传" placement="top-start">
            <qiniu-uploader ref="editQuestion" @success="editQuestionUpload"></qiniu-uploader>
          </el-tooltip>
        </el-form-item>
        
        <el-form-item label="类型">
          <el-select v-model="edit.data.type" placeholder="请选择类型" :disabled="!edit.status">
            <el-option v-for="item in questionTypeLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度星级" :disabled="edit.status">
          <el-select v-model.number="edit.data.star" placeholder="请选择类型" :disabled="!edit.status">
            <el-option v-for="item in questionStarLabels" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案解析" :disabled="!edit.status">
          <el-input v-model="edit.data.comment" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        
        <template v-for="(item, index) in edit.data.options">
          <el-form-item :label="'选项' + (index + 1)">
            <el-input v-model="edit.data.options[index].content" auto-complete="off">
              <el-button slot="prepend" style="color: #FA5555;" icon="el-icon-close"
                         @click="toggleAnswer(edit.data.options[index])" v-if="!edit.data.options[index].is_answer">错误
              </el-button>
              <el-button slot="prepend" style="color: #67C23A;" icon="el-icon-check"
                         @click="toggleAnswer(edit.data.options[index])" v-else>正确
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="原图" v-if="index === 0">
            <img :src="edit.data.options[index].image" style="width: 200px;"
                 v-if="edit.data.options[index].image">
          </el-form-item>
          <el-form-item label="重新上传" v-if="index === 0">
            <qiniu-uploader ref="editOptionA" @success="editOptionUpload1"></qiniu-uploader>
          </el-form-item>
          <el-form-item label="原图" v-if="index === 1">
            <img :src="edit.data.options[index].image" style="width: 200px;"
                 v-if="edit.data.options[index].image">
          </el-form-item>
          <el-form-item label="重新上传" v-if="index === 1">
            <qiniu-uploader ref="editOptionB" @success="editOptionUpload2"></qiniu-uploader>
          </el-form-item>
          <el-form-item label="原图" v-if="index === 2">
            <img :src="edit.data.options[index].image" style="width: 200px;"
                 v-if="edit.data.options[index].image">
          </el-form-item>
          <el-form-item label="重新上传" v-if="index === 2">
            <qiniu-uploader ref="editOptionC" @success="editOptionUpload3"></qiniu-uploader>
          </el-form-item>
          <el-form-item label="原图" v-if="index === 3">
            <img :src="edit.data.options[index].image" style="width: 200px;"
                 v-if="edit.data.options[index].image">
          </el-form-item>
          <el-form-item label="重新上传" v-if="index === 3">
            <qiniu-uploader ref="editOptionD" @success="editOptionUpload4"></qiniu-uploader>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改题目基本信息 end -->
    
    <!-- 弹出层：添加标签 start -->
    <el-dialog title="添加标签" :visible.sync="label.show" with="400px" height="600px">
      <el-tabs :tab-position="tabPosition" style="height: 200px;" @tab-click="label.data.label_id = null">
        <el-tab-pane label="书籍">
          <el-row :gutter="50">
            <el-col :span="24">
              <el-select v-model="label.data.label_id" placeholder="请选择书籍" :loading="labelLoading" filterable clearable>
                <el-option
                  v-for="item in questionBookLabels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="addLabelToQuestion" :loading="label.loading">添加</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="章">
          <el-row :gutter="50">
            <el-col :span="24">
              <el-select v-model="label.data.label_id" placeholder="请选择章" :loading="labelLoading" filterable clearable>
                <el-option
                  v-for="item in questionChapterLabels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="addLabelToQuestion" :loading="label.loading">添加</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="节">
          <el-row :gutter="50">
            <el-col :span="24">
              <el-select v-model="label.data.label_id" placeholder="请选择节" :loading="labelLoading" filterable clearable>
                <el-option
                  v-for="item in questionSectionLabels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="addLabelToQuestion" :loading="label.loading">添加</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="知识点">
          <el-row :gutter="50">
            <el-col :span="24">
              <el-select v-model="label.data.label_id" placeholder="请选择知识点" :loading="labelLoading" filterable
                         clearable>
                <el-option
                  v-for="item in questionKnowledgeLabels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="addLabelToQuestion" :loading="label.loading">添加</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 弹出层：添加标签 end -->
  </div>
</template>

<script>
  import {
    getQuestionListFromApi,
    addQuestionItemToApi,
    updateQuestionItemToApi,
    deleteQuestionItemToApi,
    batchDeleteQuestionsToApi
  } from '@/api/question'
  
  import QiniuUploader from './qiniu'
  
  import {
    addQuestionLabelItemToApi,
    deleteQuestionLabelItemToApi
  } from '@/api/questionLabel'
  
  import { mapGetters } from 'vuex'
  
  import { filterNullOfObject } from '@/utils/index'
  
  export default {
    components: {
      QiniuUploader
    },
    created() {
      this.initFetch()
      // 读取Labels数据
      if (this.$store.getters.questionBookLabels.length === 0) {
        this.labelLoading = true
        this.$store.dispatch('fetchLabelList').finally(() => {
          this.labelLoading = false
        })
      }
    },
    computed: {
      // 问题属性：书籍、章、节、知识点、难度
      ...mapGetters([
        'questionBookLabels',
        'questionChapterLabels',
        'questionSectionLabels',
        'questionKnowledgeLabels',
        'questionStarLabels',
        'questionTypeLabels'
      ])
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
          chapter: null,
          section: null,
          book: null,
          knowledge: null,
          start: null,
          type: null
        },
        labelLoading: false, // 获取标签时的loading状态
        tabPosition: '0', // 添加标签时的Tab标签页
        imageShow: false, // 展示图片
        // 创建题目
        form: {
          show: false,
          loading: false,
          data: {
            title: null, // 标题
            image: null, // 图片补充
            type: null, // 类型
            comment: null, // 答案解析
            options: [
              { id: 1, content: null, is_answer: 0, image: null },
              { id: 2, content: null, is_answer: 0, image: null },
              { id: 3, content: null, is_answer: 0, image: null },
              { id: 4, content: null, is_answer: 0, image: null }
            ]
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false, // 当false时，不显示。当true是，显示。
          status: false, // 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null, // 保存题目信息
          data: {
            title: null, // 标题
            image: null, // 图片补充
            type: null, // 类型
            comment: null, // 答案解析
            star: null, // 难度
            options: [
              { id: 1, content: null, is_answer: 0, image: null },
              { id: 2, content: null, is_answer: 0, image: null },
              { id: 3, content: null, is_answer: 0, image: null },
              { id: 4, content: null, is_answer: 0, image: null }
            ]
          }
        },
        // 题目选项
        option: {
          show: false,
          status: false,
          loading: false,
          row: null,
          item: null,
          data: {
            content: null,
            is_answer: null
          }
        },
        // 题目标签
        label: {
          show: false, // 当false时，不显示。当true是，显示。
          loading: false,
          row: null, // 保存题目信息
          data: {
            label_id: null
          }
        },
        // 多选
        multipleSelection: [],
        batchDeleteLoading: false
      }
    },
    methods: {
      // 进入页面即读取数据
      initFetch() {
        // 格式化URL参数
        this.search.page = this.$route.query.page ? Number.parseInt(this.$route.query.page) : 1
        this.search.size = this.$route.query.size ? parseInt(this.$route.query.size) : 10
        this.search.title = this.$route.query.title ? this.$route.query.title : null
        this.search.star = this.$route.query.star ? Number.parseInt(this.$route.query.star) : null
        this.search.chapter = this.$route.query.chapter ? Number.parseInt(this.$route.query.chapter) : null // 章
        this.search.section = this.$route.query.section ? Number.parseInt(this.$route.query.section) : null // 节
        this.search.book = this.$route.query.book ? Number.parseInt(this.$route.query.book) : null // 书
        this.search.knowledge = this.$route.query.knowledge ? Number.parseInt(this.$route.query.knowledge) : null // 知识点
        this.search.type = this.$route.query.type ? Number.parseInt(this.$route.query.type) : null // 类型
        this.loading = true
        getQuestionListFromApi(this.search).then(response => {
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
      // 展示创建题目
      showAddForm() {
        this.form.show = true
      },
      // 添加题目
      addItem() {
        this.form.loading = true
        addQuestionItemToApi(this.form.data).then(response => {
          this.table.unshift(response.data)
          this.form.show = false
          this.form.data.title = null
          this.form.data.star = null
          this.form.data.type = null
          this.form.data.comment = null
          this.form.data.options.forEach(item => {
            item.content = null
            item.is_answer = 0
            item.image = null
          })
          this.$refs.question.fileList = []
          this.$refs.optionA[0].fileList = []
          this.$refs.optionB[0].fileList = []
          this.$refs.optionC[0].fileList = []
          this.$refs.optionD[0].fileList = []
        }).catch(err => console.log(err)).finally(() => this.form.loading = false)
      },
      // 详细信息
      showDetailForm(row) {
        this.edit.status = false
        this.edit.show = true
        this.edit.row = row
        this.edit.data.title = row.title
        this.edit.data.type = row.type
        this.edit.data.star = row.star
        this.edit.data.comment = row.comment
        this.edit.data.options = row.options
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true
        this.edit.show = true
        this.edit.row = row
        this.edit.data.image = row.image
        this.edit.data.title = row.title
        this.edit.data.type = row.type
        this.edit.data.star = row.star
        this.edit.data.comment = row.comment
        row.options.forEach((item, index) => {
          this.edit.data.options[index].content = item.content
          this.edit.data.options[index].is_answer = item.is_answer
          this.edit.data.options[index].image = item.image ? item.image : null
        })
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true
        updateQuestionItemToApi(this.edit.row.id, this.edit.data).then((response) => {
          this.$notify.success('操作成功')
          // 截取
          this.table.forEach((item, key) => {
            if (this.edit.row.id === item.id) {
              this.table.splice(key, 1, response.data)
            }
          })
          // 隐藏表单
          this.edit.show = false
          // 原数据更新
          this.edit.data.title = null
          this.edit.data.type = null
          this.edit.data.star = null
          this.edit.data.comment = null
          this.edit.data.options.forEach((item, index) => {
            this.edit.data.options[index].content = null
            this.edit.data.options[index].is_answer = 0
          })
        }).catch(err => console.log(err)).finally(() => {
          this.edit.loading = false
        })
      },
      // 删除
      delteItem(row) {
        this.$confirm(`此操作将删除『${row.title}』题目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteQuestionItemToApi(row.id)).then(response => {
          this.table.forEach((item, key) => {
            if (item.id === row.id) {
              this.table.splice(key, 1)
            }
          })
        }).catch(err => console.log(err))
      },
      // 移除标签
      removeLabelFromQuestion(row, item) {
        this.$confirm(`此操作将删除该题目的『${item.name}』标签, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteQuestionLabelItemToApi(row.id, item.id)).then(response => {
          row.labels.forEach((val, key) => {
            if (val.id === item.id) {
              row.labels.splice(key, 1)
            }
          })
        }).catch(err => console.log(err))
      },
      // 展示添加题目标签表单
      showAddQuestionLabelForm(row) {
        this.label.row = row
        this.label.show = true
      },
      // 添加题目标签
      addLabelToQuestion() {
        this.label.loading = true
        addQuestionLabelItemToApi(this.label.row.id, this.label.data).then(response => {
          this.label.row.labels = []
          response.data.forEach(item => this.label.row.labels.push(item))
          this.label.show = false
          this.label.data.label_id = null // 清空数据
        }).catch(err => console.log(err)).finally(() => {
          this.label.loading = false
        })
      },
      // 转换题目正确与错误
      toggleAnswer(item) {
        item.is_answer === 0 ? item.is_answer = 1 : item.is_answer = 0
      },
      // 题目本身
      handleQuestionUpload(params) {
        this.form.data.image = params.key
      },
      // 题目选项
      handleOptionUpload1(params) {
        this.form.data.options[0].image = params.key
      },
      handleOptionUpload2(params) {
        this.form.data.options[1].image = params.key
      },
      handleOptionUpload3(params) {
        this.form.data.options[2].image = params.key
      },
      handleOptionUpload4(params) {
        this.form.data.options[3].image = params.key
      },
      // 题目本身
      editQuestionUpload(params) {
        this.edit.data.image = params.key
      },
      // 题目选项
      editOptionUpload1(params) {
        this.edit.data.options[0].image = params.key
      },
      editOptionUpload2(params) {
        this.edit.data.options[1].image = params.key
      },
      editOptionUpload3(params) {
        this.edit.data.options[2].image = params.key
      },
      editOptionUpload4(params) {
        this.edit.data.options[3].image = params.key
      },
      // 多选
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val
      },
      // 批量删除
      bacthDeleteToApi() {
        this.batchDeleteLoading = true
        batchDeleteQuestionsToApi(this.multipleSelection).then(response => {
          this.$router.go()
        }).catch(err => console.log(err)).finally(() => {
          this.batchDeleteLoading = false
        })
      }
    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }
  
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
