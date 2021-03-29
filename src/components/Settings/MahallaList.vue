<template>
  <div>
    <v-container class="mx-2" fluid>
      <v-row justify="start" class="mt-4 pb-0">
        <v-col cols="12" class="py-3">
          <v-btn
            @click="$router.push('/sozlamalar/tashkilotlar')"
            text
            class="px-0"
            ><v-icon left size="30">mdi-chevron-left</v-icon>
            {{ $t("orqaga") }}</v-btn
          >
        </v-col>
        <v-col cols="auto" class="py-0">
          <P class="headline">{{ $t("mahalla_qoshish") }}</P>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
            v-model="mahalla.name_uz"
            :label="$t('yangi_mahalla_qoshish(uz)')"
            :error="error.flag"
            :error-messages="error.msg"
            :rules="[rules.latinName, rules.numbercheck]"
            color="#01838F"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="mahalla.name_ru"
            :label="$t('yangi_mahalla_qoshish(ru)')"
            :error="error.flag"
            :rules="[rules.cyrillicName, rules.numbercheck]"
            :error-messages="error.msg"
            color="#01838F"
          ></v-text-field>
        </v-col>
        <!-- <v-col v-if="false" cols="3">
          <v-text-field
            v-model="category.name_en"
            :error="error.flag"
            :error-messages="error.msg"
            label="Yangi kategoriya qo'shish (Ingliz tilida)"
            color="#01838F"
          ></v-text-field>
        </v-col> -->
        <v-col cols="auto">
          <v-btn color="#01838F" dark @click="postMahalla">{{
            $t("qoshish")
          }}</v-btn>
        </v-col>
      </v-row>
      <v-row justify="start">
        <v-col cols="10">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab :key="1"> {{ $t("barcha_mahallalar") }}</v-tab>
            <v-tab :key="2"> {{ $t("arxivlangan") }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item :key="1">
              <v-simple-table v-if="desserts.length">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t("mahalla_nomi") }}</th>
                      <th class="text-left">{{ $t("qoshilgan_vaqt") }}</th>
                      <th class="text-left">
                        {{ $t("tahrir_qilingan_vaqt") }}
                      </th>
                      <th class="text-left">{{ $t("arxivlash") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in desserts" :key="i">
                      <td>{{ langbool ? item.name_ru : item.name_uz }}</td>
                      <td>{{ item.createdAt | moment("D.MM.YYYY") }}</td>
                      <td>{{ item.updatedAt | moment("D.MM.YYYY") }}</td>
                      <td>
                        <v-btn @click="deleteMahalla(item)" fab small text
                          ><v-icon color="#01838F"
                            >mdi-package-down</v-icon
                          ></v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <!-- <v-simple-table v-else>
                  Loading ...
              </v-simple-table> -->
            </v-tab-item>
            <v-tab-item :key="2">
              <v-simple-table v-if="archived.length">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t("mahalla_nomi") }}</th>
                      <th class="text-left">{{ $t("qoshilgan_vaqt") }}</th>
                      <th class="text-left">
                        {{ $t("tahrir_qilingan_vaqt") }}
                      </th>
                      <th class="text-left">{{ $t("arxivdan_chiqarildi") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in archived" :key="i">
                      <td>{{ langbool ? item.name_ru : item.name_uz }}</td>
                      <td>{{ item.createdAt | moment("D.MM.YYYY") }}</td>
                      <td>{{ item.updatedAt | moment("D.MM.YYYY") }}</td>
                      <td>
                        <v-btn @click="unarchived(item)" fab small text
                          ><v-icon color="#01838F"
                            >mdi-arrow-up-bold-box</v-icon
                          ></v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-col v-if="false" cols="auto">
          <v-pagination
            v-model="page"
            :length="4"
            color="#01838F"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
import Mahallas from '../../services/Mahallas'
export default {
  data () {
    return {
      langbool: null,
      tab: 0,
      page: 1,
      regLatin: '^[a-zA-Z0-9\\s]+$',
      regCyrillic: '^[?!,.а-яА-ЯёЁ0-9\\s]+$',
      error: {
        flag: false,
        msg: ''
      },
      desserts: [],
      archived: [],
      mahalla: {
        name_uz: '',
        name_ru: ''
        // name_en: `${Math.random() * 100} hello`
      },
      rules: {
        latinName: v =>
          v.match(this.regLatin) || 'Iltimos lotin alifbosida kiriting',
        cyrillicName: c =>
          c.match(this.regCyrillic) || 'Iltimos rus tilida kiriting'
      }
    }
  },
  watch: {
    tab (val) {
      // console.log(val)
      if (val == 0) this.getMahallas()
      else this.getArchivedMahalla()
    }
  },
  methods: {
    getMahallas () {
      Mahallas.getMahallas()
        .then(res => {
          console.log(res)
          this.desserts = res.data
          console.log(this.desserts)
          this.$store.commit('setloading', false)
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('setloading', false)
        })
    },
    getArchivedMahalla () {
      Mahallas.getArchivedMahalla()
        .then(res => {
          this.archived = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    postMahalla () {
      if (this.mahalla.name_uz == '' && this.mahalla.name_ru == '') {
        this.error.flag = true
        this.error.msg = this.$t('formani_toldiring')
        return -1
      } else if (this.mahalla.name_uz == '' || this.mahalla.name_ru == '') {
        this.error.flag = true
        this.error.msg = this.$t('formani_oxirgacha_toldiring')
        return -1
      } else {
        // console.log(this.category)
        Mahallas.postMahalla(this.mahalla)
          .then(res => {
            // console.log(res)
            this.error.flag = false
            this.error.msg = ''
            this.$notify({
              group: 'foo',
              type: 'success',
              title: this.$t('mahalla_yaratildi')
            })
            this.mahalla = {
              name_uz: '',
              name_ru: ''
            }
            this.getMahallas()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    unarchived (item) {
      Mahallas.unArchiveMahalla(item.id)
        .then(res => {
          this.archived = this.archived.filter(el => el.id !== item.id)
          this.$notify({
            group: 'foo',
            type: 'success',
            title: this.$t('arxivdan_chiqarildi'),
            text: item.name_uz
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteMahalla (item) {
      Mahallas.deleteMahalla(item.id)
        .then(res => {
          // console.log(item)
          this.$notify({
            group: 'foo',
            type: 'success',
            title: this.$t('arxivlandi'),
            text: item.name_uz
          })
          this.desserts = this.desserts.filter(el => el.id !== item.id)
          // this.getCategories()
        })
        .catch(err => {
          console.log(err)
        })
    },
    changeLang (language) {
      if (language === 'ru') {
        this.langbool = true
      } else if (language === 'uz') {
        this.langbool = false
      } else {
        this.langbool = false
      }
    }
  },
  created () {
    this.getMahallas()
    const language = localStorage.getItem('locale')
    this.changeLang(language)
    this.$store.commit('setloading', true)
  }
}
</script>

<style></style>
