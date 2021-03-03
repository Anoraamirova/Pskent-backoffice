<template>
  <div class="mx-4">
    <v-row justify="space-between">
      <v-col cols="auto">
        <!-- <v-btn text @click="$router.push('/sozlamalar/tashkilotlar')">{{
          $t("orqaga")
        }}</v-btn> -->
        <v-card ripple to="/sozlamalar/kategoriya">
          <v-card-text>
            <v-row>
              <v-col class="py-0" cols="auto">
                <v-avatar color="transparent">
                  <v-icon size="30">mdi-tune-vertical</v-icon>
                </v-avatar>
              </v-col>
              <v-col class="py-0" cols="auto">
                <p class="py-0 my-0">{{ $t("kategoriyalar") }}</p>
                <span>{{ $t("umumiy") }}: {{ categories }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="auto">
        <h1 class="display-1">{{ $t("tashkilotlar") }}</h1>
      </v-col>

      <v-col cols="auto">
        <v-btn v-if="$access(1)" outlined @click="dialog = true">{{
          $t("yaratish")
        }}</v-btn>
      </v-col>
    </v-row>
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
    <v-row>
      <v-col v-if="desserts.length > 0">
        <v-data-table
          :no-data-text="$t('malumot_yoq')"
          :no-results-text="$t('natija_yoq')"
          :headers="headers"
          :items="desserts"
          :items-per-page="20"
          :search="search"
          class="elevation-0"
          color="#00BCD4"
          blue
        >
          <template v-slot:item.id="{ item }">
            <v-btn @click="getInfo(item)" fab small text color="#00BCD4"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <v-btn
              v-if="$access(1)"
              @click="editInfo(item)"
              fab
              small
              text
              color="#00BCD4"
              ><v-icon>mdi-pen</v-icon></v-btn
            >
            <v-btn
              v-if="$access(1)"
              @click="createOrgUser(item)"
              fab
              small
              text
              color="#00BCD4"
              ><v-icon>mdi-briefcase-plus</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row align="center">
          <v-col cols="auto">
            <v-icon size="45" right>mdi-account-group</v-icon>
          </v-col>
          <v-col cols="auto" class="px-1" id="usersId">
            <h2 class="headline py-0">{{ $t("hodimlar_royxati") }}</h2>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :no-data-text="$t('malumot_yoq')"
          :no-results-text="$t('natija_yoq')"
          :items-per-page="15"
          :headers="head"
          :items="workers"
          class="elevation-1"
        >
          <template v-slot:item.createdAt="{ item }">
            <p class="py-0 mt-2">{{ item.createdAt | moment("D.MM.YYYY") }}</p>
          </template>
          <template v-slot:item.id="{ item }">
            <v-btn
              v-if="$access(1)"
              @click="getUserInfo(item)"
              fab
              small
              text
              color="#00BCD4"
              ><v-icon>mdi-pen</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span v-if="!isNew" class="headline">{{
              $t("tashkilot_yaratish_formasi")
            }}</span>
            <span v-else class="headline">{{ $t("tahrir") }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      disabled
                      :value="orgParams.compName"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$t('tashkilot_nomi')"
                      required
                      v-model="formFields.tashkilotNomi"
                      prepend-icon="mdi-office-building"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$t('tashkilot_nomi_ru')"
                      required
                      v-model="formFields.tashkilotNomi_ru"
                      prepend-icon="mdi-office-building"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formFields.headName"
                      :label="$t('tashkilot_boshligi')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="formFields.address"
                      :label="$t('tashkilot_manzili')"
                      prepend-icon="mdi-map-marker"
                      persistent-hint
                      color="#00BCD4"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      maxlength="12"
                      counter
                      v-model="formFields.phoneNumber"
                      :label="$t('tashkilot_raqami')"
                      :rules="[rules.threeNum, rules.numbercheck, rules.min]"
                      prepend-icon="mdi-phone-classic"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-autocomplete
                      :items="problemsList"
                      v-model="formFields.selectedCategory"
                      return-object
                      item-text="name_uz"
                      item-value="name_uz"
                      :label="$t('muammo_turi')"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#00BCD4" text @click="close">{{
              $t("yopish")
            }}</v-btn>
            <v-btn
              v-if="!isNew"
              :disabled="!isFormFielled || !valid"
              color="#00BCD4"
              text
              @click="saveData(), validate()"
              >{{ $t("yaratish") }}</v-btn
            >
            <v-btn
              v-if="isNew"
              :disabled="!valid"
              color="#00BCD4"
              text
              @click="saveEdited(), validate()"
              >{{ $t("saqlash") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <create-user-dialog v-if="orgParams.dialog1" :userId="orgParams" />
    </v-row>
  </div>
</template>

<script>
import CreateUserDialog from '../Settings/Users/CreateUserDialog'
import Organizations from '../../services/Organizations'
import Categories from '../../services/Categories'
// import func from '../../../vue-temp/vue-editor-bridge'
export default {
  data () {
    return {
      valid: true,
      regNum: '998[0-9]{0,}',
      isNew: false,
      problemsList: [],
      orgParams: {
        dialog1: false,
        orgId: '',
        compName: '',
        isEdited: false,
        data: {}
      },
      phoneNumber: '998',
      formFields: {
        tashkilotNomi: '',
        tashkilotNomi_ru: '',
        headName: '',
        phoneNumber: '998',
        address: '',
        selectedCategory: '',
        id: ''
      },
      dialog: false,
      rules: {
        threeNum: v =>
          v.match(this.regNum) || 'Iltimos 998... formatda kiriting',
        min: v => v.length >= 12 || 'Minimal 12 ta raqam',
        numbercheck: v => !isNaN(v) || 'lltimos raqam kiriting'
      },
      search: '',
      desserts: [],
      head: [
        {
          text: this.$t('hodim_fish'),
          align: 'start',
          value: 'name'
        },
        {
          text: this.$t('foydalanuvchi'),
          align: 'start',
          value: 'username'
        },
        {
          text: this.$t('telefon_raqam'),
          align: 'start',
          value: 'phone'
        },
        {
          text: this.$t('hodim_yaratilgan_vaqti'),
          align: 'start',
          value: 'createdAt'
        },
        {
          text: '',
          align: 'start',
          value: 'id'
        }
      ],
      workers: [],
      headers: [
        {
          text: this.$t('tashkilot_nomi'),
          align: 'start',
          value: 'name'
        },
        {
          text: this.$t('telefon_raqam'),
          align: 'start',
          value: 'phone'
        },
        {
          text: this.$t('tashkilot_manzili'),
          align: 'start',
          value: 'address'
        },
        {
          text: this.$t('tashkilot_rahbari'),
          align: 'start',
          value: 'directorName'
        },
        {
          text: this.$t('hodimlar'),
          align: 'start',
          value: 'users.length'
        },
        {
          text: this.$t('korish'),
          align: 'start',
          value: 'id'
        }
      ]
    }
  },
  watch: {
    'formFields.phoneNumber': function (val) {
      // console.log(val)
      // var x = val.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
      // console.log(x)
      // this.formFields.phoneNumber = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
    }
  },
  computed: {
    isFormFielled () {
      if (
        this.formFields.tashkilotNomi &&
        this.formFields.tashkilotNomi_ru &&
        this.formFields.headName &&
        this.formFields.phoneNumber &&
        this.formFields.selectedCategory
      ) {
        return true
      } else return false
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    close () {
      this.orgParams = { dialog1: false, orgId: '', compName: '', data: {} }
      this.isNew = false
      this.formFields = {
        tashkilotNomi: '',
        tashkilotNomi_ru: '',
        headName: '',
        phoneNumber: '998',
        address: '',
        selectedCategory: '',
        id: ''
      }
      this.dialog = false
    },
    getCategories () {
      Categories.getCategories().then(res => {
        // console.log(res)
        this.problemsList = res.data
      })
    },
    getOrganization () {
      Organizations.getOrganizationWithHokims()
        .then(res => {
          // console.log(res)
          this.desserts = res.data
          this.$store.commit('setloading', false)
        })
        .catch(err => {
          this.$store.commit('setloading', false)
          console.log(err)
        })
    },
    getInfo (val) {
      this.$vuetify.goTo('#usersId', {
        duration: 200,
        offset: 0
      })
      this.workers = val.users
    },
    editInfo (val) {
      console.log(val)
      this.orgParams.compName = val.name
      this.isNew = true
      this.formFields.tashkilotNomi = val.name
      this.formFields.tashkilotNomi_ru = val.name_ru
      this.formFields.headName = val.directorName
      this.formFields.phoneNumber = val.phone
      this.formFields.address = val.address
      this.formFields.selectedCategory = val.category
      this.formFields.id = val.id
      this.dialog = true
    },
    saveEdited () {
      Organizations.editOrganization(
        {
          address: this.formFields.address,
          categoryId: this.formFields.selectedCategory.id,
          directorName: this.formFields.headName,
          name: this.formFields.tashkilotNomi,
          name_ru: this.formFields.tashkilotNomi_ru,
          phone: this.formFields.phoneNumber
        },
        this.formFields.id
      )
        .then(res => {
          this.$notify({
            group: 'foo',
            title: this.$t('tahrirdan_muvaffiqiyatli_otkazildi'),
            classes: 'success',
            text: this.$t('hodim_yaratildi')
          })
          this.getOrganization()
          this.dialog = false
        })
        .catch(err => {
          // alert(JSON.stringify(err.data))
          alert(err.data.errors[0].msg)
        })
      // err => console.log(err))
    },
    createOrgUser (val) {
      // console.log(val)
      this.orgParams.orgId = val.id
      this.orgParams.compName = val.name
      this.orgParams.dialog1 = true
    },
    getUserInfo (val) {
      // console.log(val)
      this.orgParams.data = val
      this.orgParams.compName = val.position
      this.orgParams.orgId = val.organizationId
      this.orgParams.isEdited = true
      this.orgParams.dialog1 = true
    },
    saveData () {
      if (!this.isFormFielled) {
        return -1
      }
      Organizations.postOrganization({
        address: this.formFields.address,
        categoryId: this.formFields.selectedCategory.id,
        directorName: this.formFields.headName,
        name: this.formFields.tashkilotNomi,
        name_ru: this.formFields.tashkilotNomi_ru,
        phone: this.formFields.phoneNumber
      })
        .then(res => {
          // console.log(res)
          this.getOrganization()
          this.dialog = false
        })
        .catch(err => {
          console.log(err)
          alert(err.data.errors[0].msg)
        })
    }
  },
  components: {
    CreateUserDialog
  },
  created () {
    const language = localStorage.getItem('locale')

    if (language) {
      if (language === 'ru') {
        this.headers[0].value = 'name_ru'
      } else if (language === 'uz') {
        this.headers[0].value = 'name'
      }
    }

    this.$store.commit('setloading', true)
    this.getOrganization()
    this.getCategories()
  }
}
</script>

<style></style>
