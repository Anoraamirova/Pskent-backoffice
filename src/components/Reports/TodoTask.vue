<template>
  <div>
    <v-dialog v-model="assignedTask.dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("topshiriqni_bajarish") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-file-input
                  accept="image/*"
                  v-model="task.image"
                  color="deep-purple accent-4"
                  counter
                  dense
                  :label="$t('rasm')"
                  :placeholder="$t('rasm_yuklang')"
                  prepend-icon="mdi-image-area"
                  outlined
                  :show-size="1000"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="deep-purple accent-4"
                      dark
                      label
                      small
                    >
                      {{ text }}
                    </v-chip>

                    <span
                      v-else-if="index === 2"
                      class="overline grey--text text--darken-3 mx-2"
                    >
                      +{{ files.length - 2 }} Fayllar
                    </span>
                  </template>
                </v-file-input>
              </v-col>

              <v-col cols="12" sm="6" md="12">
                <v-textarea
                  name="input-7-1"
                  :label="$t('izoh_uchun_joy')"
                  v-model="task.comment"
                  outlined
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
            @click="assignedTask.dialog = false"
            >{{ $t("bekor_qilish") }}</v-btn
          >
          <v-btn
            color="#00BCD4"
            :disabled="isSubmited || !isfilled"
            text
            @click="submitData"
            >{{ $t("bajarildi") }}</v-btn
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
// import Organizations from '../../services/Organizations'
export default {
  props: {
    assignedTask: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isSubmited: false,
      task: {
        comment: '',
        image: null
      }
    }
  },
  computed: {
    isfilled () {
      return this.task.comment && this.task.image !== null
    }
  },
  watch: {
    'task.image': function (old) {
      if (old === undefined) this.task.image = null
    }
  },
  methods: {
    submitData () {
      console.log(this.task.comment)

      if (this.task.comment && this.task !== null) {
        this.isSubmited = true
        // console.log(this.task)
        const formData = new FormData()
        formData.append('file', this.task.image)
        //   console.log(new FormData().append('file', this.task.image))
        MiddleRequests.sendImage(formData)
          .then(res => {
            // console.log(res)
            MiddleRequests.finishTask(this.assignedTask.data.id, {
              imageId: res.data.id,
              comment: this.task.comment
            })
              .then(result => {
                // console.log(result)
                this.assignedTask.dialog = false
                this.isSubmited = false
                location.reload()
              })
              .catch(err => {
                this.isSubmited = false
                alert(err.data.errors[0])
                console.log(err)
              })
          })
          .catch(err => {
            this.isSubmited = false
            alert('error ocurred')
            console.log(err)
          })
      }
    }
  },
  created () {}
}
</script>

<style></style>
