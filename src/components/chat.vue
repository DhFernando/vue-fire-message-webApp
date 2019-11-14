<template>
  <div id="chat">
    <div class="row ">
      <div class="container">
        <div class="row bg-dark pt-3 pb-2 mb-3">
          <div class="col-md-8">
            <h4 class="text-light pl-3"><span class=''>{{chat.name}}</span>  </h4>
          </div>
          <div class="col-md-4">
            <button type="button" class="btn pt-0 float-right" data-toggle="modal" data-target="#exampleModal"> <img style='height:30px' src="../assets/repairing-service.png" alt=""></button>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class='mr-5 ml-5' style="width:100%; height:400px; overflow-y: scroll">
                <div class="col-12">
                    <div v-for='(storeMessage,index) in fbMessages' :key='index' class='  list-group-item list-group-item-action ml-0  mb-1 pt-0 pl-3 pb-0'>
                      <div class="row " v-if="storeMessage.details.uid==user.uid">

                        <div class="col-12 float-right">
                            <div class="row ">
                              <div class="col-9">
                                <h6 class='text-secondary mb-0 mt-1 pb-0 pt-0' style='font-family:"Verdana" ; font-size:12px'>[ you ]</h6>
                              </div>
                              <div class="col-3" v-if='!storeMessage.details.deleted'>
                                <button type="button" class="btn  pt-0 float-right" id="messageActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <img style='height:17px' src="../assets/chevron.png" alt=""></button>
                                <div class="dropdown-menu" aria-labelledby="messageActions">
                                  <a class="dropdown-item" >Reply</a>
                                  <a class="dropdown-item" v-on:click='deleteMessage(storeMessage.messageId,index)'>Delete</a>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-12">
                                  <p style='font-size:15px;font-family:"Comic Sans MS"' class='mt-0 pt-0 mb-0 pb-0' >{{storeMessage.details.message}}</p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-12">
                                <p style='font-size:10px' class='float-right mt-0 pt-0 mb-0 pb-0'>{{storeMessage.details.time}}</p>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div class="row " v-else >
                        <div class="col-12  ">
                            <div class="row">
                              <div class="col-9">
                                <h6 class='text-success  mb-0 mt-1 pb-0' style='font-family:"Verdana" ; font-size:12px'>[ {{storeMessage.details.name}} ]</h6>
                              </div>
                              <div class="col-3" v-if='!storeMessage.details.deleted' >
                                <button type="button" class="btn  pt-0 float-right" id="messageActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <img style='height:17px' src="../assets/chevron.png" alt=""></button>
                                <div class="dropdown-menu" aria-labelledby="messageActions">
                                  <a class="dropdown-item" >Reply</a>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-12">
                                  <p style='font-size:15px;font-family:"Comic Sans MS"' class='mt-0 pt-0 mb-0 pb-0' >{{storeMessage.details.message}}</p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-12">
                                <p style='font-size:10px' class='float-right mt-0 pt-0 mb-0 pb-0'>{{storeMessage.details.time}}</p>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12" v-if='chat.id'>
            <div class="row">
              <div class="col-8">
                <input v-on:keyup.enter='send(chat.id)' type="text" class="form-control mt-4 ml-4" id='message' style='width:100%' v-model='message' placeholder="text here ...">
              </div>
              <div class="col-4">
                <button v-on:click='send(chat.id)' class='btn mt-4 border bg-dark' name="button" style='border-radious:90px'> <img style='height:25px ' src="../assets/paper-plane.png" alt=""> </button>
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

import {fb} from '../firebase'
export default {
  name: "chat",
  data(){
    return {
      message:'', // for capture typed message
    }
  },
  methods:{
      logout:function(){ // call firebase query for log out
        fb.auth().signOut().then(()=>{
      });
    },
    send:function(currentChat){
      let message = this.message
      if(this.message.length>0){ // error correction for avoid emty message send's
        this.$store.commit('send',{currentChat,message}) // call vuex for to run store message on firebase
        this.message = ''
      }
    },
    deleteMessage:function(messageId,index){
      this.$store.commit('deleteMessage',{messageId,index})
    }
  },

  computed:{
    fbMessages(){
      return this.$store.getters.fbMessages // getting all message information of the selected chat
    },
    chat(){  // getting current chat information (id , name and ect..)
      return this.$store.getters.chat
    },
    user(){
      return this.$store.getters.user // getting user information from vuex (id , name and ect..)
    },
  },
  created:function(){

  }
}
</script>
<style scoped>

</style>
