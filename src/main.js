import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './plugins/element.js'
import CdtSearch from '@/components/cdt-search/index'
import CdtTable from '@/components/cdt-table/index'
import CdtForm from '@/components/cdt-form/index'
import ScrollTable from '@/components/scroll-table/index'
import GridBox from '@/components/GridBox.vue'
import '@/assets/icon-font/iconfont.css'
import common from '@/utils/common.for.vue.js';
import * as filters from './filters' // 全局vue filter
import '@/assets/night-theme/index.css'
import '@/assets/blue-theme/index.css' 
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import animated from 'animate.css'
import "@/styles/default.scss";
import "@/styles/index.scss";
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.prototype.common = common;
Vue.prototype.$echarts = echarts
Vue.component('CdtSearch', CdtSearch)
Vue.component('CdtTable', CdtTable)
Vue.component('CdtForm', CdtForm)
Vue.component('ScrollTable', ScrollTable)
Vue.component('GridBox', GridBox)
Vue.use(preview, animated, {
  arrowEl: false //关闭全屏按钮
})

// 配置全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 进入路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.name == 'Iframe') { // 判断是否是外部链接
    document.title = to.query.name || '业务监管'
  } else {
    document.title = to.name || store.getters.sysConfigData.mon_sys_title || '业务监管'
  }


  if (to.matched.length === 0 ) {    //如果未匹配到路由
    from.name ? next({ name:from.name }) : next('/index');   
  } else {
    next()
  }
})

Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day 
    'h+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    'S': this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  return format
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
