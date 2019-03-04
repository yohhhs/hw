import Vue from 'vue'
import iView from 'iview';
import Router from 'vue-router'
import {page404, page403, loginRouter, otherRouter, appRouter} from "./routers";
import { settingRoutes, openNewPage } from '../common/js/util.js'
import { getPermissions } from '../api/request.js'

Vue.use(Router)

let initRouter = {
  path: '/',
  redirect: '/login'
}

let router = new Router({
  routes: [
    initRouter,
    loginRouter,
    otherRouter,
    page403
  ]
})
// !!!打开一级路由时，若有二级路由，打开第一个二级路由页面
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
if(to.name === 'login' || to.name === 'err-403') {
  next()
} else {
  if(window.sessionStorage.getItem('ym-token')) {
    if (!Vue.prototype.menu) {
      getPermissions().then(data => {
        if (data !== 'isError') {
        let routes = settingRoutes(JSON.parse(data.contrast), JSON.parse(data.permissionsTree))
        router.addRoutes([...routes, page404])
        next(to.path)
      } else {
        next('/login')
      }
    }).catch(err => {
        next('/login')
    })
    } else {
      next()
    }
  } else {
    next('/login');
  }
}

});

router.afterEach((to) => {
  iView.LoadingBar.finish()
if (!(to.name === 'err-404' || to.name === 'err-403' || to.name === 'login')) {
  openNewPage(router.app, to)
}
window.scrollTo(0, 0);
});

export default router
