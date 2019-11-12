<template>
  <div class='row ml-0 mr-0 mt-3 container-fluid' id="app">
    <div class="col-6 border pl-5 pb-5" v-if='!status'>
      <chatLogIn/>
    </div>
    <div class="col-6 border pl-5 pb-5" v-if='!status'>
        <chatRegistration/>
    </div>
    <div class="col-12  pl-1" v-if='status'>
        <div class="row">
          <div class="col-4 border">
            <chatMenue/>
          </div>
          <div class="col-8 border">
            <chat/>
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
        fb.firestore().collection('users').doc(this.user.uid).get().then((doc)=>{
          this.$store.state.user.name = doc.data().name
          this.$store.state.user.name = doc.data().phoneNumber
        })
    })

  },
  methods:{

  },
  computed:{

  },

}
</script>
