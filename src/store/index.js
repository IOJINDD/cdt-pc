import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {
  Message
} from 'element-ui';
import {
  removeToken
} from '@/utils/auth'
import router from "@/router/index"
import {
  login,
  logout,
  fetchTypeList,
  fetchValueList,
  fetchGlbmList,
  fetchSysList,
  configListPublic,
} from "@/api/service.js";
import {
  treeDataTranslate
} from '@/utils/tool.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasAuth: false, // 权限
    isFullscreen: false, // 是否全屏
    theme: 'light-theme', // 默认主题
    visitedViews: [], // 访问过的视图
    cachedViews: [], // 缓存视图
    allMenu: [], // 菜单路径
    allOperation: [], // 操作权限
    activeIndex: '-1', // 主菜单选择项
    activeMenuTitle: '', // 主菜单名称
    activeMenus: [], // 选中的菜单
    activeSubmenus: [], // 选中的子菜单
    isCollapse: false, // 菜单收缩
    showIframe: false, // 是否显示iframe
    isAllReport: false, //一级菜单下是否全为report
    isSysModule: false, //一级菜单是否为系统管理模块
    iframeUrl: '', // iframe url地址
    iframeTitle: '', // iframe Title名称
    layId: '', // iframe lay-id
    searchForm: {}, // 默认搜索内容
    searchFlag: false, // 搜索内容
    glbmList: [], // 管理部门list
    glbmDwdm: {}, // 管理部门对应表
    glbmOptions: [], // 管理部门下拉框
    dicList: [], // 数据字典
    sysList: {}, // 系统参数
    userInfo: {
      user: {}
    },
    sysConfigData: {}, //系统文字描述配置信息
    asideIcon: '', // 左侧icon图标
  },
  plugins: [createPersistedState()],
  getters: {
    hasAuth: state => state.hasAuth,
    isFullscreen: state => state.isFullscreen,
    theme: state => state.theme,
    visitedViews: state => state.visitedViews,
    cachedViews: state => state.cachedViews,
    allMenu: state => state.allMenu,
    allOperation: state => state.allOperation,
    activeIndex: state => state.activeIndex,
    activeMenuTitle: state => state.activeMenuTitle,
    activeMenus: state => state.activeMenus,
    activeSubmenus: state => state.activeSubmenus,
    isCollapse: state => state.isCollapse,
    showIframe: state => state.showIframe,
    isAllReport: state => state.isAllReport,
    isSysModule: state => state.isSysModule,
    iframeUrl: state => state.iframeUrl,
    iframeTitle: state => state.iframeTitle,
    layId: state => state.layId,
    searchForm: state => state.searchForm,
    searchFlag: state => state.searchFlag,
    glbmList: state => state.glbmList,
    glbmArr: state => state.glbmArr,
    glbmOptions: state => state.glbmOptions,
    glbmDwdm: state => state.glbmDwdm,
    dicList: state => state.dicList,
    sysList: state => state.sysList,
    userInfo: state => state.userInfo,
    sysConfigData: state => state.sysConfigData,
    asideIcon: state => state.asideIcon,
  },
  mutations: {
    SET_hasAuth: (state, hasAuth) => {
      state.hasAuth = hasAuth
    },
    SET_isFullscreen: (state, isFullscreen) => {
      state.isFullscreen = isFullscreen
    },
    SET_theme: (state, theme) => {
      state.theme = theme
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (view.name !== 'Index') {
        if (state.visitedViews.some(v => (v.fullPath === view.fullPath))) return
        state.visitedViews.push({
          title: view.title || view.meta.title || 'no-name',
          fullPath: view.fullPath,
          path: view.path,
          query: view.query,
          name: view.name
        })
        if (!view.meta.noCache) {
          state.cachedViews.push(view.fullPath)
        }
      }
      state.cachedViews = [...new Set(state.cachedViews)]
    },
    DEL_ALL_VIEWS: state => {
      state.visitedViews = []
      state.cachedViews = []
    },
    SET_allMenu: (state, allMenu) => {
      state.allMenu = allMenu
    },
    SET_allOperation: (state, allOperation) => {
      state.allOperation = allOperation
    },
    SET_activeIndex: (state, activeIndex) => {
      state.activeIndex = activeIndex
    },
    SET_activeMenuTitle: (state, activeMenuTitle) => {
      state.activeMenuTitle = activeMenuTitle
    },
    SET_activeMenus: (state, activeMenus) => {
      state.activeMenus = activeMenus
    },
    SET_activeSubmenus: (state, activeSubmenus) => {
      state.activeSubmenus = activeSubmenus
    },
    SET_isCollapse: (state, isCollapse) => {
      state.isCollapse = isCollapse
    },
    SET_showIframe: (state, showIframe) => {
      state.showIframe = showIframe
    },
    SET_isAllReport: (state, isAllReport) => {
      state.isAllReport = isAllReport
    },
    SET_isSysModule: (state, isSysModule) => {
      state.isSysModule = isSysModule
    },
    SET_iframeUrl: (state, iframeUrl) => {
      state.iframeUrl = iframeUrl
    },
    SET_iframeTitle: (state, iframeTitle) => {
      state.iframeTitle = iframeTitle
    },
    SET_layId: (state, layId) => {
      state.layId = layId
    },
    SET_searchForm: (state, searchForm) => {
      state.searchForm = searchForm
    },
    SET_searchFlag: (state, searchFlag) => {
      state.searchFlag = searchFlag
    },
    SET_glbmList: (state, glbmList) => {
      state.glbmList = glbmList
    },
    SET_glbmArr: (state, glbmArr) => {
      state.glbmArr = glbmArr
    },
    SET_glbmDwdm: (state, glbmDwdm) => {
      state.glbmDwdm = glbmDwdm
    },
    SET_glbmOptions: (state, glbmOptions) => {
      state.glbmOptions = glbmOptions
    },
    SET_dicList: (state, dicList) => {
      state.dicList = dicList
    },
    SET_sysList: (state, sysList) => {
      state.sysList = sysList
    },
    SET_userInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_configData: (state, configData) => {
      state.sysConfigData = configData
    },
    SET_asideIcon: (state, asideIcon) => {
      state.asideIcon = asideIcon
    }
  },
  actions: {
    // 登陆
    login({
      commit
    }, form) {
      return new Promise((resolve, reject) => {
        login(form.username, form.password).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    logout({
      commit
    }) {
      return logout().then(res => {
        if (res.code === 200) {
          commit('SET_hasAuth', false)
          commit('SET_showIframe', false)
          removeToken()
          router.push('/login')
        } else {
          Message.error(res.data.msg)
        }
      })
    },

    // 获取数据字典
    getDictionaryList({
      commit
    }) {
      fetchTypeList().then(res => {
        let dicList = res.data
        fetchValueList().then(res => {
          dicList.forEach((item, index) => {
            item['xjsj'] = []
            res.data.forEach((item2, index2) => {
              if (item.dmlb == item2.dmlb) {
                item['xjsj'].push(item2)
              }
            })
          })
          commit('SET_dicList', dicList)
        })
      })
    },

    // 获取系统参数
    getSysList({
      commit
    }) {
      fetchSysList().then(res => {
        let sysList = {}
        res.data.forEach((item, index) => {
          sysList[item.csdm] = item
        })
        commit('SET_sysList', sysList)
      })
    },
 
    // 获取管理部门
    getAllDept({
      commit
    }) {
      fetchGlbmList().then(res => {
        commit('SET_glbmArr', res.data)
        let newArr = []
        let glbmList = []
        let glbmDwdm = {}
        let glbmOptions = []
        let index = -1
        res.data && res.data.forEach((ele) => {
          glbmOptions.push({
            value: ele.dwdm,
            label: ele.dwjc
          })
          newArr.push(ele)
          if (ele.xjbm && ele.xjbm.length > 0) {
            let arrEle = []
            let index2 = -1
            index = index + 1
            ele.xjbm.forEach((ele2) => {
              arrEle.push(ele2)
              if (ele2.xjbm && ele2.xjbm.length > 0) {
                let arrEle2 = []
                index2 = index2 + 1
                ele2.xjbm.forEach((ele3) => {
                  arrEle2.push(ele3)
                })
                arrEle[index2].xjbm = arrEle2
              }
            })
            newArr[index].xjbm = arrEle
          }
        })
        newArr.forEach((item, index) => {
          glbmDwdm[item.dwdm] = item.dwjc
        })
        glbmList = treeDataTranslate(newArr, "dwdm", "sjdwdm");
        commit('SET_glbmList', glbmList)
        commit('SET_glbmOptions', glbmOptions)
        commit('SET_glbmDwdm', glbmDwdm)
      })
    },

    // 获取系统文字描述配置信息
    getConfigData({ 
      commit
    }) {
      configListPublic().then(res => {
        if(res.code === 200) {
          let configData = {}
          res.data.forEach(item => {
            configData[item.csdm] = item.csz
          })
          document.title = configData.mon_sys_title;
          if (!window.localStorage.getItem('theme')) {
            window.localStorage.setItem('theme', configData.mon_sys_theme)
            commit('SET_theme', configData.mon_sys_theme) // 从系统管理配置获取默认皮肤
          } else {
            commit('SET_theme', window.localStorage.getItem('theme')) // 从系统管理配置获取默认皮肤
          }
          commit('SET_configData', configData)
        }
      })
    },

    addVisitedViews({
      commit
    }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({
      commit,
      state
    }, view) {
      state.visitedViews = state.visitedViews.filter(item => {
        return item.title != view.title
      })
      state.cachedViews = state.cachedViews.filter(item => {
        return item != view.title
      })
      let len = state.visitedViews.length;
      if (len > 0) {
        router.push(state.visitedViews[len - 1]);
      } else {
        router.push("/index");
      }
    },
    delOthersViews({
      commit,
      state
    }, view) {
      let visitedViews = []
      let cachedViews = []
      state.visitedViews.forEach(v => {
        if (v.fullPath === view.fullPath) {
          visitedViews.push(v)
        }
      })
      for (const i of state.cachedViews) {
        if (i === view.fullPath) {
          cachedViews.push(i)
        }
      }
      state.visitedViews = visitedViews
      state.cachedViews = cachedViews
    },
    delAllViews({
      commit,
      state
    }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
})
