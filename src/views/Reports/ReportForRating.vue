<template>
  <div>
    <v-row justify="start">
      <v-col cols="12">
        <h3 class="mx-2 text-uppercase">{{ $t("umumiy_hisobot") }}</h3>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="2"
        lg="2"
        v-for="item in governer"
        :key="item.id"
      >
        <v-card elevation="0" dark tile outlined color="#00BCD4">
          <v-card-text class=" text--white" text-color="#000000">
            <h1 class="h1 display-3">{{ item.value }}</h1>
            <p>{{ $t(item.text) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" v-if="desserts.length">
        <v-data-table
          no-data-text="Ma'lumot yoq. Sahifani yangilang"
          no-results-text="Natija yo'q"
          calculate-widths
          :headers="headers"
          :items="desserts"
          disable-pagination
          disable-filtering
          hide-default-footer
          class="elevation-0"
        >
          <template v-slot:top>
            <v-toolbar flat color="#00BCD4">
              <h3 class="mr-2" style="color:#fff">{{ $t("tashkilot_des") }}</h3>
              <v-btn
                class="mx-4"
                small
                white
                :href="`${base}organizations/report?format=excel`"
                target="_blank"
                >Excel
                <v-icon right color="#000"
                  >mdi-file-download-outline</v-icon
                ></v-btn
              >
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Organizations from '../../services/Organizations'
import Categories from '../../services/Categories'
export default {
  data () {
    return {
      base: process.env.VUE_APP_BASE_URL,
      governer: [
        {
          text: 'barcha_murojaatlar',
          value: ''
        },
        {
          text: 'yangi_murojaatlar',
          value: ''
        },
        {
          text: 'jarayondagi_murojaatlar',
          value: ''
        },
        {
          text: 'hal_etilgan_murojaatlar',
          value: ''
        },
        {
          text: 'rad_etilgan_murojaatlar',
          value: ''
        },

        {
          text: 'Ortacha_sarf_qilingan_soat',
          value: ''
        }
      ],
      headers: [
        {
          text: this.$t('tashkilot_nomi'),
          align: 'start',
          value: 'Tashkilot nomi'
        },
        {
          text: this.$t('jami_murojaatlar'),
          align: 'start',
          value: 'Murojaatlar soni'
        },
        {
          text: this.$t('jarayondagi_murojaatlar'),
          align: 'start',
          value: 'Jarayondagi murojaatlar'
        },
        {
          text: this.$t('muddatdan_otib_hal_qilinmagan_murojaatlar'),
          align: 'start',
          value: "Muddatidan o'tib hal etilmagan"
        },
        {
          text: this.$t('hal_etilgan_murojaatlar'),
          align: 'start',
          value: 'Hal etilgan murojaatlar'
        },
        {
          text: this.$t('muddatdan_otib_hal_qilingan_murojaatlar'),
          align: 'start',
          value: "Muddatidan o'tib hal etilgan"
        }
      ],
      desserts: []
    }
  },
  methods: {
    getAll () {
      Organizations.getSortedOrganizations()
        .then(res => {
          // console.log(res.data)
          this.desserts = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getReports () {
      Categories.getStats()
        .then(res => {
          this.governer[0].value = res.data.all
          this.governer[1].value = res.data.inHokimiyat
          this.governer[2].value = res.data.reviewed
          this.governer[3].value = res.data.closed
          this.governer[4].value = res.data.rejected
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTime () {
      Categories.getTime().then(res => {
        this.governer[5].value = res.data.avgTime
      })
    }
  },
  created () {
    this.getReports()
    this.getAll()
    this.getTime()
  }
}
</script>

<style></style>
