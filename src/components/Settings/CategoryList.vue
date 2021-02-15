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
          <P class="headline">{{ $t("kategoriya_qoshish") }}</P>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
            v-model="category.name_uz"
            :label="$t('yangi_kategoriya_qoshish(uz)')"
            :error="error.flag"
            :error-messages="error.msg"
            color="#00BCD4"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="category.name_ru"
            :label="$t('yangi_kategoriya_qoshish(ru)')"
            :error="error.flag"
            :error-messages="error.msg"
            color="#00BCD4"
          ></v-text-field>
        </v-col>
        <v-col v-if="false" cols="3">
          <v-text-field
            v-model="category.name_en"
            :error="error.flag"
            :error-messages="error.msg"
            label="Yangi kategoriya qo'shish (Ingliz tilida)"
            color="#00BCD4"
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn color="#00BCD4" dark @click="postCategory">{{
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
            <v-tab :key="1"> {{ $t("barcha_kategoriyalar") }}</v-tab>
            <v-tab :key="2"> {{ $t("arxivlangan") }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item :key="1">
              <v-simple-table v-if="desserts.length">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t("kategoriya_nomi") }}</th>
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
                        <v-btn
                          @click="deleteCategory(item)"
                          :disabled="item.posts.length > 0"
                          fab
                          small
                          text
                          ><v-icon color="#00BCD4"
                            >mdi-package-down</v-icon
                          ></v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
            <v-tab-item :key="2">
              <v-simple-table v-if="archived.length">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t("kategoriya_nomi") }}</th>
                      <th class="text-left">{{ $t("qoshilgan_vaqt") }}</th>
                      <th class="text-left">
                        {{ $t("tahrir_qilingan_vaqt") }}
                      </th>
                      <th class="text-left">{{ $t("arxivlash") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in archived" :key="i">
                      <td>{{ langbool ? item.name_ru : item.name_uz }}</td>
                      <td>{{ item.createdAt | moment("D.MM.YYYY") }}</td>
                      <td>{{ item.updatedAt | moment("D.MM.YYYY") }}</td>
                      <td>
                        <v-btn @click="unarchived(item)" fab small text
                          ><v-icon color="#00BCD4"
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
            color="#00BCD4"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
import Categories from '../../services/Categories'
export default {
  data () {
    return {
      langbool: null,
      tab: 0,
      page: 1,
      error: {
        flag: false,
        msg: ''
      },
      desserts: [],
      archived: [],
      category: {
        name_uz: '',
        name_ru: '',
        name_en: `${Math.random() * 100} hello`
      }
    }
  },
  watch: {
    tab (val) {
      // console.log(val)
      if (val == 0) this.getCategories()
      else this.getArchivedCat()
    }
  },
  methods: {
    getArchivedCat () {
      Categories.getArchivedCategories()
        .then(res => {
          this.archived = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCategories () {
      Categories.getCategories()
        .then(res => {
          // console.log(res)
          this.desserts = res.data
          this.$store.commit('setloading', false)
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('setloading', false)
        })
    },
    postCategory () {
      if (this.category.name_uz == '' && this.category.name_ru == '') {
        this.error.flag = true
        this.error.msg = this.$t('formani_toldiring')
        return -1
      } else if (this.category.name_uz == '' || this.category.name_ru == '') {
        this.error.flag = true
        this.error.msg = this.$t('formani_oxirgacha_toldiring')
        return -1
      } else {
        // console.log(this.category)
        Categories.postCategory(this.category)
          .then(res => {
            // console.log(res)
            this.error.flag = false
            this.error.msg = ''
            this.$notify({
              group: 'foo',
              type: 'success',
              title: this.$t('muammo_turi_yaratildi')
            })
            this.category = {
              name_uz: '',
              name_ru: ''
            }
            this.getCategories()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    unarchived (item) {
      Categories.unArchiveCategory(item.id)
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
    deleteCategory (item) {
      Categories.deleteCategory(item.id)
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
    const language = localStorage.getItem('locale')
    this.changeLang(language)
    this.$store.commit('setloading', true)
    this.getCategories()
  }
}
</script>

<style></style>
