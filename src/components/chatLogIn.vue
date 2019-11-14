<template>
  <div id="chatLogIn">
        <div class="jumbotron container bg-dark text-light mt-5">
          <div class="row pl-5 pr-5">
            <div class="container mt-5 ">
              <div class="row">
                <h4 class="mb-5 ">Log In</h4>
              </div>
              <div class="row">
                <div class="form-group">
                  <input type="text" class="form-control mt-1" id='LogInEmail' v-model='LogInEmail' placeholder="Valid Email">
                  <input type="text" class="form-control mt-1" id='LogInPassword' v-model='LogInPassword' placeholder="Password">
                </div>
              </div>
              <div class="row">
                <button v-on:click="submit()" class="btn btn-primary mr-4">Go !!</button>
                <a class='text-info mt-1' v-on:click='routerTo()'> Register Here </a>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>
<script>
import {fb} from '../firebase'
export default {
  name: "chatLogIn",
  data(){
    return{
      LogInEmail:'',
      LogInPassword:''
    }
  },
  methods:{
    submit:function(){
      fb.auth().signInWithEmailAndPassword(this.LogInEmail,this.LogInPassword).then(()=>{
          // alert('you have been succesfully registed');
      })
    },
    routerTo:function(){
      this.$store.commit('routerTo')
    }
  },

}
</script>
