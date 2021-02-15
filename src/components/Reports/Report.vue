<template>
  <div v-if="chkp">
    <GmapMap
      :options="options1"
      :center="{
        lat: parseFloats(userInfo.lat),
        lng: parseFloats(userInfo.lng)
      }"
      :zoom="13"
      map-type-id="terrain"
      :style="`width: 100%; height:${height}px`"
    >
      <GmapMarker
        :position="{
          lat: parseFloats(userInfo.lat),
          lng: parseFloats(userInfo.lng)
        }"
        :clickable="true"
        :icon="
          `http://maps.google.com/mapfiles/ms/icons/${
            userInfo.isClosed ? '#00BCD4' : 'red'
          }-dot.png`
        "
      />
    </GmapMap>
    <v-navigation-drawer width="630" absolute permanent left>
      <v-img
        src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
        height="210px"
        gradient="180deg, rgba(25,32,72,.3), rgba(0, 0, 0, 0.890)"
        dark
      >
        <v-row justify="end">
          <v-col cols="auto" class="py-1">
            <v-btn @click="getUserInfo" dark icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- <div class="text-h4 pt-10">MA</div> -->
        <v-row
          justify="center"
          class="flex flex-column fill-height"
          no-glutters
        >
          <v-card-title class="white--text pt-1 py-0">
            <v-list three-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-uppercase title">{{
                    userInfo.citizen.name + " " + userInfo.citizen.surname
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    ><v-icon color="grey" left size="20">mdi-phone</v-icon
                    >{{ userInfo.citizen.phone }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle class=""
                    ><v-icon color="red" left size="20"
                      >mdi-map-marker-radius</v-icon
                    >{{
                      userInfo.citizen.street + ", " + userInfo.citizen.home
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-title>
        </v-row>
      </v-img>
      <v-row>
        <v-col class="py-0" cols="12">
          <v-card
            ripple
            @click="
              showImage(
                userInfo.comments[0].image.imageUrl,
                userInfo.citizen.name + ' ' + userInfo.citizen.surname,
                userInfo.comments[0].text
              )
            "
            flat
          >
            <v-card-title>
              <h5 class="text-title txtCr">{{ $t("rasm") }}</h5>
              <v-icon right color="#00BCD4"
                >mdi-image-size-select-actual</v-icon
              >
              <v-spacer></v-spacer>
              <span class="text-caption text--disabled"
                ><v-icon size="20" color="grey lighten-1">mdi-update</v-icon>
                {{ userInfo.comments[0].createdAt | moment("D.MM.YYYY") }}</span
              >
            </v-card-title>
            <v-card-text>
              <v-img
                width="50%"
                :src="userInfo.comments[0].image.imageUrl"
                :lazy-src="userInfo.comments[0].image.imageUrl"
                :alt="userInfo.comments[0].image.imageUrl"
              />
              <div class="my-2 text--black text-body-1">
                <v-icon left color="#00BCD4">mdi-message-text</v-icon
                >{{ userInfo.comments[0].text }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="py-0" cols="12">
          <v-card flat class="py-0">
            <v-card-title class="py-0"
              ><h5 class="txtCr">{{ $t("izohlar") }}</h5>
              <v-icon right color="#00BCD4"
                >mdi-comment-text-multiple-outline</v-icon
              >
            </v-card-title>
            <v-list three-line v-if="userInfo.comments">
              <template v-for="(item, i) in userInfo.comments">
                <v-list-item v-if="i !== 0" :key="i">
                  <v-list-item-avatar
                    dark
                    :color="item.typeId == 2 ? 'orange' : '#00BCD4'"
                    size="40"
                  >
                    <span class="text-uppercase">{{
                      item.user.name.substring(0, 2)
                    }}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-caption"
                      ><v-icon left size="20" color="#00BCD4">mdi-bank</v-icon>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span class="text-caption" v-bind="attrs" v-on="on"
                            ><span class="txtCr">{{
                              item.typeId == 2
                                ? $t("Hokimyat")
                                : $t("Tashkilot")
                            }}</span>
                            <v-icon size="10">mdi-record</v-icon>
                            {{ item.user.name }}</span
                          >
                        </template>
                        <span>
                          {{ item.user.name }} -
                          {{ item.createdAt | moment("D.MM.YYYY") }}
                        </span>
                      </v-tooltip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text--#00BCD4"
                      ><strong>{{ $t("izoh") }}: </strong
                      >{{ item.text }}</v-list-item-subtitle
                    >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-subtitle class="mt-1"
                          ><strong>{{ $t("kimga") }}: </strong>
                          <v-chip v-bind="attrs" v-on="on" small
                            >{{
                              item.typeId == 3
                                ? booleanLang
                                  ? govener_ru
                                  : govener
                                : booleanLang
                                ? userInfo.organization.name_ru.substring(
                                    0,
                                    35
                                  ) + "..."
                                : userInfo.organization.name.substring(0, 35) +
                                  "..."
                            }}
                          </v-chip></v-list-item-subtitle
                        >
                      </template>
                      <span>{{
                        item.typeId == 3
                          ? booleanLang
                            ? govener_ru
                            : govener
                          : booleanLang
                          ? userInfo.organization.name_ru
                          : userInfo.organization.name
                      }}</span>
                    </v-tooltip>
                    <v-list-item-subtitle v-if="i == 1"
                      ><strong>{{ $t("muddat") }}: </strong
                      >{{
                        userInfo.deadline | moment("D/MM/YYYY")
                      }}</v-list-item-subtitle
                    >
                    <div v-else-if="item.typeId !== 2">
                      <v-list-item-subtitle else class="my-1"
                        ><strong>{{ $t("bajarildi") }}: </strong
                        >{{
                          item.createdAt | moment("D/MM/YYYY")
                        }}</v-list-item-subtitle
                      >
                      <v-img
                        style="cursor: pointer"
                        @click="
                          showImage(
                            item.image.imageUrl,
                            item.user.name,
                            item.text
                          )
                        "
                        width="300"
                        :src="item.image.imageUrl"
                      ></v-img>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
            <v-row v-else justify="center">
              <v-col cols="auto">
                <v-icon size="100" color="grey lighten-4"
                  >mdi-comment-search-outline</v-icon
                >
              </v-col>
              <v-col cols="12" class="py-0">
                <p class="text-center headline text--disabled">IZOH YO'Q</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <template
        v-if="
          userInfo.comments.length == 1 &&
            ($access(1) || $access(3)) &&
            userInfo.status.id !== 4
        "
        v-slot:append
      >
        <v-row class="pa-2" justify="space-around">
          <v-col cols="auto">
            <v-btn text @click="$router.push('/statistika')"
              ><v-icon left>mdi-arrow-left-box</v-icon>
              {{ $t("orqaga") }}</v-btn
            >
          </v-col>
          <v-col cols="auto">
            <v-btn text color="red" @click="rejectTask">{{
              $t("rad_etish")
            }}</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="assignTask" color="#00BCD4">{{
              $t("topshiriq")
            }}</v-btn>
          </v-col>
        </v-row>
      </template>
      <template
        v-else-if="
          (userInfo.status.id == 2 || userInfo.status.id == 6) && $access(5)
        "
        v-slot:append
      >
        <v-row class="pa-2" justify="space-around">
          <v-col cols="12">
            <v-btn x-large @click="doTask" block color="success">{{
              $t("Bajarish")
            }}</v-btn>
          </v-col>
        </v-row>
      </template>
      <template
        v-else-if="userInfo.status.id == 5 && ($access(3) || $access(1))"
        v-slot:append
      >
        <v-row class="pa-2" justify="space-around">
          <v-col cols="6">
            <v-btn x-large @click="reAssignRask" block text color="warning">{{
              $t("qayta_topshirish")
            }}</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn x-large @click="confirmTask" block color="success">{{
              $t("tasdiqlash")
            }}</v-btn>
          </v-col>
        </v-row>
      </template>
    </v-navigation-drawer>
    <v-dialog v-model="dialog" width="700">
      <v-card>
        <v-img gradient="" :src="dialogInfo.imageUrl">
          <v-row align="end" class="bck white--text pa-2 fill-height">
            <v-col>
              <div class="subheading text-uppercase mb-2">
                {{ dialogInfo.name }}
              </div>
              <v-divider dark></v-divider>
              <div class="body-2 py-2">{{ dialogInfo.text }}</div>
            </v-col>
          </v-row>
        </v-img>
      </v-card>
    </v-dialog>
    <assign-task :assignedTask="assignedTask" />
    <todo-task :assignedTask="todoTask" />
    <user :userInfo="userProfile" />
    <re-assigned-task :reAssignedTask="reAssignedTask" />
  </div>
</template>

<script>
import MiddleRequests from '../../services/MiddleRequests'
import ReAssignedTask from '../Reports/ReAssignedTask'
import Categories from '../../services/Categories'
import AssignTask from '../Reports/AssignTask'
import User from '../Settings/Users/UserInfo'
import TodoTask from '../Reports/TodoTask'

export default {
  booleanLang: null,
  props: ['id'],
  components: {
    ReAssignedTask,
    AssignTask,
    TodoTask,
    User
  },
  data () {
    return {
      userProfile: {
        dialog: false,
        data: ''
      },
      reAssignedTask: {
        dialog: false,
        data: ''
      },
      assignedTask: {
        dialog: false,
        data: ''
      },
      todoTask: {
        dialog: false,
        data: ''
      },
      dialogInfo: {
        imageUrl: '',
        name: '',
        content: ''
      },
      chkp: false,
      userInfo: { name: '' },
      dialog: false,
      govener: process.env.VUE_APP_GOVERN,
      govener_ru: process.env.VUE_APP_GOVERN_RU,
      height: window.innerHeight - 100,
      options1: {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false
      }
    }
  },
  methods: {
    getUserInfo () {
      this.userProfile.dialog = true
    },
    showImage (dataUrl, name, text) {
      this.dialog = true
      this.dialogInfo.imageUrl = dataUrl
      this.dialogInfo.name = name
      this.dialogInfo.text = text
    },
    parseFloats (val) {
      return parseFloat(val)
    },
    assignTask () {
      this.assignedTask.dialog = true
      this.assignedTask.data = this.userInfo
    },
    doTask () {
      this.todoTask.dialog = true
      this.todoTask.data = this.userInfo
    },
    rejectTask () {
      const r = confirm('Rad etishni tasdiqlash uchun ok tugmasini bosing')
      if (r === true) {
        MiddleRequests.rejectTask(this.userInfo.id)
          .then(res => {
            // console.log(res)
            this.$notify({
              classes: 'my-type',
              type: 'success',
              group: 'foo',
              title: 'Murojaat muvaffaqiyatli rad etildi',
              text: ''
            })
            setTimeout(() => {
              this.$router.push('/statistika')
              location.reload()
            }, 1000)
          })
          .catch(err => console.log(err))
      }
    },
    reAssignRask () {
      this.reAssignedTask.dialog = true
      this.reAssignedTask.data = this.userInfo
    },
    confirmTask () {
      MiddleRequests.confirmTask(this.userInfo.id)
        .then(res => {
          this.$notify({
            group: 'foo',
            title: 'Muammo muvaffaqiyatli tasdiqlandi',
            classes: 'success',
            text: 'Xabar tasdiqlandi'
          })
          location.reload()
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            group: 'foo',
            title: 'Xatolik bor',
            classes: 'error',
            text: 'Xatolik bor'
          })
        })
    },
    getIndividual () {
      Categories.getSingleRequest(this.id)
        .then(res => {
          // console.log(res.data)
          this.userInfo = res.data
          this.userProfile.data = res.data
          this.chkp = true
          this.$store.commit('setloading', false)
        })
        .catch(err => {
          this.chkp = true
          this.$store.commit('setloading', false)
          console.log(err)
        })
    },
    changeLanguages (language) {
      if (language === 'ru') {
        this.booleanLang = true
      } else if (language === 'uz') {
        this.booleanLang = false
      } else {
        this.booleanLang = false
      }
    }
  },
  created () {
    const language = localStorage.getItem('locale')
    this.changeLanguages(language)
    this.$store.commit('setloading', true)
    this.getIndividual()
  }
}
</script>

<style>
.txtCr {
  color: #039be5;
}
.asd {
  color: rgba(0, 0, 0, 0.418);
}
.bck {
  background: linear-gradient(
    180deg,
    rgba(224, 223, 223, 0),
    rgba(56, 56, 56, 0.062),
    rgb(26, 26, 26)
  );
}
</style>
