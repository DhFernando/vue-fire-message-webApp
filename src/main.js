import Vue from 'vue'
// import firebase from 'firebase'
import VueRouter from 'vue-router';
import App from './App.vue'
// import router from './router.js'






import {store} from './store/store.js'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import chatEnter from './components/chatRegistration.vue'
import chatLogIn from './components/chatLogIn.vue'

Vue.config.productionTip = false;


Vue.use(VueRouter);

const routers =[
    {
      path:'/chatRegistration',
      name:'chatEnter',
      component:chatEnter
    },
    {
      path:'/chatLogIn',
      name:'chatLogIn',
      component:chatLogIn
    }
]

const router= new VueRouter({
  routers
})

new Vue({
  store:store,
  router:router,
  render: h => h(App),
}).$mount('#app')
