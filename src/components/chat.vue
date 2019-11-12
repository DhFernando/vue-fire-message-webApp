<template>
  <div id="chat">
    <div class="row ml-5">
      <div class="container mt-3 ">
        <div class="row float-right ">
          <button type="button" class="btn ml-5" data-toggle="modal" data-target="#exampleModal"> <img style='height:30px' src="../assets/repairing-service.png" alt=""></button>
        </div>
        <br>
        <div class="row">
          <h4 class="text-primary text-center"><span class='text-info'>{{currentChat.name}}</span>  </h4>
        </div>
        <div class="row">
          <div class=' mr-5' style="width:100%; height:400px; overflow-y: scroll   ">
            <ul id="ulist" class="list-group ml-5 ml-0"  >
              <li v-for='(storeMessage,index) in fbMessages' :key='index' class='list-group-item list-group-item-action ml-0 pt-0 pb-0'>
                <span v-if="storeMessage.uid==user.uid" style='font-family:"Arial Black"' ><h6 class='text-secondary mb-0 mt-0 pb-0'>[ you ]</h6></span>
                <span v-else><h6 class='text-info' style='font-family:"Arial Black"'>[ {{storeMessage.name}} ]</h6></span>
                <span style='font-size:15px;font-family:"Comic Sans MS"'>{{storeMessage.message}}</span>
                <br>
                <span style='font-size:10px' class='float-right'>{{storeMessage.time}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12" v-if='currentChat.id'>
            <div class="row">
              <div class="col-8">
                <input v-on:keyup.enter='send(currentChat.id)' type="text" class="form-control mt-4 ml-4" id='message' style='width:100%' v-model='message' placeholder="text here ...">
              </div>
              <div class="col-4">
                <button v-on:click='send(currentChat.id)' class='btn mt-4 border' name="button" style='border-radious:90px'> <img style='height:25px ' src="../assets/paper-plane.png" alt=""> </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- promt -->
    <div class="row">
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">User Details</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h6>User Id (uid) : {{user.uid}} </h6><br>
              <h6>Email : {{user.email}} </h6><br>
              <h6>Name : {{user.name}} </h6><br>
            </div>
            <div class="modal-footer">
              <button v-on:click='logout' data-dismiss="modal" class="btn "><img style='height:30px' src="../assets/logout.png" alt=""> </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import {mapActions} from 'vuex'
// import {mapGetters} from 'vuex'
import {fb} from '../firebase'
export default {
  name: "chat",
  data(){
    return {
      userName:'',
      userEmail:'',
      userPhoneNumber:'',
      message:'',
      storeMessages:[],
    }
  },
  methods:{
      logout:function(){
        fb.auth().signOut().then(()=>{
      });
    },
    send:function(currentChat){
      let message = this.message
      this.$store.commit('send',{currentChat,message})
      this.message = ''
    }
  },

  computed:{
    fbMessages(){
      return this.$store.getters.fbMessages
    },
    currentChat(){
      return this.$store.getters.currentChat
    },
    user(){
      return this.$store.getters.user
    },


  },
  created:function(){

  }
}
</script>
<style scoped>

</style>
