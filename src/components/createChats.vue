<template>
  <div class="modal fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">create your {{newChat.type}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body ml-4" >
          <div class="row" v-if='newChat.type=="group"'>
              <input type="text" class='form-control ml-5 mr-5' v-model='newChat.name' placeholder='New Chat Group Name'>
          </div>
          <div class="row" v-if='newChat.type=="request"'>
              <input type="text" class='form-control ml-5 mr-5' v-model='newChat.name' placeholder='user Id'>
          </div>
          <div class="row mt-2">
            <div class="col-3 mr-0">
              <h6 class=" ml-0 mr-0" >create :</h6>
            </div>
            <div class="col-9 ml-0">
              <select class="form-control ml-0 mr-5" v-model='newChat.type'>
                <option >group</option>
                <option >request</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button  v-show="newChat.name.length !== 0" type="button" class="btn btn-primary" v-on:click="newRef(newChat)" data-dismiss="modal">
            <span v-if='newChat.type == "request" ' >Send Request</span>
            <span v-else-if='newChat.type == "group" ' >Create Group</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  components: {

  },
  data(){
    return{
      newChat:{
        name:'',
        type:''
      },
    }
  },
  methods:{
    newRef:function(newChat){
      if(newChat.type == 'group'){
        this.$store.commit('createGroup',newChat)
      }else if(newChat.type == 'request'){
        this.$store.commit('createRequest',newChat)
      }
      this.newChat.name=''
      this.newChat.type=''
    }
  },
  computed:{

  },
  created:function(){

  }
}
</script>
