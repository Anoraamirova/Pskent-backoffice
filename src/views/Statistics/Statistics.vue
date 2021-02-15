<template>
  <div>
    <v-container class="py-0" fluid>
      <v-row justify="center" class="px-0 py-0">
        <v-col cols="12" id="mapId" class="px-0 py-0">
          <GmapMap
            :options="options"
            :center="{ lat: zooms.lat, lng: zooms.long }"
            :zoom="zooms.zm"
            map-type-id="terrain"
            style="width: 100%; height: 530px"
          >
            <GmapMarker
              @click="toggleInfoWindow(m)"
              :key="index"
              v-for="(m, index) in desserts"
              :position="{ lat: parseFloat(m.lat), lng: parseFloat(m.lng) }"
              :clickable="true"
            />
            <gmap-info-window
              v-if="infoWindow.open"
              :options="{ maxWidth: 400 }"
              :position="infoWindow.position"
              :opened="infoWindow.open"
              @closeclick="infoWindow.open = false"
            >
              <div>
                <v-img
                  :src="infoWindow.data.image.imageUrl"
                  height="310px"
                  gradient="180deg, rgba(25,32,72,.3), rgba(0, 0, 0, 0.790)"
                  dark
                >
                  <v-row justify="center" align="end" class="fill-height">
                    <v-col cols="12" align-self="end">
                      <v-card color="transparent" flat>
                        <v-card-title class="white--text pt-1">
                          <v-list color="transparent" class="px-0">
                            <v-list-item class="px-0">
                              <v-list-item-avatar>
                                <v-icon size="40">mdi-account</v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title class="body-2">{{
                                  infoWindow.data.citizen.name +
                                    " " +
                                    infoWindow.data.citizen.surname
                                }}</v-list-item-title>
                                <v-list-item-subtitle class="body-caption">{{
                                  infoWindow.data.citizen.phone
                                }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                          <span class="text-caption">{{
                            infoWindow.data.description
                          }}</span>
                        </v-card-title>
                        <v-card-actions>
                          <v-btn
                            color="#00BCD4"
                            :to="`/statistika/${infoWindow.data.id}`"
                            >{{ $t("koproq") }}</v-btn
                          >
                          <v-spacer></v-spacer>
                          <v-btn
                            color="warning"
                            outlined
                            @click="
                              copyAddress(
                                infoWindow.data.lat,
                                infoWindow.data.lng
                              )
                            "
                            ><v-icon>mdi-near-me</v-icon></v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-img>
              </div>
            </gmap-info-window>
          </GmapMap>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" id="customTableId">
          <v-card flat>
            <v-card-title>
              <v-col cols="auto">
                <v-select
                  hide-details
                  :items="isOrganization ? types : typesForOrg"
                  return-object
                  v-model="selectedType"
                  item-text="title"
                  item-value="title"
                  :label="$t('murojaat_holat_tanla')"
                  color="#00BCD4"
                  blue
                >
                  ></v-select
                >
              </v-col>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('Qidirish')"
                single-line
                hide-details
                color="#00BCD4"
              ></v-text-field>
            </v-card-title>
            <v-data-table
              calculate-widths
              :no-data-text="$t('malumot_yoq')"
              :no-results-text="$t('natija_yoq')"
              class="elevation-0"
              :items-per-page="15"
              hide-default-footer
              :headers="headers"
              :items="desserts"
              :search="search"
              color="#00BCD4"
            >
              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | moment("DD.MM.YYYY, HH:mm") }}
              </template>
              <template v-slot:item.citizen.name="{ item }">
                <v-list three-line color="transparent">
                  <v-list-item>
                    <v-list-item-avatar size="40" color="#00BCD4">
                      <v-icon size="40" color="#00BCD4">mdi-account</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.citizen.name + ' ' + item.citizen.surname"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="'+' + item.citizen.phone"
                      ></v-list-item-subtitle>
                      <p class="#00BCD4--text">
                        <v-icon color="#00BCD4" size="16">mdi-home-city</v-icon>
                        {{ item.citizen.street + " " + item.citizen.home }}
                      </p>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
              <template v-slot:item.categoryId="{ item }">
                <v-row>
                  <v-col cols="auto">
                    <v-btn fab small text @click="focusOnMap(item)"
                      ><v-icon color="light-#00BCD4 darken-2"
                        >mdi-magnify-plus</v-icon
                      ></v-btn
                    >
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      outlined
                      color="#00BCD4"
                      @click="$router.push(`statistika/${item.id}`)"
                      >{{ $t("koproq") }}
                      <v-icon right>mdi-arrow-right</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
            <v-row justify="end">
              <v-col cols="auto">
                <v-pagination
                  v-if="totallength"
                  v-model="selectedPage"
                  :length="totallength"
                  color="#00BCD4"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Categories from '../../services/Categories'
