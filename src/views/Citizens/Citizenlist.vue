<template>
  <div>
    <v-container fluid>
      <h1 class="display-1 ma-10">
        {{ $t("Royxatdan_otgan_fuqarolar_royxati") }}
      </h1>
      <v-row>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('Qidirish')"
          single-line
          hide-details
          color="#00BCD4"
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-row>

      <v-row justify="end">
        <v-col cols="12" v-if="desserts.length > 0">
          <v-data-table
            :no-data-text="$t('malumot_yoq')"
            :no-results-text="$t('natija_yoq')"
            :headers="headers"
            :items="desserts"
            :items-per-page="10"
            :loading="loading1"
            :search="search"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:item.id="{ item }">
              {{ item.id }}
            </template>
            <template v-slot:item.name="{ item }">
              {{ item.name + " " + item.surname }}
            </template>
            <template v-slot:item.street="{ item }">
              <span v-if="item.street">
                {{ item.street }}
              </span>
            </template>

            <template v-slot:item.home="{ item }">
              <span v-if="item.home">
                {{ item.home }}
              </span>
            </template>

            <template v-slot:item.phone="{ item }">
              <span v-if="item.phone">
                {{ item.phone }}
              </span>
            </template>

            <template v-slot:item.createdAt="{ item }">
              <span v-if="item.createdAt">
                {{ item.createdAt | moment("DD.MM.YYYY, HH:mm") }}
              </span>
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
    </v-container>
  </div>
</template>

<script>
// import Categories from '../../services/Categories'
import Citizens from '../../services/Citizens'
export default {
  components: {},
  data () {
    return {
      pageCount: 3,
      totalDesserts: 0,
      loading1: false,
      options: { page: 1 },
      base: process.env.VUE_APP_BASE_URL,
      headers: [
        {
          text: 'N',
          align: 'start',
          value: 'id'
        },
        {
          text: this.$t('murojaat_fish'),
          align: 'start',
          value: 'name'
        },
        {
          text: this.$t('manzili'),
          align: 'start',
          value: 'street'
        },
        {
          text: this.$t('uy'),
          align: 'start',
          value: 'home'
        },
        {
          text: this.$t('telefon_raqam'),
          align: 'start',
          value: 'phone'
        },
        {
          text: this.$t('qoshilgan_sanasi'),
          align: 'start',
          value: 'createdAt'
        }
      ],
      desserts: [],
      search: ''
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
        this.doRequest(newValue, 10)
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
    resetDefault () {
      this.$store.commit('setloading', true)
      this.$store.commit('setPagination', 1)
      this.doRequest(1, 10)
    },
    getRequests (id) {
      this.doRequest(id, 10)
    },
    doRequest (page, size = 10) {
      this.loading1 = true
      Citizens.getCitizens(page, size)
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
    }
  },
  created () {
    this.$store.commit('setloading', true)
    this.getRequests(this.$store.state.page)
  }
}
</script>

<style></style>
