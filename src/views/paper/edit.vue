<template>
  <div class="app-container">
    <!-- 试卷展示 start -->
    <el-card class="box-card" v-loading="paper.loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix">
        <el-button type="text" icon="el-icon-minus" style="font-size:18px;" v-if="paper.show" @click="togglePaperShow"></el-button>
        <el-button type="text" icon="el-icon-plus" style="font-size:18px;" v-else @click="togglePaperShow"></el-button>
        <span class="title">试卷：{{ paper.item.name }}</span>
        <el-button style="float: right" type="primary" @click="updatePaperQuestion" :loading="updateLoading">确认修改</el-button>
      </div>
     
      <el-row v-for="(question, index) in selectedItems" :key="index" v-show="paper.show">
        <el-col :span="24" style="margin-bottom: 10px;">
          <span style="font-weight: bold">{{ (index + 1) }}</span> . {{ question.title }}
          <el-button size="mini" type="danger" @click="removeQuestionFromPaper(question.id)">移除</el-button>
          <el-button size="mini" type="info" @click="markToQuestion(question)">{{ question.score }} 分</el-button>
        </el-col>
        <el-col :span="24" v-for="option in question.options" :key="option.id" style="margin-bottom: 5px;">
          <el-tag :type="option.is_answer ? 'success' : 'info'">
            {{ String.fromCharCode(64 + option.id) }} . {{ option.content }}
          </el-tag>
          <img :src="option.image" v-if="option.image" style="height: 150px;">
        </el-col>
      </el-row>
    </el-card>
    <!-- 试卷展示 end -->
    
  <!-- 题目展示 start -->
    <div style="padding: 10px;border:1px solid #e6ebf5;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);border-radius: 3px;">
      <p>
        <el-button type="text" icon="el-icon-minus" style="font-size:18px;" v-if="question.show" @click="toggleQuestionShow"></el-button>
        <el-button type="text" icon="el-icon-plus" style="font-size:18px;" v-else @click="toggleQuestionShow"></el-button>
        <span class="title">题目添加</span>
      </p>
      <div v-show="question.show">
        <!-- 搜索框 start -->
        <div class="search-bar">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="question.search.title" placeholder="请输入题目名称" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="question.search.type" placeholder="请选择类型" filterable clearable>
                <el-option v-for="item in [{id:1, name: '单选'}, {id: 2, name: '多选'}]" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="question.search.book" placeholder="请选择书籍" filterable clearable>
                <el-option v-for="item in questionBookLabels" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="question.search.chapter" placeholder="请选择章" filterable clearable>
                <el-option v-for="item in questionChapterLabels" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="question.search.section" placeholder="请选择节" filterable clearable>
                <el-option v-for="item in questionSectionLabels" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="question.search.knowledge" placeholder="请选择知识点" filterable clearable>
                <el-option v-for="item in questionKnowledgeLabels" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="question.search.star" placeholder="请选择难度" filterable clearable>
                <el-option v-for="number in 5" :key="number" :label="number" :value="number"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch"
                         @keyup.enter.native="handleSearch"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 搜索框 start -->
  
        <!-- 主要表格 start -->
        <el-table :data="question.table" border style="width: 100%" v-loading="question.loading">
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
                    <img :src="item.image" v-if="item.image">
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="title" label="题目名称" width="500"></el-table-column>
          <el-table-column label="图片" width="400">
            <template slot-scope="prop">
              <el-button size="mini" @click="imageShow = !imageShow">{{ !imageShow ? '展示' : '隐藏' }}</el-button>
              <img :src="prop.row.image" v-if="imageShow && prop.row.image">
            </template>
          </el-table-column>
          <el-table-column label="类型" width="80">
            <template slot-scope="prop">
              <el-tag :type="parseInt(prop.row.type) === 1 ? 'info' : 'warning'">
                {{ parseInt(prop.row.type) === 1 ? '单选' : '多选' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="属性">
            <template slot-scope="prop">
              <el-tag v-if="prop.row.labels.length > 0" v-for="item in prop.row.labels" :key="item.id" type="primary">{{item.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="prop">
              <el-button size="mini" type="danger" @click="removeQuestionFromPaper(prop.row.id)" v-if="isSelected(prop.row.id)">从试卷移除</el-button>
              <el-button size="mini" type="primary" @click="addQuestionToPaper(prop.row)" v-else>添加到试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 主要表格 start -->
  
        <!-- 分页 start -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="question.search.page"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="question.search.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="question.search.total">
        </el-pagination>
        <!-- 分页 end -->
      </div>
    </div>
    
  <!-- 题目展示 end -->
  </div>
</template>

<script>
  import { getPaperItemFromApi } from '@/api/paper'
  import { addPaperQuestionItemToApi } from '@/api/paperQuestion'
  import { getQuestionListFromApi } from '@/api/question'
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'exam-paper',
    created() {
      this.initFetch()
      this.fetchQuestion()
      // 读取Labels数据
      if (this.$store.getters.questionBookLabels.length === 0) {
        this.labelLoading = true
        this.$store.dispatch('fetchLabelList').finally(() => this.labelLoading = false);
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
        'questionTypeLabels',
        'questionStarLabels'
      ])
    },
    data() {
      return {
        paper: {
          show: true,
          loading: false,
          item: {}
        },
        question: {
          show: true,
          loading: false,
          table: [],
          search: {
            page: 1,
            size: 10,
            total: 0,
            title: null,
            chapter: null,
            section: null,
            book: null,
            knowledge: null,
            star: null,
            type: null
          }
        },
        selectedItems: [],// 存储被选中的对象信息
        updateLoading: false,// 更新Loading
        imageShow: false
      }
    },
    methods: {
      // 初始化读取问卷信息
      initFetch() {
        this.paper.loading = true
        getPaperItemFromApi(this.$route.params.paperId).then(response => {
          this.paper.item = response.data
          // 数据转换
          response.data.questions.forEach(item => {
            const row = { id: item.id, title: item.title, options: item.options, score: item.pivot.score}
            this.selectedItems.push(row)
          })
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.paper.loading = false
        })
      },
      // 切换试卷展示
      togglePaperShow() {
        this.paper.show = !this.paper.show
      },
      // 切换问题展示
      toggleQuestionShow() {
        this.question.show = !this.question.show
      },
      // 读取题目信息
      fetchQuestion() {
        // 格式化URL参数
        this.question.loading = true
        getQuestionListFromApi(this.question.search).then(response => {
          this.question.search.total = Number.parseInt(response.total)
          this.question.table = response.data
        }).catch(err => console.log(err)).finally(() => this.question.loading = false)
      },
      // 切换分页大小
      handleSizeChange(val) {
        this.question.search.size = val
        this.fetchQuestion()
      },
      // 当前页切换
      handleCurrentChange(val) {
        this.question.search.page = val
        this.fetchQuestion()
      },
      // 搜索
      handleSearch() {
        this.fetchQuestion()
      },
      // 向试卷中添加问题
      addQuestionToPaper(question) {
        question.score = 5
        this.selectedItems.push(question)
      },
      // 移除试卷的问题
      removeQuestionFromPaper(questionId) {
        this.selectedItems.forEach((question, index) => {
          questionId === question.id && this.selectedItems.splice(index, 1)
        })
      },
      // 判断是否存在
      isSelected(questionId) {
        return this.selectedItems.some(item => item.id === questionId)
      },
      // 向问题设置分数
      markToQuestion(row) {
        this.$prompt('请输入分数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d{1,3}$/,
          inputErrorMessage: '分数格式为数值'
        }).then(({ value }) => {
          row.score = Number.parseInt(value)
          this.selectedItems.forEach((item, index) => item.id === row.id && this.selectedItems.splice(index, 1, row))
        }).catch((err) => {
          console.log(err)
        })
      },
      // 更新问题到试卷之中
      updatePaperQuestion() {
        // 数据整理
        const data = []
        this.selectedItems.forEach(item => data.push({ question_id: item.id, score: item.score }))
        this.updateLoading = true
        addPaperQuestionItemToApi(this.$route.params.paperId, data).then(response => {
          console.log('更新成功')
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.updateLoading = false
        })
      }
    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: bold
  }
</style>
