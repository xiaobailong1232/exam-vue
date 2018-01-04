const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  // 群组：专业
  groupMajorLabels: state => state.label.list.filter(item => item.upid === 3),
  // 群组：班级
  groupClassLabels: state => state.label.list.filter(item => item.upid === 4),
  // 题目：书籍
  questionBookLabels: state => state.label.list.filter(item => item.upid === 5),
  // 题目：章
  questionChapterLabels: state => state.label.list.filter(item => item.upid === 6),
  // 题目：节
  questionSectionLabels: state => state.label.list.filter(item => item.upid === 7),
  // 题目：知识点
  questionKnowledgeLabels: state => state.label.list.filter(item => item.upid === 8),
  // 题目：难度
  questionStarLabels: () => [
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
    { id: 5, name: 5 }
  ],
  // 题目：书籍
  questionTypeLabels: () => [
    { id: 1, name: '单选题' },
    { id: 2, name: '多选题' }
  ]
}
export default getters
