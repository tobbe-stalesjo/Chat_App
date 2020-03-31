//import ws from '../socket.js'
import { create_UUID } from '../utilities/uuid.js'

export default{
  template: `
      <div>
        <form class="messageForm" @submit.prevent="submitMessage">
        <textarea type="text" 
        v-model="messageInput" 
        placeholder="Type your message here..." 
        rows="10" 
        cols="30" 
        @keydown="inputHandler"
        required></textarea>

        <button 
        class ="shareButton"
        type="file" 
        name="files" 
        accept=".png,.jpg,.jpeg,.gif,.bmp,.jfif" 
        multiple 
        @change="filesChange($event.target.files)">
        📁
        </button>

        <button class="sendButton">Send</button>
        </form>


      </div>
  `,

  props: []
  ,

  data(){
      return{
         messageInput: '',
         images: [],
         imageFiles: null
      }
  },
  
  methods: {
    inputHandler(e){
      if (e.keyCode === 13 && !e.shiftKey){
        e.preventDefault()
        this.submitMessage()
      }
    },
    async submitMessage(){
      if (this.messageInput != ''){

        let message;
        let messageBody = {
          user_id: this.$store.state.currentUser.id,
          content: this.messageInput,
          channel_id: this.currentChannel.id,
          message_time: Date.now(),
          imageUrl: this.images[0]
        }
        try{
          message = await fetch('/rest/messages',{
            method: 'POST',
            body: JSON.stringify(messageBody),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }catch(e){
        console.log(e)
        }
      }

      this.messageInput = ''
    },

    async filesChange(fileList) {
      if (!fileList.length) return;

      // handle file changes
      const formData = new FormData();

      // reset images array on file change
      this.images = []

      // append the files to FormData
      Array.from(Array(fileList.length).keys())
        .map(x => {

          // create a new unique filename
          const uuid = create_UUID()

          let fileExt = fileList[x].name
          fileExt = fileExt.slice(fileExt.lastIndexOf('.'))
          const filename = uuid + fileExt

          // save image url in frontend array
          this.images.push('/uploads/' + filename)
          formData.append("files", fileList[x], filename);
        });

      // store formData to be sent later
      this.imageFiles = formData
    }
  },

  computed: {
    currentChannel(){
      return this.$store.state.currentChannel
    }
  }
}