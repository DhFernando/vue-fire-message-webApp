import Vue from 'vue'
import Vuex from 'vuex'

import {fb} from '../firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
       user : { // logged user informaiton
         uid:'', //user id
         email:'', //user email
         name:'', // user name
         phoneNumber:'' //user phone number
       },
       chat:'', // selected chat information
       fbMessages:[], //store selected chat's messages data as a array (include : messageId,senderDetails,time,)
       exsistAllUserIds:[],
       requestList:[],
       routerTo:{
              login:true,
              register:false
            },
      reply:{
        baseMessage:'',
        baseMessageId:'',
        baseMessageOwner:{
          uid:'',
          name:''
        }
      }

    },
    getters:{
      chat:(state)=>{
        return state.chat
      },
      fbMessages:(state)=>{
        return state.fbMessages
      },
      requestList:(state)=>{
        return state.requestList
      },
      user:(state)=>{
          return state.user
      },
      routerTo:(state)=>{
        return state.routerTo
      },
      reply:(state)=>{
        return state.reply
      }

    },
    actions:{

    },
    mutations:{
      chat:(state,chat)=>{   // from chatMenue.vue for find  which chat is seleced by user form chat list (personal/group)
        state.fbMessages=[] // clear previous chat message data (id,message and  ext ..)
        state.chat = chat // parse selected chat information to the vuex state (now vuex is updated)
        state.reply={
          baseMessage:'',
          baseMessageId:'',
          baseMessageOwner:{
            uid:'',
            name:''
          }
        }
      },
      fbMessages:(state)=>{  // push chat message data to vuex fbMessages array
          fb.firestore().collection('chats').doc(state.chat.id).collection('message').orderBy('time').onSnapshot(snapshot=>{
            var changes = snapshot.docChanges();
            changes.forEach(change=>{
              if(change.type == 'added'){
                state.fbMessages.push({messageId:change.doc.id, details:change.doc.data()})
              }else if(change.type == 'modified'){
                state.fbMessages[change.doc.data().messageIndex].details.message= 'this message has been deleted'
              }
            })
          })
        },
      deleteMessage:(state,{messageId,index})=>{
        fb.firestore().collection("chats").doc(state.chat.id).collection('message').doc(messageId).update({
            message: 'this message has been deleted',
            deletedMessage:state.fbMessages[index].details.message,
            deleted:true,
            messageIndex:index
        })
      },
      reply:(state,{replyBaseMessage})=>{
        state.reply = {
          baseMessage : replyBaseMessage.details.message,
          baseMessageId : replyBaseMessage.messageId,
          baseMessageOwner : {
            uid:replyBaseMessage.details.uid,
            name:replyBaseMessage.details.name
          }
        }
      },
      closeReply:(state)=>{
        state.reply.baseMessage = ''
        state.reply.baseMessageId = ''
      },
      send:(state,{currentChat,message})=>{ // send message details to firebase
        fb.firestore().collection("chats").doc(currentChat).collection('message').add({
            message:message,
            reply:state.reply,
            time:new Date(),
            uid:state.user.uid,
            name:state.user.name,
            deleted:false
        }).then(()=>{
          state.reply={
            baseMessage:'',
            baseMessageId:'',
            baseMessageOwner:{
              uid:'',
              name:''
            }
          }
        })
      },
      createGroup:(state,newChat)=>{
        fb.firestore().collection("chats").doc().set({
            name:newChat.name,
            chatType : newChat.type,
            createdUserId : state.user.uid,
            createdUserEmail:state.user.email
          })
        },

      createRequest:(state,newChat)=>{
        alert(state.exsistAllUserIds[0]+' ' + newChat.name + ' ' + state.user.uid)
        if(state.exsistAllUserIds.indexOf(newChat.name)>=0 && state.user.uid !== newChat.name){
          fb.firestore().collection("users").doc(newChat.name).collection('requests').add({
              chatType : newChat.type,
              requesterId : state.user.uid,
              requesterEmail:state.user.email,
              requesterName : state.user.name,
              requesterPhoneNumber : state.user.phoneNumber,
              state:'not Conform yet'
            }).then(()=>{
              alert('Request Sent')
            })
        }else{
          alert('no user Exsist')
        }
      },
      displayRequestList:(state)=>{
        state.requestList=[]
        fb.firestore().collection('users').doc(state.user.uid).collection('requests').onSnapshot(snapshot=>{
          var changes = snapshot.docChanges()
            changes.forEach(change=>{
              if (change.type == 'added') {
                state.requestList.push({requestData: change.doc.data() , requestId : change.doc.id})
              }
            })
        })
      },
      rejectRequest:(state,{requestId})=>{
        fb.firestore().collection("users").doc(state.user.uid).collection('requests').doc(requestId).delete().then(function() {
            alert("your Friend request successfully deleted!");
        }).catch(function(error) {
            alert("Error removing document: ", error);
        });
      },
      requestAccept:(state,{requestId , requesterData})=>{
              fb.firestore().collection('users').doc(state.user.uid).collection('friends').add({
                  id:requesterData.requesterId,
                  email:requesterData.requesterEmail,
                  name:requesterData.requesterName,
                  phoneNumber:requesterData.requesterPhoneNumber,
                  friendFrom:'request Accept by you'
              }).then(()=>{
                fb.firestore().collection('users').doc(requesterData.requesterId).collection('friends').add({
                  id:state.user.uid,
                  email:state.user.email,
                  name:state.user.name,
                  phoneNumber:state.user.phoneNumber,
                  friendFrom:'request Accept by Friend'
                })
              }).then(()=>{
                fb.firestore().collection("chats").doc().set({
                    chatType : 'personal',
                    owners : {
                              owner01:{
                                id:requesterData.requesterId,
                                name:requesterData.requesterName,
                                email:requesterData.requesterEmail,
                                phoneNumber:requesterData.requesterPhoneNumber
                              },
                              owner02:{
                                id:state.user.uid,
                                name:state.user.name,
                                email:state.user.email,
                                phoneNumber:state.user.phoneNumber
                              }
                            },

                  })
              }).then(()=>{
                fb.firestore().collection("users").doc(state.user.uid).collection('requests').doc(requestId).delete().then(function() {
                    alert("your Accepted  Friend request !!");
                }).catch(function(error) {
                    alert("Error removing document: ", error);
                });
              })


      },
      routerTo:(state)=>{
        state.routerTo.login = !state.routerTo.login
        state.routerTo.register =!state.routerTo.register
      }

    }

})
