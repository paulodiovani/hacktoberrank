import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.filter('cutPRLink', function (link) {
  if (!link) return ''
  return link.substring(15 + 4, link.length)
})

new Vue({
  render: h => h(App)
}).$mount('#app')
