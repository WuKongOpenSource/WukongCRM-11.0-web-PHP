const getters = {
  userInfo: state => state.user.userInfo,
  lang: state => state.app.lang,
  app: state => state.app,
  logo: state => {
    if (state.app.logo) {
      return state.app.logo
    }
    return require('@/assets/img/logo.png')
  },
  name: state => {
    if (state.app.name) {
      return state.app.name
    }
    return '悟空CRM'
  },
  collapse: state => state.app.sidebar.collapse,
  activeIndex: state => state.app.sidebar.activeIndex,
  navActiveIndex: state => state.app.navbar.activeIndex,
  headerModule: state => state.app.headerModule,
  // 权限
  allAuth: state => state.user.allAuth,
  crm: state => state.user.crm,
  bi: state => state.user.bi,
  manage: state => state.user.manage,
  // manage: state => ({ 'init': { 'initData': true }, 'hrm': { 'insurance': true, 'archives': true, 'field': true, 'appraisal': true, 'salary': true, 'params': true }, 'oa': { 'examine': true }, 'system': { 'read': true, 'update': true }, 'jxc': { 'field': true, 'params': true }, 'examineFlow': { 'update': true }, 'work': { 'update': true }, 'adminLog': { 'actionRecord': true, 'systemLog': true, 'loginLog': true }, 'permission': { 'update': true }, 'configSet': { 'read': true, 'update': true }, 'users': { 'deptSave': true, 'deptDelete': true, 'read': true, 'userEnables': true, 'userUpdate': true, 'userSave': true, 'deptUpdate': true }, 'crm': { 'print': true, 'field': true, 'achievement': true, 'pool': true, 'setting': true }}),
  oa: state => state.user.oa,
  project: state => state.user.project,

  // 路由
  addRouters: state => state.permission.addRouters,
  crmRouters: state => state.permission.crmRouters,
  taskExamineRouters: state => state.permission.taskExamineRouters,
  workLogRouters: state => state.permission.workLogRouters,
  addressBookRouters: state => state.permission.addressBookRouters,
  projectRouters: state => state.permission.projectRouters,
  biRouters: state => state.permission.biRouters,
  manageRouters: state => state.permission.manageRouters,
  // manageRouters: state => ([{ 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'system', 'read'] }, 'children': [{ 'name': 'systemconfig', 'path': 'systemconfig', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '企业首页', 'icon': 'enterprise' }}], 'redirect': '/manage/systemconfig' }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage'] }, 'children': [{ 'path': 'update', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '在线升级', 'icon': 'data-import' }}] }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'configSet', 'read'] }, 'children': [{ 'name': 'application', 'path': 'application', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '应用管理', 'icon': 'all' }}] }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'users', 'read'] }, 'children': [{ 'name': 'employee-dep', 'path': 'employee-dep', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '员工与部门管理', 'icon': 's-seas' }}] }, { 'path': '/manage/role-auth', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'permission'], 'title': '角色权限管理', 'icon': 'user' }, 'alwaysShow': true, 'name': 'manage-role-auth', 'children': [{ 'name': 'role-auth', 'path': 'role-auth/:pid/:title', 'hidden': true, 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'redirect': 'role-auth/1/%E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2' }}, { 'name': 'role-auth', 'path': 'role-auth/1/%E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2', 'ignore': true, 'meta': { 'title': '系统管理角色' }}, { 'name': 'role-auth', 'path': 'role-auth/7/%E5%8A%9E%E5%85%AC%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2', 'ignore': true, 'meta': { 'title': '办公管理角色' }}, { 'name': 'role-auth', 'path': 'role-auth/2/%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2', 'ignore': true, 'meta': { 'title': '客户管理角色' }}, { 'name': 'role-auth', 'path': 'role-auth/8/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2', 'ignore': true, 'meta': { 'title': '项目管理角色' }}, { 'name': 'role-auth', 'path': 'role-auth/9/%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2', 'ignore': true, 'meta': { 'title': '人力资源管理角色' }}, { 'name': 'role-auth', 'path': 'role-auth/10/%E8%BF%9B%E9%94%80%E5%AD%98%E7%AE%A1%E7%90%86%E8%A7%92%E8%89%B2', 'ignore': true, 'meta': { 'title': '进销存管理角色' }}] }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'examineFlow'] }, 'children': [{ 'name': 'system-examine', 'path': 'system-examine', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '业务审批流', 'icon': 'approve' }}] }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'oa'] }, 'children': [{ 'name': 'system-workbench', 'path': 'system-workbench', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '办公审批流', 'icon': 'approve' }}, { 'name': 'workbenchHandlefield', 'path': 'workbench-custom-field/:type/:id/:label', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'hidden': true, 'meta': { 'activeMenu': '/manage/system-workbench' }}] }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'work'] }, 'children': [{ 'name': 'system-project', 'path': 'system-project', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '项目管理', 'icon': 'project' }}] }, { 'path': '/manage/customer', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': true, 'permissions': ['manage', 'crm'], 'title': '客户管理', 'icon': 'customer' }, 'alwaysShow': true, 'children': [{ 'path': 'custom-field', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '自定义字段设置', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'field'] }}, { 'path': 'customer', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '客户公海规则设置', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'pool'] }}, { 'path': 'print-templates', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '自定义打印模板', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'print'] }}, { 'path': 'print-detail', 'name': 'crmPrintDetail', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'hidden': true, 'meta': { 'activeMenu': '/manage/customer/print-templates', 'title': '自定义打印模板', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'print'] }}, { 'path': 'biz-param', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '业务参数设置', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'setting'] }}, { 'path': 'biz-goals', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '业绩目标设置', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'achievement'] }}, { 'name': 'handlefield', 'path': 'custom-field/:type/:id/:label', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'hidden': true, 'meta': { 'activeMenu': '/manage/customer/custom-field', 'requiresAuth': true, 'permissions': ['manage', 'crm', 'field'] }}] }, { 'path': '/manage', 'component': { '_custom': { 'type': 'component-definition', 'display': 'AdminLayout <span>(src\\views\\layout\\AdminLayout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\AdminLayout.vue' }}, 'meta': { 'requiresAuth': false }, 'children': [{ 'name': 'system-other', 'path': 'system-other', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'meta': { 'title': '其他设置', 'icon': 'manage' }}] }, { 'path': '/manage', 'name': 'manage', 'redirect': '/manage/systemconfig', 'hidden': true }]),
  // 客户管理信息
  messageNum: state => state.crm.messageNum,
  // 配置信息
  CRMConfig: state => state.app.CRMConfig,
  imageCache: state => state.app.imageCache
}
/**
 * 使用说明
 * import { mapGetters } from 'vuex'
 * computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
 */

export default getters
