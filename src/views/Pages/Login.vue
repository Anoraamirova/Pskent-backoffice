<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="3">
            <v-card class="elevation-5 pa-7" :loading="loading" color="#fff">
              <v-row justify="center">
                <v-col cols="auto">
                  <v-icon left white size="70" color="#00BCD4"
                    >mdi-briefcase-account</v-icon
                  >
                </v-col>
              </v-row>
              <p class="text-center text-h4" color="#00BCD4">
                <span class="mt-2 white--txt">Obod Pskent</span>
              </p>
              <v-card-text>
                <v-form color="white">
                  <v-text-field
                    v-model="username"
                    label="Foydalanuvchi"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    white
                    color="#00BCD4"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    id="password"
                    label="Parol"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    white
                    v-on:keyup.enter="enter"
                    color="#00BCD4"
                  ></v-text-field>
                </v-form>
                <transition name="slide-fade">
                  <v-alert :type="error.type" v-if="error.flag">
                    {{ error.message }}
                  </v-alert>
                </transition>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="enter" large outlined color="#00BCD4" block
                  >KIRISH</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Auth from '../../services/Auth'
export default {
  props: {
    source: String
  },
  data () {
    return {
      loading: false,
      error: {
        flag: false,
        message: '',
        type: ''
      },
      username: '',
      password: ''
    }
  },
  watch: {
    username (val) {
      // console.log(val)
      this.error = {
        flag: false,
        message: '',
        type: ''
      }
    },
    password (val) {
      this.error = {
        flag: false,
        message: '',
        type: ''
      }
      // console.log(val)
    }
  },
  methods: {
    enter () {
      this.loading = true
      Auth.getToken({ username: this.username, password: this.password })
        .then(res => {
          // console.log(res)
          this.$store.dispatch('login', res.data)
          this.loading = false
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
          if (err.status === 401) {
            this.loading = false
            this.error.flag = true
            this.error.message = 'Login va parolda xatolik bor. Qayta kiriting'
            this.error.type = 'error'
          } else if (err.status === 429) {
            this.loading = false
            this.error.flag = true
            this.error.message =
              "Siz ko'p urunishlar qildingiz. Iltimos 5 daqiqadan so'ng qayta kiriting"
            this.error.type = 'warning'
          }
        })
    }
  }
}
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
