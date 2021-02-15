<template>
  <div>
    <v-dialog v-model="userId.dialog1" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="userId.isEdited" class="headline"
            >({{ userId.compName }}) {{ $t("tahrir") }}</span
          >
          <span v-else class="headline"
            >({{ userId.compName }}) {{ $t("hodim_yaratish_formasi") }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="checkValid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    :label="$t('hodim_fish')"
                    required
                    v-model="user.name"
                    prepend-icon="mdi-account-circle"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="user.username"
                    :label="$t('foydalanuvchi_nomi')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    type="password"
                    v-model="user.password"
                    :label="$t('parol_kiriting')"
                    prepend-icon="mdi-lock"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="user.phone"
                    :label="$t('hodim_raqami')"
                    :rules="[rules.threeNum, rules.numbercheck, rules.min]"
                    prepend-icon="mdi-phone-classic"
                    persistent-hint
                    required
                    counter
                    maxlength="12"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-autocomplete
                    :items="roles"
                    v-model="user.roles"
                    return-object
                    item-text="name"
                    item-value="name"
                    :label="$t('hodim_roli')"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#00BCD4" text @click="close">{{ $t("yopish") }}</v-btn>
          <v-btn
            v-if="userId.isEdited"
            color="#00BCD4"
            :disabled="!isFormFilled || !checkValid"
            text
            @click="updateUser(), validate()"
            >{{ $t("tahrirni_saqlash") }}</v-btn
          >
          <v-btn
            v-else
            color="#00BCD4"
            :disabled="!isFormFilled || !checkValid"
            text
            @click="createNewUser(), validate()"
            >{{ $t("saqlash") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Users from '@/services/Users.js'
export default {
  props: {
    userId: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      checkValid: true,
      regNum: '998[0-9]{0,}',
      valid: true,
      dialog: false,
      roles: [],
      user: {
        name: '',
        phone: '998',
        organizationId: this.userId.orgId,
        username: '',
        password: '',
        imageId: '',
        roles: ''
      },
      rules: {
        threeNum: v =>
          v.match(this.regNum) || 'Iltimos 998... formatda kiriting',
        min: v => v.length >= 12 || 'Minimal 12 ta raqam',
        numbercheck: v => !isNaN(v) || 'Iltimos raqam kiriting'
      }
    }
  },
  computed: {
    isFormFilled () {
      if (
        this.user.name &&
        this.user.phone &&
        this.user.username &&
        this.user.roles
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
      //   this.user.name = ''
      //   this.user.phone = ''
      //   this.user.username = ''
      //   this.user.roles = ''
      this.userId.data = {}
      this.userId.dialog1 = false
      this.userId.isEdited = false
    },
    setVariable () {
      if (this.userId.isEdited) {
        this.user.name = this.userId.data.name
        this.user.phone = this.userId.data.phone
        this.user.username = this.userId.data.username
        this.user.roles = this.userId.data.roles[0]
      }
    },
    getRoles () {
      Users.getUsersRoles()
        .then(res => {
          // console.log(res)
          this.roles = res.data
        })
        .catch(err => console.log(err))
    },
    createNewUser () {
      if (!this.isFormFilled) {
        return -1
      }
      const ap = {
        name: this.user.name,
        phone: this.user.phone,
        organizationId: this.userId.orgId,
        username: this.user.username,
        password: this.user.password,
        roles: [this.user.roles.id]
      }
      // console.log(ap)
      Users.createUser(ap)
        .then(res => {
          // console.log(res)
          this.$notify({
            group: 'foo',
            title: 'Hodim muvaffaqiyatli yaratildi',
            classes: 'success',
            text: 'Hodim yaratildi'
          })
          location.reload()
          this.userId.dialog1 = false
        })
        .catch(err => {
          alert(err.data.errors[0].msg)
        })
    },
    updateUser () {
      Users.updateUser(
        {
          name: this.user.name,
          phone: this.user.phone,
          organizationId: this.user.organizationId,
          position: this.userId.data.position,
          username: this.user.username,
          password: this.user.password,
          imageId: this.userId.data.imageId,
          roles: [this.user.roles.id]
        },
        this.userId.data.id
      )
        .then(res => {
          // console.log(res)
          this.userId.dialog1 = false
          location.reload()
        })
        .catch(err => {
          // console.log(err)
          alert(err.data.errors[0].msg)
        })
    }
  },
  created () {
    // console.log(this.userId)
    this.setVariable()
    this.getRoles()
  }
}
</script>

<style></style>
