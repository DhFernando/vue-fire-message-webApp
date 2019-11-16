<template>
  <div class='row ml-0 pl-0 pr-0 mr-0 mt-0 container-fluid' id="app">
    <div class="col-12">
      <div class="row bg-dark pt-2 pb-2 pl-4">
        <div class="col-12">
          <div class="row ">
            <h2 class='text-light '>CHAT APP</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12" id="body">
      <div class="row">
        <div class="col-12 pl-5 pb-5" v-show='routerTo.login' v-if='!status'>
          <div class="d-flex justify-content-center">
            <chatLogIn/>
          </div>
        </div>
        <div class="col-12 pl-5 pb-5" v-show='routerTo.register' v-if='!status'>
          <div class="d-flex justify-content-center">
            <chatRegistration/>
          </div>
        </div>

        <div class="col-12  pl-1" v-if='status'>
            <div class="row">
              <div class="col-3 border">
                <chatMenue/>
              </div>
              <div class="col-9 border">
                <chat/>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import chatRegistration from './components/chatRegistration.vue'
import chatLogIn from './components/chatLogIn.vue'
import chat from './components/chat.vue'
import chatMenue from './components/chatMenue.vue'
import {fb} from './firebase'

export default {
  name: 'app',
  components: {
    chatRegistration,
    chatLogIn,
    chat,
    chatMenue
  },
  data(){
    return{
      status:''
    }
  },
  beforeCreate:function(){
    fb.auth().onAuthStateChanged(user =>{
        if(user){
            this.status=true;
            // alert('logIn')
        }else{
            // alert('logout')
            this.status=false;
        }
    })
  },
  created:function(){
    fb.firestore().collection('users').onSnapshot(snapshotUsers=>{
        var changesUsers = snapshotUsers.docChanges();
        changesUsers.forEach(changesUser=>{
          if(changesUser.type == 'added'){
            this.$store.state.exsistAllUserIds.push(changesUser.doc.id)
          }
        })
    })

    fb.auth().onAuthStateChanged(user =>{
        if(user){
            this.$store.state.user.uid = user.uid
            this.$store.state.user.email = user.email
        }
        fb.firestore().collection('users').doc(this.$store.state.user.uid).get().then((doc)=>{
          this.$store.state.user.name = doc.data().name
          this.$store.state.user.phoneNumber = doc.data().phoneNumber
        })
    })

  },
  methods:{

  },
  computed:{
    routerTo(){
      return this.$store.getters.routerTo
    }
  },

}
</script>
<style scoped>
    #body {
      background-image: url('./assets/photo/bdp.jpg');
      background-position: center; /* Center the image */
      background-repeat: no-repeat; /* Do not repeat the image */
      background-size: cover;

    }
</style>
