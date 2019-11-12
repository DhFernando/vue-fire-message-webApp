<template v-if="state">
  <div id="todoApp">
    <div class="row ml-5">
      <div class="col-12">
        <div   class="row">
          <router-link to="/chatEnter">chatEnter</router-link>
          <chatEnter />
          <router-view/>
        </div>
        <div class="row">
          <h1 class="text-info">To Do List </h1>
        </div>
        <div class="row">
          <input type="text" v-model='newTodo' v-on:keyup.enter="addTodos">
        </div>
        <div class="row">
            <ul>
              <li  v-for="(todo,index) in todos" :key='index'>
                <span v-if="!edit.state ">{{todo}}
                  <span class="bg-danger text-light pl-2 pr-2" v-on:click="removeElement(index)"> -</span>
                  <span class="bg-success text-light ml-1 pl-2 pr-2" v-on:click="editElement(index)"> edit</span>
                </span>
                <span v-if='edit.tempForTodo.length>0 && edit.editIndex==index'>
                  <input v-model="edit.tempForTodo" type="text">
                  <button v-on:click="updateElement(index)">update</button>
                  <button v-on:click="updateCancel(index)" class=" ">cancel</button>
                </span>
              </li>
            </ul>
        </div>
        <div class='row'>
            <button v-on:click='sendFb()'>send</button>
        </div>
        <div class='row'>
            <ul>
              <li v-for="user in users" :key="user.key">{{user.name}} {{user.age }}</li>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {fb} from '../firebase'

export default {

  name: 'todoApp',
  components:{

  },
  data() {
    return {
      todos:[],
      newTodo:'',
      edit:{
        tempForTodo:'',
        hold:'',
        editIndex:null,
        state:false
      }
    }
  },
  computed:{
    users(){
      return this.$store.state.users;
    }
  },
  methods:{
   addTodos: function () {
      this.todos.push(this.newTodo)
      this.newTodo=''
    },
    removeElement:function(index) {
      this.todos.splice(index,1)
    },
    editElement:function(index) {
      this.edit.tempForTodo = this.todos[index]
      this.edit.hold = this.todos[index]
      this.edit.editIndex = index
      this.edit.state=true
    },
    updateElement:function(index) {
      this.todos[index]=this.edit.tempForTodo
      this.edit.editIndex = null
      this.edit.hold = ''
      this.edit.state=false
    },
    updateCancel:function(index) {
      this.todos[index]=this.edit.hold
      this.edit.editIndex = null
      this.edit.state=false
    },
    sendFb:function(){
      fb.firestore().collection("chat02").add({
         message:'form.message.value',
      })
    }
  },

}
</script>
