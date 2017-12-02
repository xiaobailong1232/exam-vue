const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  roleOptions: state => state.role.list,
  groupCollegeLabels: state => state.label.list.filter(item => item.upid === 2),
  groupMajorLabels: state => state.label.list.filter(item => item.upid === 6),
  groupClassLabels: state => state.label.list.filter(item => item.upid === 10),
  questionBookLabels: state => state.label.list.filter(item => item.upid === 16),
  questionChapterLabels: state => state.label.list.filter(item => item.upid === 21),
  questionSectionLabels: state => state.label.list.filter(item => item.upid === 32),
  questionKnowledgeLabels: state => state.label.list.filter(item => item.upid === 43),
  questionStarLabels: state => state.label.list.filter(item => item.upid === 48),
  questionTypeLabels: state => [{id: 1, name: '单选题'}, {id: 2, name: '多选题'}],
  levelEqualTwo: state => state.label.list.filter(item => item.level === 2),
}
export default getters
