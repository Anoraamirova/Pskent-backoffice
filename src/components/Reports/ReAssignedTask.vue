<template>
  <div>
    <v-dialog v-model="reAssignedTask.dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("muammoni_qayta_korib_chiqish") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  name="input-7-1"
                  :label="$t('izoh_uchun_joy')"
                  v-model="comment"
                  outlined
                  color="#00BCD4"
                  :hint="$t('bajarilgan_ish_haqida_malumot_bering')"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#00BCD4"
            text
            :disabled="isSubmited"
            @click="reAssignedTask.dialog = false"
            >{{ $t("bekor_qilish") }}</v-btn
          >
          <v-btn
            color="#00BCD4"
            :disabled="isSubmited"
            text
            @click="submitData"
            >{{ $t("qayta_topshirish") }}</v-btn
          >
        </v-card-actions>
        <v-progress-linear
          indeterminate
          v-if="isSubmited"
          height="12"
          color="#00BCD4"
        ></v-progress-linear>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MiddleRequests from '../../services/MiddleRequests'
export default {
  props: {
    reAssignedTask: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isSubmited: false,
      comment: ''
    }
  },
  methods: {
    submitData () {
      if (!this.comment) {
        alert('Izoh matnini toldiring')
        return
      }
      this.isSubmited = true
      // console.log(this.reAssignedTask)
      MiddleRequests.reAssignTask(this.reAssignedTask.data.id, {
        comment: this.comment
      })
        .then(res => {
          // console.log(res)
          location.reload()
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  created () {}
}
</script>

<style></style>
