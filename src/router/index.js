import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  mode: 'hash',
  routes: [{
      path: '/',
      component: (resolve) => require(['@/views/login/index'], resolve),
      redirect: 'index'
    },
    {
      path: '/login',
      component: () => import('@/views/login/index')
    },
    {
      path: '/',
      component: () => import('@/views/layout/index'),
      // redirect: 'home',
      children: [{
          path: '/index',
          component: () => import('@/views/index/index'),
          meta: {
            title: '起始页'
          }
        },
        {
          path: 'iframe',
          name: 'Iframe',
          component: () => import('@/components/Iframe'),
          meta: {
            title: '外部链接'
          }
        }
      ]
    }
  ]
})
