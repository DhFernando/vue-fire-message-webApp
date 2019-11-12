<template>
  <div id="chatRegistration">
      <div class="row">
        <div class="container mt-5 ">
          <div class="row">
            <h4 class="text-primary text-center">Chat Registration</h4>
          </div>
          <div class="row">
              <div class="form-group">
                <input type="text" class="form-control mt-1" id='name' v-model='name' placeholder="Name or Nic name">
                <input type="text" class="form-control mt-1" id='phoneNumber' v-model='phoneNumber'  placeholder="Valid Number">
                <input type="text" class="form-control mt-1" id='SingInEmail' v-model='SingInEmail' placeholder="Valid Email">
                <input type="text" class="form-control mt-1" id='SingInPassword' v-model='SingInPassword' placeholder="Password">
              </div>
          </div>
          <div class="row">
            <button v-on:click="submit()" class="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

import {fb} from '../firebase'
export default {

  component:{

  },
  name: 'chatRegistration',
  data() {
    return {
      name:'',
      phoneNumber:'',
      SingInEmail:'',
      SingInPassword:''
    }
  },
  computed:{

  },
  methods:{
    submit:function(){
      fb.auth().createUserWithEmailAndPassword(this.SingInEmail,this.SingInPassword).then(cred=>{
       return fb.firestore().collection('users').doc(cred.user.uid).set({
           name: this.name,
           phoneNumber: this.phoneNumber
       });
     }).then(()=>{
       // alert('done')
     })
    }
  }

}
</script>
