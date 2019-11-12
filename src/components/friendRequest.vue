<template>
  <div class="modal fade" id="exampleModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body ml-4" >

            <div class="">
                <span v-for='(request,index) in requestList' :key='index'>{{request.requestData.requesterId}}
                  <button type="button" class="btn btn-success" v-on:click='requestAccept(request.requestId,request.requestData)'>Accept</button>
                    <button type="button" class="btn btn-danger" v-on:click='requestReject(request.requestId)' >Reject</button>
                 </span>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <!-- <button  v-show="newChat.name.length !== 0" type="button" class="btn btn-primary" v-on:click="newRef(newChat)" data-dismiss="modal">
            <span v-if='newChat.type == "request" ' >Send Request</span>
            <span v-else-if='newChat.type == "group" ' >Create Group</span>
          </button> -->
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

    }
  },
  methods:{
    requestAccept:function(requestId,requesterData){
      this.$store.commit('requestAccept',{requestId , requesterData})
    },
    requestReject:function(requestId){
      this.$store.commit('rejectRequest',{requestId})
    },

  },
  computed:{
    requestList(){
      return this.$store.getters.requestList
    }
  },
  created:function(){

  }
}
</script>
