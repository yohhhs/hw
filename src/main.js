import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store'
import VueDND from 'awe-dnd'

Vue.use(VueDND)

Vue.config.productionTip = false

Vue.use(iView)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
