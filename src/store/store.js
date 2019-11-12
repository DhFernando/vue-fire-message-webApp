import Vue from 'vue'
import Vuex from 'vuex'

import {fb} from '../firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
       user : {
         uid:'',
         email:'',
         name:'',
         phoneNumber:''
       },
       chat:'',
       fbMessages:[],
       chats:[],
       exsistAllUserIds:[],
       requestList:[],
      
    },
    getters:{
      currentChat:(state)=>{
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
      meassage:(state)=>{
        return state.message
      }

    },
    actions:{

    },
    mutations:{
      selectedChat:(state,chat)=>{
        state.fbMessages=[]
        state.chat = chat
      },
      fbMessages:(state)=>{
          fb.firestore().collection('chats').doc(state.chat.id).collection('message').orderBy('time').onSnapshot(snapshot=>{
            var changes = snapshot.docChanges();
            changes.forEach(change=>{
              if(change.type == 'added'){
                state.fbMessages.push(change.doc.data())
              }
            })
          })
        },
      send:(state,{currentChat,message})=>{
        fb.firestore().collection("chats").doc(currentChat).collection('message').add({
            message:message,
            time:new Date(),
            uid:state.user.uid,
            name:state.user.name
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


      }

    }

})
