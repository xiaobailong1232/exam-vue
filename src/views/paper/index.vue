<template>
  <div class="app-container">
    <!-- 搜索框 start -->
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name" placeholder="请输入名称" @keyup.enter.native="handleSearch"></el-input>
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
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="prop">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(prop.row)"></el-button>
          <el-button size="mini" type="info" icon="el-icon-info" @click="showDetailForm(prop.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteItem(prop.row)"></el-button>
          <el-button size="mini" type="success" icon="el-icon-plus" @click="shwoAddQuestionForm(prop.row)"></el-button>
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
    
    <!-- 弹出层：创建试卷 start -->
    <el-dialog title="创建试卷" :visible.sync="form.show" :width="'600px'">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="名称">
          <el-input v-model="form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.data.comment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建试卷 end -->
    
    <!-- 弹出层：修改试卷基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="Name">
          <el-input v-model="edit.data.name" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="edit.data.comment" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改试卷基本信息 end -->
    
    <!-- 为试卷添加题目 start -->
    <el-dialog :title="'分配题目'" :visible.sync="question.show" width="100%" v-if="question.show">
      <el-button @click="toggleShowPaper" size="mini" type="info">试卷({{ question.selected.length }})</el-button>
      <el-button @click="handleAddQuestionToApi" size="mini" type="primary" :loading="question.addLoading">确认分配</el-button>
      
      <!-- 试卷 start -->
      <el-card class="box-card" style="margin-top:20px;" v-show="question.showPaper">
        <div v-for="(item,index) in question.selected" :key="item.id">
          <el-row>
            <el-col :span="24">
              <span style="font:15px bold;">{{ ++index }} . {{ item.title }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="danger" size="mini" @click="toggleAddQuestion(item)" style="margin-right:5px;">移除</el-button>
              <el-button type="info" size="mini" @click="addQuestionScore(item)" style="margin-right:5px;">（{{ item.score }} 分）</el-button>
            </el-col>
          </el-row>
          <h4 :key="item.id"></h4>
          <el-row v-for="option in item.options" :key="option.id">
            <el-col :span="24">
              <el-tag :type="option.is_answer == 1 ? 'success' : 'info'">{{ transferLetter(option.id) }}.{{ option.content }}</el-tag>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 试卷 end -->
      
      <!-- 搜索框 start -->
      <div class="search-bar" style="margin-top:10px;">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="question.search.title" placeholder="请输入题目名称" @keyup.enter.native="handleQuestionSearch"></el-input>
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
            <el-button type="primary" icon="el-icon-search" @click="handleQuestionSearch"
                       @keyup.enter.native="handleQuestionSearch"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 搜索框 start -->
      
      <!-- 表格数据 start -->
      <el-table :data="question.table" border style="width: 100%" v-loading="question.loading">
        <el-table-column property="id" label="ID" width="50"></el-table-column>
        <el-table-column label="类型" width="50">
          <template slot-scope="prop">
            {{ prop.row.type === 1 ? '单选' : '多选' }}
          </template>
        </el-table-column>
        <el-table-column property="title" label="题目"></el-table-column>
        <el-table-column label="选项">
          <template slot-scope="prop">
            <el-tag v-for="item in prop.row.options" :key="item.id" :type="item.is_answer === 1 ? 'success' : 'info'">{{ item.id }}.{{ item.content }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="prop">
            <el-button v-if="question.selectedIds.contains(prop.row.id)" size="mini" type="danger" @click="toggleAddQuestion(prop.row)">已添加</el-button>
            <el-button v-else @click="toggleAddQuestion(prop.row)" size="mini" type="primary">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格数据 end -->
  
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
    </el-dialog>
    <!-- 为试卷添加题目 end -->
  </div>
</template>

<script>
  import {
    getPaperListFromApi,
    addPaperItemToApi,
    updatePaperItemToApi,
    deletePaperItemToApi,
    restorePaperItemToApi,
  } from '@/api/paper';

  import {
    getQuestionListFromApi
  } from '@/api/question';
  
  import {
    getPaperQuestionListFromApi,
    getPaperQuestionItemFromApi,
    addPaperQuestionItemToApi,
    updatePaperQuestionItemToApi,
    deletePaperQuestionItemToApi
  } from '@/api/paperQuestion';
  
  import { mapGetters } from 'vuex';
  
  import { filterNullOfObject } from '@/utils/index';
  
  export default {
    created() {
      this.initFetch();
      // 读取Labels数据
      if (this.$store.getters.questionBookLabels.length === 0) {
        this.labelLoading = true;
        this.$store.dispatch('fetchLabelList').finally(() => this.labelLoading = false);
      }
      this.fetchQuestionData();
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
        'questionStarLabels',
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
          name: null
        },
        labelLoading: false,// 获取标签时的啊loading状态
        // 创建试卷
        form: {
          show: false,
          loading: false,
          data: {
            name: null,
            comment: null
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存试卷信息
          data: {
            name: null,
            comment: null
          }
        },
        // 问题
        question: {
          loading: false,
          addLoading: false,
          show: false,
          table: [],
          selected: [],
          selectedIds: [],
          showPaper: false,
          row: {},
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
        this.loading = true;
        getPaperListFromApi(this.search).then(response => {
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
      handleSizeChange(val) {
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
      // 创建试卷
      showAddForm() {
        this.form.show = true;
      },
      // 添加试卷
      addItem() {
        this.form.loading = true
        addPaperItemToApi(this.form.data).then(response => {
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
        this.edit.data.comment = row.comment;
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.name = row.name;
        this.edit.data.comment = row.comment;
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true;
        updatePaperItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.name = this.edit.data.name
          this.edit.row.comment = this.edit.data.comment
          this.edit.data.name = null
          this.edit.data.comment = null
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
        })
        .then(() => deletePaperItemToApi(row.id))
        .then(response => {
          this.table.forEach((item, key) => {
            if (item.id === row.id) {
              this.table.splice(key, 1)
            }
          })
        }).catch(err => console.log(err));
      },
      // 切换分页大小
      handleSizeChange(val) {
        this.question.search.size = val;
        this.fetchQuestionData();
      },
      // 当前页切换
      handleCurrentChange(val) {
        this.question.search.page = val;
        this.fetchQuestionData();
      },
      // 搜索
      handleQuestionSearch() {
        this.question.loading = true
        this.fetchQuestionData();
      },
      // 切换试卷
      toggleShowPaper() {
        this.question.showPaper = !this.question.showPaper
      },
      // 展示为试卷添加问题的表单
      shwoAddQuestionForm(row) {
        this.question.show = true;
        this.question.row = row;
      },
      // 在试卷内添加题目
      toggleAddQuestion(row) {
        if (this.question.selectedIds.contains(row.id)) {
          // 去除
          this.question.selectedIds.forEach((item, index) => row.id === item && this.question.selectedIds.splice(index, 1))
          this.question.selected.forEach((item, index) => row.id === item.id && this.question.selected.splice(index, 1))
        } else {
          // 默认设置为5分
          row.score = 5
          this.question.selected.push(row)
          this.question.selectedIds.push(row.id)
        }
      },
      // 转为A\B\C\D
      transferLetter(number) {
        return {'1':'A', '2': 'B', '3':'C', '4':'D'}[number]
      },
      // 读取题目数据
      fetchQuestionData() {
        this.question.loading = true
        const query = filterNullOfObject(this.question.search);
        getQuestionListFromApi(query).then(response => {
          this.question.search.total = Number.parseInt(response.total);
          this.question.table = response.data
          this.question.loading = false
        }).catch(err => console.log(err)).finally(() => this.question.loading = false)
      },
      // 向问卷添加题目
      handleAddQuestionToApi() {
        let data = []
        // 数据整理
        this.question.selected.forEach((item, index) => {
          let row = {}
          row.question_id = item.id
          row.score = item.score
          data.push(row)
        })
        this.question.addLoading = true
        
        addPaperQuestionItemToApi(this.question.row.id, {questions: data})
        .then(response => {
          this.question.row.questions = response.data
          this.question.row = {}
          this.question.selected = []
          this.question.selectedIds = []
          this.question.show = false
        })
        .catch(err => console.log(err))
        .finally(this.question.addLoading = false)
        console.log(data)
      },
      // 添加问题分数
      addQuestionScore(row) {
        this.$prompt('请输入分数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\d{1,2}/,
          inputErrorMessage: '分数格式为数值'
        }).then(({ value }) => {
          row.score = Number.parseInt(value)
          this.question.selected.forEach((item, index) => item.id === row.id && this.question.selected.splice(index, 1, row))
        }).catch((err) => {
          console.log(err)
        });
      }
    }
  }
</script>

<style>
  .el-tag {
    margin-right: 5px;
  }
</style>
