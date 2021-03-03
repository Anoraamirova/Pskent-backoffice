<template>
  <div>
    <v-app v-show="true" id="inspire">
      <v-navigation-drawer
        color="light-#00BCD4"
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
      >
        <v-list>
          <template v-for="item in items">
            <v-list-item
              color="#00BCD4"
              :to="item.path"
              :key="item.text"
              v-if="item.id === 2 || $access(1) || $access(3)"
              link
            >
              <v-list-item-action>
                <v-icon color="#00BCD4">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(item.text) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer
        temporary
        width="350"
        v-model="drawer2"
        color="light-#00BCD4"
        app
        right
      >
        <template v-slot:prepend color="#00BCD4">
          <v-list-item two-line color="#00BCD4">
            <v-list-item-avatar>
              <v-icon>mdi-account</v-icon>
            </v-list-item-avatar>

            <v-list-item-content v-if="userInfo">
              <v-list-item-title>{{ userInfo.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                userInfo.username
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn text color="red" @click.stop="logout" small rounded
                >{{ $t("chiqish") }}
                <v-icon right color="danger" size="20">mdi-export</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>

        <v-divider></v-divider>
        <v-card flat>
          <v-form>
            <v-row justify="center">
              <v-col cols="auto">
                <h4 class="body-1">{{ $t("parol_sozlash") }}</h4>
              </v-col>
              <v-col cols="10" class="py-0">
                <v-text-field
                  outlined
                  dense
                  v-model="setPwd.oldPassword"
                  :label="$t('eski_parol_kiriting')"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col cols="10" class="py-0">
                <v-text-field
                  outlined
                  dense
                  v-model="setPwd.newPassword"
                  :label="$t('yangi_parol_kiriting')"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-12"
                  hint="Kamida 8 ta belgi kiriting"
                  @click:append="show2 = !show2"
                ></v-text-field>
              </v-col>
              <v-col cols="10" class="py-0">
                <v-text-field
                  outlined
                  dense
                  v-model="setPwd.repeatNewPassword"
                  :label="$t('yangi_qayta_parol')"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show3 ? 'text' : 'password'"
                  name="input-10-14"
                  hint="Kamida 8 ta belgi kiriting"
                  @click:append="show3 = !show3"
                ></v-text-field>
              </v-col>
              <v-col cols="10" v-if="error.flag">
                <p class="red--text text-caption">* {{ error.msg }}</p>
              </v-col>
              <v-col cols="10">
                <v-row justify="space-around">
                  <v-col cols="auto">
                    <v-btn
                      :disabled="ispwd"
                      @click="passwordReset"
                      color="#00BCD4"
                      >{{ $t("saqlash") }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="ispwd" cols="11">
                <v-alert dense text type="success">
                  Parolingiz muvaffaqiyatli yangilandi.<strong
                    >Yangi parolni</strong
                  >
                  tasdiqlash uchun qayta kirish paneliga yo'naltirilasiz.
                  Iltimos kuting
                </v-alert>
              </v-col>
              <v-col cols="auto">
                <v-progress-circular
                  v-if="ispwd"
                  size="60"
                  color="success"
                  indeterminate
                  >{{ countDown }}</v-progress-circular
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-navigation-drawer>

      <v-app-bar
        flat
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="light-#00BCD4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title color="#00BCD4" style="width:185px" class="ml-0 pl-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span class="hidden-sm-and-down" v-bind="attrs" v-on="on">
                <v-img
                  src="@/assets/logo.svg"
                  height="30"
                  contain
                  left
                  style="background-size:contain"
                ></v-img
              ></span>
            </template>
            <span>{{
              langboolean
                ? $store.state.user.organization.name_ru
                : $store.state.user.organization.name
            }}</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-row justify="center">

        </v-row> -->
        <v-row justify="end">
          <v-col cols="auto">
            <v-list-item v-if="userInfo" two-line class="px-0">
              <v-radio-group
                row
                v-model="lang"
                mandatory
                @change="setLocale(lang)"
                align-center
                hide-details="true"
                justify-center
                pt-10
              >
                <v-radio label="Uz" value="uz" color="#00BCD4"></v-radio>
                <v-radio label="Ru" value="ru" color="#00BCD4"> </v-radio>
              </v-radio-group>
              <v-list-item-content class="px-0">
                <v-list-item-title>{{ userInfo.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  userInfo.username
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn text @click.stop="drawer2 = !drawer2" small fab
                  ><v-icon size="30">mdi-account-edit</v-icon></v-btn
                >
              </v-list-item-action>
            </v-list-item>
          </v-col>
        </v-row>
        <!-- <v-btn text @click.stop="drawer2 = !drawer2" small fab><v-icon size="30">mdi-account-edit</v-icon></v-btn> -->
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </v-app-bar>
      <v-main>
        <transition name="component-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Users from '../services/Users'
export default {
  props: {
    source: String
  },
  data: () => ({
    langboolean: null,
    lang: null,
    countDown: 5,
    selectLanguage: true,
    show1: false,
    show2: false,
    show3: false,
    error: {
      flag: false,
      msg: ''
    },
    ispwd: false,
    drawer2: false,
    dialog: false,
    drawer: null,
    setPwd: {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: ''
    },
    rules: {
      required: value => !!value || 'Majburiy.',
      min: v => v.length >= 8 || 'Minimal 8 ta belgi',
      emailMatch: () => "The email and password you entered don't match"
    },
    items: [
      { icon: 'mdi-file-compare', path: '/', text: 'hisobotlar', id: 1 },
      {
        icon: 'mdi-chart-bar',
        path: '/statistika',
        text: 'murojaatlar',
        id: 2
      },
      {
        icon: 'mdi-city-variant-outline',
        path: '/sozlamalar/tashkilotlar',
        text: 'hodimlar',
        id: 3
      },
      {
        icon: 'mdi-account-multiple',
        path: '/fuqarolarroyxati',
        text: 'fuqarolar_royhati',
        id: 4
      },
      { icon: 'mdi-forum', path: '/muloqot', text: 'Muloqot', id: 2 }
    ]
  }),
  computed: {
    isAvailable () {
      return this.$store.state.isAvailable
    },
    loading () {
      return this.$store.state.loading
    },
    userInfo () {
      // console.log(this.$store.state)
      return this.$store.state.user
    }
  },
  methods: {
    setLocale (locale) {
      this.lang = locale
      this.$i18n.locale = locale
      localStorage.setItem('locale', locale)
      window.location.reload()
    },
    logout () {
      this.$store.dispatch('logout')
      // console.log(this.userInfo)
      this.$router.push('/pages/login')
    },
    passwordReset () {
      if (
        this.setPwd.oldPassword &&
        this.setPwd.newPassword &&
        this.setPwd.repeatNewPassword
      ) {
        if (
          this.setPwd.oldPassword &&
          this.setPwd.newPassword === this.setPwd.repeatNewPassword &&
          this.setPwd.newPassword.length >= 8
        ) {
          Users.setupPassword(this.setPwd)
            .then(res => {
              // console.log(res)
              this.ispwd = true
              this.countDownTimer()
            })
            .catch(err => {
              this.error.flag = true
              this.error.msg = err.data.errors[0].msg
              console.log(err)
            })
        } else {
          alert(
            'Yangi parollar bir biriga mos emas yoki eski parol kirgazilmagan'
          )
        }
      } else {
        alert('Iltimos formani toliq toldiring')
      }
    },
    countDownTimer () {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1
          this.countDownTimer()
        }, 1000)
      }
      if (this.countDown <= 0) {
        this.$router.push('pages/login')
        this.$store.dispatch('logout')
      }
      // this.ispwd = false
    },
    changeLangOrg (language) {
      if (language === 'ru') {
        this.langboolean = true
      } else if (language === 'uz') {
        this.langboolean = false
      } else {
        this.langboolean = false
      }
    }
  },
  created () {
    const locale = localStorage.getItem('locale')
    this.lang = locale
    if (locale) {
      this.$i18n.locale = locale
    } else if (navigator.language) {
      this.$i18n.locale = navigator.language.substring(0, 2)
    }
    this.changeLangOrg(locale)
  }
}
</script>

<style scoped>
.v-application--is-ltr .v-messages {
  display: none !important;
}
#triangle-up {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  position: absolute;
  border-bottom: 10px solid rgb(0, 195, 255);
}
.v-image__image {
  background-size: contain !important;
}
.v-application--is-ltr .v-messages {
  display: none !important;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
