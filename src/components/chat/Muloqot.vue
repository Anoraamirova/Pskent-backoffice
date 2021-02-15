<template>
  <v-row>
    <v-col cols="4">
      <v-list style="overflow-y: scroll" height="90vh" two-line>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(tashkilot, i) in tashkilotNomi"
            :key="i"
            @click.prevent="openDialog(tashkilot)"
            color="#00BCD4"
          >
            <v-list-item-content>
              <v-list-item-title v-text="tashkilot.name"></v-list-item-title>
              <v-list-item-subtitle>{{
                tashkilot.organization.name
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <!-- {{ countMessages[i] ? " (" + countMessages[i].count + ")" : "" }} -->
            <v-list-item-icon>
              <v-icon :color="tashkilot.status ? '#00BCD4' : 'grey'"
                >mdi-chat</v-icon
              >
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
    <!-- new----------start------------------ -->
    <v-col
      style="border-left: 1px solid #00BCD4; height: 90vh"
      class="d-flex flex-column justify-space-between pl-0"
    >
      <v-card-subtitle v-model="organ_name" class="display-1" color="#00BCD4">{{
        organ_name
      }}</v-card-subtitle>
      <hr style="color: #00BCD4" />
      <v-list style="overflow-y: scroll" height="800px" id="mainScroll">
        <v-list-item
          :class="
            msg.fromUserId !== reciever.id ||
            msg.sendBy.username === userInfo.username
              ? 'd-flex justify-end'
              : 'd-flex justify-start'
          "
          v-for="msg in historyMessages.slice().reverse()"
          :key="msg"
        >
          <v-chip
            v-if="
              msg.fromUserId !== reciever.id ||
                msg.sendBy.username === userInfo.username
            "
            style="height: auto; white-space: normal; max-width: 400px"
            class="px-4 py-2 mb-2"
            color="#E3F2FD"
          >
            <!-- {{ msg.message + " , " + JSON.stringify(msg.file) }} -->
            <p style="word-break: break-all">{{ msg.message }}</p>
          </v-chip>
          <!-- toUserId=reciever.id -->
          <v-chip
            v-if="
              msg.fromUserId === reciever.id &&
                msg.sendBy.username !== userInfo.username
            "
            style="height: auto; white-space: normal; max-width: 400px"
            class="px-4 py-2 mb-2"
            color="#EDE7F6"
          >
            <p style="word-break: break-all">{{ msg.message }}</p>
          </v-chip>

          <sub class="ml-2" style="font-size: 0.5rem">
            {{ formatTimeMessage(msg.createdAt) }}
          </sub>
          <sub v-if="msg.isEdited" class="ml-2" style="font-size: 0.5rem">
            Edited
          </sub>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="primary"
            @click.prevent="deleteChat(msg.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-icon
            v-if="
              marker &&
                (msg.fromUserId !== reciever.id ||
                  msg.sendBy.username === userInfo.username)
            "
            @click.prevent="editMessage(msg)"
            >mdi-pencil</v-icon
          >
        </v-list-item>
        <span style="color: white">...</span><br />
        <p id="scrollTome"></p>
      </v-list>
      <div class="px-5">
        <!-- Rasm yuklash -->
        <!-- <upload-btn
          accept="image/*"
          v-model="formFields.image"
          color="transparent"
          class="d-flex justify-start mb-2 mr-5 red--text text--lighten-1 pa-0 ma-0 text-left"
          title="Qo'shish"
        >
          <template slot="icon">
            <v-icon large color="red lighten-2">mdi-file-plus</v-icon>
          </template>
        </upload-btn> -->
        <div class="scroll-button">
          <v-btn
            class="my-2"
            fab
            dark
            small
            color="#00BCD4"
            @click="Scrolling()"
          >
            <v-icon dark> mdi-chevron-down </v-icon>
          </v-btn>
        </div>
        <v-textarea
          height="100px"
          solo
          v-model="message"
          :append-outer-icon="marker ? 'mdi-send' : 'mdi-pencil'"
          filled
          clear-icon="mdi-close-circle"
          color="#00BCD4"
          clearable
          label="Xabar yozing"
          type="text"
          @click:append="toggleMarker"
          @click:append-outer="
            marker
              ? formFields.image
                ? postWithImage()
                : sendMessage()
              : editChat()
          "
          @click:clear="clearMessage"
          class="mb-0 pb-0"
        ></v-textarea>
      </div>
    </v-col>
  </v-row>
</template>
<script
  type="text/javascript"
  src="node_modules/vuejs/dist/vue.min.js"
></script>
<script
  type="text/javascript"
  src="node_modules/vuetify-upload-button/dist/upload-button.min.js"
></script>
<script type="text/javascript">
Vue.use(UploadButton);
</script>
<script>
import UploadButton from "vuetify-upload-button";
import socket from "../../plugins/socket";
import Chats from "../../services/Chats";
import MiddleRequests from "../../services/MiddleRequests";
export default {
  components: {
    "upload-btn": UploadButton
  },
  data: () => ({
    countMessages: [],
    reciever: {},
    historyMessages: [],
    formFields: {
      id: "",
      message: "",
      toUserId: "",
      image: null
    },
    organ_name: "",
    tashkilotNomi: [],
    password: "Password",
    show: false,
    message: "",
    marker: true,
    iconIndex: 0
  }),
  computed: {
    userInfo() {
      console.log("User info: " + JSON.stringify(this.$store.state));
      return this.$store.state.user;
    }
  },
  methods: {
    Scrolling() {
      const scroll_element = document.querySelector("#scrollTome");
      if (scroll_element) {
        scroll_element.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    },
    updateScroll(el) {
      var updatedHeight = document.querySelector(el);
      updatedHeight.scrollTop = updatedHeight.scrollHeight;
    },
    formatTimeMessage(d) {
      const mydate = new Date(d);
      mydate.toLocaleString();
      var onlyTime = mydate;
      onlyTime = String(onlyTime).slice(4, 25);
      return onlyTime;
    },
    getAll(toUserId) {
      Chats.getAll(toUserId)
        .then(res => {
          this.historyMessages = res.data;
          console.log(JSON.stringify(this.historyMessages));
        })
        .catch(err => console.log(err));
      this.clearMessage();
    },
    postChat() {
      Chats.postChat({
        message: this.message,
        toUserId: this.reciever.id
      })
        .then(res => {
          this.getAll(this.reciever.id);
          console.log("created:\n" + JSON.stringify(res));
        })
        .catch(err => console.log(err));
    },
    editChat() {
      Chats.editChat(
        {
          message: this.message,
          toUserId: this.formFields.toUserId
        },
        this.formFields.id
      )
        .then(res => {
          this.getAll(this.reciever.id);
          console.log("Edited:\n" + JSON.stringify(res));
        })
        .catch(err => console.log(err));
    },
    editMessage(msg) {
      this.formFields.id = msg.id;
      this.formFields.message = msg.message;
      this.formFields.toUserId = msg.toUserId;
      this.message = msg.message;
      this.marker = false;
    },
    deleteChat(id) {
      Chats.deleteChat(id)
        .then(res => {
          console.log(res);
          this.getAll(this.reciever.id);
        })
        .catch(err => console.log(err));
    },
    getChatStats() {
      Chats.getChatStats()
        .then(res => {
          this.countMessages = res.data;
          console.log(JSON.stringify(this.countMessages));
        })
        .catch(err => console.log(err));
    },
    postWithImage() {
      if (this.formFields.image && this.message) {
        const formData = new FormData();
        formData.append("file", this.formFields.image);
        MiddleRequests.sendImage(formData)
          .then(res => {
            Chats.postChat({
              fileId: res.data.id,
              message: this.message,
              toUserId: this.reciever.id
            })
              .then(result => {
                this.getAll(this.reciever.id);
                this.resetIcon();
                this.clearMessage();
                console.log("created:\n" + JSON.stringify(res));
              })
              .catch(err => {
                alert(err.data.errors[0]);
                console.log(err);
              });
          })
          .catch(err => {
            alert("error ocurred");
            console.log(err);
          });
      }
    },
    openDialog: function(user) {
      this.organ_name = user.name;
      this.reciever = user;
      this.getAll(user.id);
      this.clearMessage();
    },
    toggleMarker() {
      this.marker = !this.marker;
    },
    sendMessage() {
      if (this.message !== "") {
        this.postChat();
        this.updateScroll("#mainScroll");
        this.resetIcon();
        this.clearMessage();
        // this.updateScroll("#mainScroll");
      }
    },
    clearMessage() {
      this.message = "";
      this.formFields.id = "";
      this.formFields.message = "";
      this.formFields.toUserId = "";
      this.message = "";
      this.iconIndex = 0;
      this.marker = true;
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++;
    }
  },
  created() {
    console.log(this.$route);
  },
  mounted() {
    socket.emit("authentication", { token: this.$store.state.user.token });
    socket.on("authenticated", () => {
      socket.emit("msg", "msg");
      console.log("connected...");
      // this.getChatStats();
      // *shu lineda getStatsMessages() qilish kerak
      socket.on("usersList", list => {
        this.tashkilotNomi = list;
        console.log(this.tashkilotNomi);
      });
      socket.on("postMessage", newMsg => {
        console.log("this.reciever.id:  " + this.reciever.id);
        console.log("newMsg.fromUserId:  " + newMsg.fromUserId);
        if (this.reciever.id) {
          this.getAll(this.reciever.id);
          console.log("getAll()");
        }
        if (this.reciever.id !== newMsg.fromUserId) {
          alert("From: " + newMsg.sendBy.name + "\nMessage: " + newMsg.message);
          this.countMessages[newMsg.fromUserId - 1]++;
        }
      });
      socket.on("readMessage", msg => {
        // msg.id li messageni isRead=true bo'lishi kerak yoki getAll()
        // keyin
      });
    });
  }
};
</script>

<style scoped>
.scroll-button {
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}
</style>
