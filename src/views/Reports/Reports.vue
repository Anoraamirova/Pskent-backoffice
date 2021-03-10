<template>
  <div>
    <v-container fluid>
      <v-row v-if="true" align="center" class="mx-auto">
        <v-col cols="4">
          <v-select
            v-model="selectedOrg"
            return-object
            hide-details
            :items="organizations"
            :label="$t('tashkilot_nomi')"
            item-text="name"
            item-value="name"
            dense
            color="#00BCD4"
          ></v-select>
        </v-col>
        <v-col cols="auto">
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            color="#00BCD4"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                :label="$t('boshlanish_vaqti')"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="#00BCD4"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="menu1 = false"
              color="#00BCD4"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="auto">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            color="#00BCD4"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="finishDate"
                :label="$t('tugash_vaqti')"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="#00BCD4"
              ></v-text-field>
            </template>
            <v-date-picker
              :min="startDate"
              v-model="finishDate"
              @input="menu2 = false"
              color="#00BCD4"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="auto">
          <v-btn
            v-if="isFilterActive"
            text
            fab
            small
            class="mx-2"
            @click="resetDefault"
            elevation="0"
            color="white"
            ><v-icon>mdi-filter-remove-outline</v-icon></v-btn
          >
          <v-btn
            small
            @click="getFilteredOrgs(1, 10)"
            elevation="0"
            color="grey lighten-1"
            text-color="white"
            >{{ $t("Qidirish")
            }}<v-icon right color="white">mdi-filter</v-icon></v-btn
          >
          <v-btn
            class="mx-4"
            small
            fab
            white
            color="#00BCD4"
            :href="`${base}${getExcelUrl}`"
            target="_blank"
            ><v-icon color="white">mdi-printer-settings</v-icon></v-btn
          >
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="12">
          <v-data-table
            :options.sync="options"
            :no-data-text="$t('malumot_yoq')"
            :no-results-text="$t('natija_yoq')"
            :headers="headers"
            :items="desserts"
            :items-per-page="10"
            :server-items-length="totalDesserts"
            :loading="loading1"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:item.citizen="{ item }">
              {{ item.citizen.name + " " + item.citizen.surname }}
              <p class="black--text">
                <v-icon color="#00BCD4" size="16">mdi-home-city</v-icon>
                {{ item.citizen.street + " " + item.citizen.home }}
              </p>
            </template>
            <template v-slot:item.createdAt="{ item }">
              <span v-if="item.createdAt">
                {{ item.createdAt | moment("DD.MM.YYYY, HH:mm") }}
              </span>
            </template>
            <template v-slot:item.closedDate="{ item }">
              <span v-if="item.closedDate">
                {{ item.closedDate | moment("DD.MM.YYYY, HH:mm") }}
              </span>
            </template>
            <template v-slot:item.deadline="{ item }">
              <span v-if="item.deadline">
                {{ item.deadline | moment("DD.MM.YYYY, HH:mm") }}
              </span>
            </template>
            <template v-slot:item.id="{ item }">
              <v-btn
                @click="$router.push(`/statistika/${item.id}`)"
                fab
                small
                text
                color="#00BCD4"
                ><v-icon>mdi-eye</v-icon></v-btn
              >
            </template>
            <template v-slot:item.tick="{ item }">
              <v-checkbox
                :disabled="!item.isClosed"
                :checked="item.isChecked"
                v-model="item.isChecked"
                @change="hirequest(item)"
              ></v-checkbox>
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="auto">
          <v-pagination
            v-model="page"
            :length="totalDesserts"
            color="#00BCD4"
          ></v-pagination>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ReportForRating />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ReportForRating from '../Reports/ReportForRating'
