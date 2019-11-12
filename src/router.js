import Vue from 'vue'
import Router from 'vue-router'

import chatEnter from './components/chatEnter.vue'
import chatLogIn from './components/chatLogIn.vue'

Vue.use(Router);
export default new Router({
  routes:[
    {
      path:'/chatEnter',
      name:'chatEnter',
      component:chatEnter
    },
    {
      path:'/chatLogIn',
      name:'chatLogIn',
      component:chatHelp
    }
  ]
})
