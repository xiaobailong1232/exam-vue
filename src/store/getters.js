const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  roleOptions: state => state.role.list,
  groupLabelOptions: state => state.label.list.filter(item => item.upid === 1),
}
export default getters