import Categories from '../../services/Categories'
import Organizations from '../../services/Organizations'
export default {
  components: {
    ReportForRating
  },
  data () {
    return {
      pageCount: 3,
      totalDesserts: 0,
      loading1: false,
      options: { page: 1 },
      selectedOrg: {
        id: ''
      },
      base: process.env.VUE_APP_BASE_URL,
      getExcelUrl: 'requests/excel',
      isFilterActive: false,
      menu1: '',
      menu2: '',
      startDate: '',
      finishDate: '',
      organizations: [],
      headers: [
        {
          text: this.$t('murojaat_fish'),
          align: 'start',
          value: 'citizen'
        },
        {
          text: this.$t('muammo_turi'),
          align: 'start',
          value: 'category.name_uz'
        },
        {
          text: this.$t('sana'),
          align: 'start',
          value: 'createdAt'
        },
        {
          text: this.$t('Tashkilot'),
          align: 'start',
          value: 'organization.name'
        },
        {
          text: this.$t('berilgan_muhlat'),
          align: 'start',
          value: 'deadline'
        },
        {
          text: this.$t('yopilgan_sana'),
          align: 'start',
          value: 'closedDate'
        },
        {
          text: this.$t('holat'),
          align: 'start',
          value: 'status.name_uz'
        },
        {
          text: this.$t('korish'),
          align: 'start',
          value: 'id'
        },
        {
          text: this.$t('Tanlansin'),
          align: 'start',
          value: 'tick'
        }
      ],
      desserts: []
    }
  },
  computed: {
    page: {
      get: function () {
        return this.$store.state.page
      },
      // setter
      set: function (newValue) {
        this.$store.commit('setPagination', newValue)
        if (this.isFilterActive) {
          this.getFilteredOrgs(newValue, 10)
        } else {
          this.doRequest(newValue, 10)
        }
      }
    }
  },
  watch: {
    options: {
      handler (val) {
        // console.log(val)
      },
      deep: true
    }
  },
  methods: {
    getTime (date) {
      if (date) {
        return new Date(date).getTime()
      }
      return ''
    },
    resetDefault () {
      this.getExcelUrl = 'requests/excel'
      this.$store.commit('setloading', true)
      this.isFilterActive = false
      this.startDate = ''
      this.finishDate = ''
      this.selectedOrg = { id: '' }
      this.$store.commit('setPagination', 1)
      this.doRequest(1, 10)
    },
    doRequest (page, size = 10) {
      this.loading1 = true
      Categories.getRequests(page, size)
        .then(res => {
          // console.log(res)
          this.totalDesserts = Math.ceil(
            parseInt(res.headers.totallength) / 10
          )
          this.desserts = res.data
          this.loading1 = false

          this.$store.commit('setloading', false)
        })
        .catch(err => {
          this.loading1 = false
          this.$store.commit('setloading', false)
          console.log(err)
        })
    },
    getRequests (id) {
      this.doRequest(id, 10)
      Organizations.getOrganization()
        .then(res => {
          this.organizations = res.data
        })
        .catch(err => console.log(err))
    },
    getFilteredOrgs (page = 1, size = 10) {
      this.$store.commit('setloading', true)
      this.isFilterActive = true
      Organizations.filterOrganization(
        this.getTime(this.startDate),
        this.getTime(this.finishDate),
        this.selectedOrg.id,
        page,
        size
      )
        .then(res => {
          this.getExcelUrl = `requests/excel?organizationId=${
            this.selectedOrg.id
          }&startDate=${this.getTime(this.startDate)}&endDate=${this.getTime(
            this.finishDate
          )}`
          this.desserts = res.data
          this.totalDesserts = Math.ceil(
            parseInt(res.headers.totallength) / 10
          )
          this.$store.commit('setloading', false)
        })
        .catch(err => {
          this.$store.commit('setloading', false)
          console.log(err)
        })
    },
    hirequest (item) {
      Categories.hirequest(item.id)
        .then(res => {
          if (res.data.msg === 'ok') {
            item.isChecked = !res.data.t
          } else {
            item.isChecked = res.data.t
            alert(res.data.msg)
          }
          // alert(JSON.stringify(item.isChecked))
          // const newitem = this.desserts.find(w => w.id === item.id)
          // alert(JSON.stringify(newitem.isChecked,newitem.isClosed))
          // if (newitem) newitem.isChecked = !newitem.isChecked
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    const language = localStorage.getItem('locale')
    // console.log(language)
    // console.log(this.headers[6].value)
    if (language) {
      if (language === 'ru') {
        this.headers[1].value = 'category.name_ru'
        this.headers[3].value = 'organization.name_ru'
        this.headers[6].value = 'status.name_ru'
      } else if (language === 'uz') {
        this.headers[1].value = 'category.name_uz'
        this.headers[3].value = 'organization.name'
        this.headers[6].value = 'status.name_uz'
      }
    }
    this.$store.commit('setloading', true)
    this.getRequests(this.$store.state.page)
  }
}
</script>

<style>
.v-application .primary--text {
  color: #4caf50 !important;
  caret-color: #4caf50 !important;
}
</style>
