<template>
  <div id="">
    <div class="row pl-0 pt-3 pb-2 mb-3 bg-dark">
      <div class="col-12">
        <div class="row">
          <div class="col-4 text-light ">
            <h5>Chat Menue</h5>
          </div>
          <div class="col-8">
            <div class="row">
              <div class="col-3">
                <button type="button" id='newChat' class="btn pt-0" data-toggle="modal" data-target="#exampleModal1"><img style='height:30px' src="../assets/new-user.png" alt=""></button>
              </div>
              <div class="col-3">
                <button type="button" v-on:click='displayRequestList()' id='newChat' class="btn pt-0 mt-0 " data-toggle="modal" data-target="#exampleModal2"><img style='height:30px' src="../assets/friendship.png" alt=""></button>
              </div>
              <div class="col-3">

              </div>
              <div class="col-3">
                <button type="button" class="btn pt-0 float-right" data-toggle="modal" data-target="#exampleModal"> <img style='height:30px' src="../assets/repairing-service.png" alt=""></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <nav>
                        <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Personal</a>
                            <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Group</a>
                        </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent" >
                        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                          <div class=" ml-1 mt-3 mb-3">
                            <a class="list-group-item list-group-item-action pb-1 pt-1 mr-4"  v-for='(Chat,index) in allPersonalChats' :key='index' v-show='Chat.chatType=="personal"'  v-on:click="chat(Chat)" >{{Chat.name}}</a >
                          </div>
                        </div>
                        <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                          <div class="row ml-1 mt-3 mb-3">
                              <a class="list-group-item list-group-item-action pb-1 pt-1 mr-4" v-for='(Chat,index) in allGroupChats' :key='index' v-on:click="chat(Chat)" >{{Chat.name}}</a >
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<!-- prompts -->
<div class="row">
  <createChats/>
  <friendRequest/>
</div>

  </div>
</template>
<script>

import {fb} from '../firebase'
import createChats from './createChats.vue'
import friendRequest from './friendRequest.vue'

export default {
  name: "",
  components: {
    createChats,
    friendRequest
  },
  data (){
    return{
      allGroupChats:[], // all groups which has access
      allPersonalChats:[], // all personal chats which has access
    }
  },
  methods:{
    chat : function(chat){
      this.$store.commit('chat',chat)
      this.$store.commit('fbMessages')
    },
    displayRequestList:function(){
      this.$store.commit('displayRequestList')
    }
  },
  computed:{

  },
  created:function(){
// get all the chats(chats->personal/group) which user has access(permission)

    let tempuid = this.$store.getters.user.uid // tempid use for store user id tempary for check permission
    let tempAllGroupChats = [] // for store allgroup chats which has access
    let tempAllPersonalChats = [] // for store allgroup personal which has access

    fb.firestore().collection("chats") // query for getting all chats which has permission
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added" && change.doc.data().chatType == 'group') {
              tempAllGroupChats.push({name : change.doc.data().name , id : change.doc.id,chatType : change.doc.data().chatType})
            }else if(change.type === "added" && change.doc.data().chatType == 'personal'){
              if(change.doc.data().owners.owner01.id == tempuid){
                tempAllPersonalChats.push({
                  name :change.doc.data().owners.owner02.name ,
                  id : change.doc.id,
                  phoneNumber : change.doc.data().owners.owner02.phoneNumber,
                  email : change.doc.data().owners.owner02.email,
                  chatType : change.doc.data().chatType
                })
              }else if(change.doc.data().owners.owner02.id == tempuid){
                tempAllPersonalChats.push({
                  name :change.doc.data().owners.owner01.name ,
                  id : change.doc.id,
                  phoneNumber : change.doc.data().owners.owner01.phoneNumber,
                  email : change.doc.data().owners.owner01.email,
                  chatType : change.doc.data().chatType
                })
              }
            }
        });
    });
    this.allGroupChats=tempAllGroupChats
    this.allPersonalChats=tempAllPersonalChats
  }
}
</script>
<style lang="scss" scoped>
</style>