import * as easings from 'vuetify/es5/services/goto/easing-patterns'
import socket from '../../plugins/socket'
// console.log(socket.io)
// import io from 'socket.io-client'
export default {
  components: {},
  data () {
    return {
      optionsTable: {},
      totallength: 0,
      selectedPage: 1,
      // socket: io(process.env.VUE_APP_VARIABLE, { transports: ['websocket'] }),
      selectedType: {
        id: 1,
        title: 'Yangi Murojaatlar',
        value: [],
        length: ''
      },
      search: '',
      zooms: {
        lat: 40.1250183,
        long: 67.8434926,
        zm: 12
      },
      ps: {
        lat: 40.1250183,
        long: 67.8434926
      },
      index: 0,
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      infoWindow: {
        template: '',
        position: {
          lat: 40.1250183,
          long: 67.8434926
        },
        open: false
      },
      markers: [],
      desserts: [],
      headers: [
        {
          text: this.$t('murojaat_fish'),
          align: 'start',
          value: 'citizen.name'
        },
        {
          text: this.$t('muammo_manzili'),
          align: 'start',
          value: 'addressMap'
        },
        {
          text: this.$t('yuborilgan_sana'),
          align: 'start',
          value: 'createdAt'
        },
        {
          text: this.$t('muammo_turi'),
          align: 'start',
          value: 'category.name_uz'
        },
        {
          text: this.$t('korish'),
          align: 'start',
          value: 'categoryId',
          width: '20%'
        }
      ],
      types: [
        {
          title: this.$t('yangi_murojaatlar'),
          id: 1,
          value: [],
          length: 0
        },
        {
          title: this.$t('jarayondagi_murojaatlar'),
          id: 2,
          value: [],
          length: 0
        },
        {
          title: this.$t('yopilgan_murojaatlar'),
          id: 3,
          value: [],
          length: 0
        },
        {
          title: this.$t('rad_etilgan_murojaatlar'),
          id: 4,
          value: [],
          length: 0
        },
        {
          title: this.$t('tasdiqlanmagan_murojaatlar'),
          id: 5,
          value: [],
          length: 0
        }
      ],
      typesForOrg: [
        {
          title: 'Yangi Murojaatlar',
          id: 1,
          value: [],
          length: 0
        },
        {
          title: 'Yopilgan Murojaatlar',
          id: 3,
          value: [],
          length: 0
        }
      ],
      easing: 'easeInOutCubic',
      easings: Object.keys(easings)
    }
  },
  watch: {
    selectedType: {
      handler (list) {
        // console.log(list)
        this.desserts = list.value
        this.totallength = list.length
      },
      deep: true
    },
    selectedPage (page) {
      this.$vuetify.goTo('#customTableId', {
        duration: 200,
        offset: 0,
        easing: this.easing
      })
      // console.log(this.selectedType)
      Categories.getSortedRequests(this.selectedType.id, page, 10).then(res => {
        // console.log(res)
        this.desserts = res.data
      })
      console.log(page)
    }
  },
  computed: {
    isOrganization () {
      if (this.$store.state.user) {
        return (
          this.$store.state.user.roles[0].id === 3 ||
          this.$store.state.user.roles[0].id === 1
        )
      }
      return false
    }
  },
  methods: {
    copyAddress (lat, lng) {
      this.$copyText(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      ).then(e => {
        alert('Saqlandi')
      })
    },
    focusOnMap (val) {
      // console.log(val)
      this.$vuetify.goTo('#mapId', {
        duration: 200,
        offset: 0,
        easing: this.easing
      })
      this.zooms.zm = 12
      this.infoWindow.open = false
      setTimeout(() => {
        this.zooms.lat = parseFloat(val.lat)
        this.zooms.long = parseFloat(val.lng)
        this.zooms.zm = 16
        this.toggleInfoWindow(val)
      }, 500)
    },
    toggleInfoWindow (val) {
      this.zooms.zm = 15
      this.infoWindow.position = {
        lat: parseFloat(val.lat),
        lng: parseFloat(val.lng)
      }
      this.infoWindow.open = true
      this.infoWindow.data = val
      // console.log(val)
    },
    getAll () {
      Promise.all([
        // fuqaro to hokim
        Categories.getSortedRequests(1, 1, 10),
        // hokim to tashkilot
        Categories.getSortedRequests(2, 1, 10),
        // hokim closed
        Categories.getSortedRequests(3, 1, 10),
        // hokim rejected
        Categories.getSortedRequests(4, 1, 10),
        // organization solved
        Categories.getSortedRequests(5, 1, 10)
      ])
        .then(res => {
          if (
            this.$store.state.user.roles[0].id === 3 ||
            this.$store.state.user.roles[0].id === 1
          ) {
            // console.log(res)
            // Hokimyat operatorlari va admin
            // Yangi Murojaatlar
            this.types[0].value = res[0].data
            this.types[0].length = Math.ceil(res[0].headers.totallength / 10)
            // Jarayondagi murojaatlar
            this.types[1].value = res[1].data
            this.types[1].length = Math.ceil(res[1].headers.totallength / 10)
            // Yopilgan Murojaatlar
            this.types[2].value = res[2].data
            this.types[2].length = Math.ceil(res[2].headers.totallength / 10)
            // Rad etilgan Murojaatlar
            this.types[3].value = res[3].data
            this.types[3].length = Math.ceil(res[3].headers.totallength / 10)
            // Qayta topshirilgan Murojaatlar
            this.types[4].value = res[4].data
            this.types[4].length = Math.ceil(res[4].headers.totallength / 10)

            this.desserts = res[0].data
            this.totallength = Math.ceil(res[0].headers.totallength / 10)
            // this.totallength = parseInt(res[0].headers.totallength)
          } else if (this.$store.state.user.roles[0].id === 5) {
            // tashkilot operatorlar
            // hokim to tashkilot
            this.typesForOrg[0].value = res[1].data
            this.typesForOrg[0].length = Math.ceil(
              res[1].headers.totallength / 10
            )
            // closed
            this.typesForOrg[1].value = res[2].data
            this.typesForOrg[1].length = Math.ceil(
              res[2].headers.totallength / 10
            )

            this.desserts = this.typesForOrg[0].value
            this.totallength = this.typesForOrg[0].length
          }
          this.$store.commit('setloading', false)
          // console.log(this.types)
        })
        .catch(err => {
          this.$store.commit('setloading', false)
          console.log(err)
        })
    },
    soundEffect (data) {
      const audio = new Audio(require('@/assets/sound/notify.mp3'))
      audio.play()
      this.desserts.unshift(data)
    }
  },
  mounted () {
    const language = localStorage.getItem('locale')
    if (language) {
      if (language === 'ru') {
        this.headers[3].value = 'category.name_ru'
      } else if (language === 'uz') {
        this.headers[3].value = 'category.name_uz'
      }
    }

    socket.emit('authentication', { token: this.$store.state.user.token })
    // console.log('auth send:', this.$store.state.user.token)
    socket.on('authenticated', () => {
      console.log('connected...')
      socket.on('newRequest', data => {
        console.log(data)
        this.soundEffect(data)
      })
    })

    this.$store.commit('setloading', true)
    this.getAll()
  },
  beforeRouteLeave (to, from, next) {
    // socket.disconnect()
    // console.log('disconnected')
    next()
  }
}
</script>

<style></style>
