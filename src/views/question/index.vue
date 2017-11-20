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
            <el-option v-for="item in [{id:1, name: '单选'}, {id: 2, name: '多选'}]" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.book" placeholder="请选择书籍" filterable clearable>
            <el-option v-for="item in questionBookLabels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.chapter" placeholder="请选择章" filterable clearable>
            <el-option v-for="item in questionChapterLabels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.section" placeholder="请选择节" filterable clearable>
            <el-option v-for="item in questionSectionLabels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.section" placeholder="请选择知识点" filterable clearable>
            <el-option v-for="item in questionKnowledgeLabels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.star" placeholder="请选择难度" filterable clearable>
            <el-option v-for="number in 5" :key="number" :label="number" :value="number"></el-option>
          </el-select>
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
      <el-table-column type="expand">
        <template slot-scope="prop">
          <div>
            <el-row>
              <el-col :span="24">
                <el-button type="primary" size="small" @click="showAddOptionForm(prop.row)" icon="el-icon-plus"></el-button>
              </el-col>
            </el-row>
            
            <el-row v-for="(item,index) in prop.row.options" :key="index" :span="24">
              <el-col>
                <el-button @click="removeOptionFromQuestion(prop.row, item)" icon="el-icon-delete" type="danger" size="mini" round></el-button>
                <el-button @click="removeAnswerFromQuestion(prop.row, item)" v-if="item.is_right"  type="warning" icon="el-icon-close" size="mini" round></el-button>
                <el-button @click="setAnswerToQuestion(prop.row, item)" v-else icon="el-icon-check" type="info" size="mini" round></el-button>
                <el-tag :type="item.is_right ? 'success' : 'info'">{{ index + 1 }} . {{ item.content }}</el-tag>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="title" label="题目名称" width="500"></el-table-column>
      <el-table-column label="类型" width="80">
        <template slot-scope="prop">
          <el-tag :type="parseInt(prop.row.type) === 1 ? 'info' : 'warning'">{{ parseInt(prop.row.type) === 1 ? '单选' : '多选' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="属性">
        <template slot-scope="prop">
          <el-tag v-if="prop.row.labels.length > 0" v-for="item in prop.row.labels" :key="item.id" closable type="primary" @close="removeLabelFromQuestion(prop.row, item)">{{item.name}}</el-tag>
          <el-button size="mini" @click="showAddQuestionLabelForm(prop.row)">+ 标签</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="prop">
          <el-button  v-if="prop.row.possessors.length > 0" v-for="item in prop.row.possessors" :key="item.id" size="mini" type="primary">{{ item.possessor }}</el-button>
          <el-button  v-if="prop.row.possessors.length === 0" size="mini" type="danger">无</el-button>
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
    
    <!-- 弹出层：创建题目 start -->
    <el-dialog title="创建题目" :visible.sync="form.show" :width="'400px'">
      <el-form :model="form.data" :label-width="'100px'">
        <el-form-item label="题目">
          <el-input v-model="form.data.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.data.type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="难度">
          <el-input v-model="form.data.star" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-input v-model="form.data.comment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="addItem" :loading="form.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：创建题目 end -->
    
    <!-- 弹出层：展示题目详情、修改题目基本信息 start -->
    <el-dialog :title="edit.status ? '编辑' : '详情'" :visible.sync="edit.show">
      <el-form :model="edit.data" :label-width="'120px'">
        <el-form-item label="题目">
          <el-input v-model="edit.data.title" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="edit.data.type" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="难度">
          <el-input v-model="edit.data.star" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-input v-model="edit.data.comment" auto-complete="off" :disabled="!edit.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="edit.status">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateItem" :loading="edit.loading">更新</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：修改题目基本信息 end -->
    
    <!-- 弹出层：添加标签 start -->
    <el-dialog title="添加标签" :visible.sync="label.show" with="400px" height="600px">
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
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
              <el-select v-model="label.data.label_id" placeholder="请选择知识点" :loading="labelLoading" filterable clearable>
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
  
    <!-- 弹出层：添加题目选项 start -->
    <el-dialog title="添加题目选项" :visible.sync="option.show" :width="'400px'">
      <el-form :model="option.data" :label-width="'100px'">
        <el-form-item label="内容">
          <el-input v-model="option.data.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="正确答案">
          <el-switch v-model.number="option.data.is_right" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" active-text="正确" :inactive-value="0"  inactive-text="错误"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="option.show = false">取 消</el-button>
        <el-button type="primary" @click="addOptionToQuestion" :loading="option.loading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层：添加题目选项 end -->
  </div>
</template>

<script>
  import {
    getQuestionListFromApi,
    addQuestionItemToApi,
    updateQuestionItemToApi,
    deleteQuestionItemToApi,
    restoreQuestionItemToApi,
  } from '@/api/question';
  
  import {
    addQuestionLabelItemToApi,
    deleteQuestionLabelItemToApi,
  } from '@/api/questionLabel';
  
  import {
    addQuestionOptionItemToApi,
    deleteQuestionOptionItemToApi,
    updateQuestionOptionItemToApi,
  } from '@/api/questionOption';
  
  import { mapGetters } from 'vuex';
  
  import { filterNullOfObject } from '@/utils/index';
  
  export default {
    created () {
      this.initFetch();
      // 读取Labels数据
      if (this.questionBookLabels.length === 0) {
        this.labelLoading = true;
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
        'questionStarLabels'])
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
        labelLoading: false,// 获取标签时的loading状态
        tabPosition: '0',// 添加标签时的Tab标签页
        // 创建题目
        form: {
          show: false,
          loading: false,
          data: {
            title: null,// 标题
            type: null,// 类型
            comment: null,// 答案解析
          }
        },
        // 详情 与 编辑的属性
        edit: {
          show: false,// 当false时，不显示。当true是，显示。
          status: false,// 当false时，显示详情表单。当true是，显示编辑表单。
          loading: false,
          row: null,// 保存题目信息
          data: {
            title: null,// 标题
            type: null,// 类型
            comment: null,// 答案解析
            star: null,// 难度
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
            is_right: null
          }
        },
        // 题目标签
        label: {
          show: false,// 当false时，不显示。当true是，显示。
          loading: false,
          row: null,// 保存题目信息
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
        this.search.title = this.$route.query.title ? this.$route.query.title : null;
        this.search.star = this.$route.query.star ? Number.parseInt(this.$route.query.star) : null;
        this.search.chapter = this.$route.query.chapter ? Number.parseInt(this.$route.query.chapter) : null,// 章
        this.search.section = this.$route.query.section ? Number.parseInt(this.$route.query.section) : null,// 节
        this.search.book = this.$route.query.book ? Number.parseInt(this.$route.query.book) : null,// 书
        this.search.knowledge = this.$route.query.knowledge ? Number.parseInt(this.$route.query.knowledge) : null,// 知识点
        this.search.type = this.$route.query.type ? Number.parseInt(this.$route.query.type) : null,// 类型
        this.loading = true;
        getQuestionListFromApi(this.search).then(response => {
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
      // 展示创建题目
      showAddForm() {
        this.form.show = true;
      },
      // 添加题目
      addItem() {
        this.form.loading = true
        addQuestionItemToApi(this.form.data).then(response => {
          this.table.unshift(response.data)
          this.form.show = false
        }).catch(err => console.log(err)).finally(() => this.form.loading = false)
      },
      // 详细信息
      showDetailForm(row) {
        this.edit.status = false;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.title = row.title;
        this.edit.data.type = row.type;
        this.edit.data.star = row.star;
        this.edit.data.comment = row.comment;
      },
      // 编辑信息
      showEditForm(row) {
        this.edit.status = true;
        this.edit.show = true;
        this.edit.row = row;
        this.edit.data.title = row.title;
        this.edit.data.type = row.type;
        this.edit.data.star = row.star;
        this.edit.data.comment = row.comment;
      },
      // 更新信息
      updateItem() {
        this.edit.loading = true;
        updateQuestionItemToApi(this.edit.row.id, this.edit.data).then(() => {
          // 原数据更新
          this.edit.row.title = this.edit.data.title;
          this.edit.row.type = this.edit.data.type;
          this.edit.row.star = this.edit.data.star;
          this.edit.row.comment = this.edit.data.comment;
          // 隐藏表单
          this.edit.show = false;
        }).catch(err => console.log(err)).finally(() => this.edit.loading = false);
      },
      // 移除标签
      removeLabelFromQuestion(row, item) {
        this.$confirm(`此操作将删除该题目的『${item.name}』标签, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => deleteQuestionLabelItemToApi(row.id, item.id))
        .then(response => {
          row.labels.forEach((val, key) => {
            if (val.id === item.id) {
              row.labels.splice(key, 1)
            }
          })
        }).catch(err => console.log(err));
      },
      // 展示添加题目标签表单
      showAddQuestionLabelForm(row) {
        this.label.row = row;
        this.label.show = true;
      },
      // 添加题目标签
      addLabelToQuestion() {
        this.label.loading = true
        addQuestionLabelItemToApi(this.label.row.id, this.label.data).then(response => {
          this.label.row.labels.push(response.data)
          this.label.show = false
          this.label.data.label_id = null;// 清空数据
        }).catch(err => console.log(err)).finally(() => this.label.loading = false);
      },
      // 展示添加题目选项表单
      showAddOptionForm(row) {
        this.option.show = true;
        this.option.row = row;
      },
      // 添加题目选项
      addOptionToQuestion() {
        this.option.loading = true
        addQuestionOptionItemToApi(this.option.row.id, this.option.data).then(response => {
          this.option.row.options.push(response.data)
          this.option.show = false
          this.option.data.content = null;// 清空数据
          this.option.data.is_right = null;// 清空数据
        }).catch(err => console.log(err)).finally(() => this.option.loading = false);
      },
      // 移除选项
      removeOptionFromQuestion(row, item) {
        this.$confirm(`此操作将删除该题目的『${item.content}』选项, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => deleteQuestionOptionItemToApi(row.id, item.id))
        .then(response => {
          row.options.forEach((val, key) => {
            if (val.id === item.id) {
              row.options.splice(key, 1)
            }
          })
        }).catch(err => console.log(err));
      },
      // 设为正确答案
      setAnswerToQuestion(row, item) {
        this.$confirm(`此操作将该题目的『${item.content}』选项设为正确答案, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => updateQuestionOptionItemToApi(row.id, item.id, {is_right: 1}))
        .then(response => {
          item.is_right = 1;
        }).catch(err => console.log(err));
      },
      // 移除正确答案
      removeAnswerFromQuestion(row, item) {
        this.$confirm(`此操作将该题目的『${item.content}』选项设为错误答案, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => updateQuestionOptionItemToApi(row.id, item.id, {is_right: 0}))
        .then(response => {
          item.is_right = 0;
        }).catch(err => console.log(err));
      }
    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }
</style>
