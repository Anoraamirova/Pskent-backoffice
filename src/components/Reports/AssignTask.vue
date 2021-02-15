<template>
  <div>
    <v-dialog v-model="assignedTask.dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("topshiriq_berish") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  :items="organizations"
                  v-model="task.organization"
                  return-object
                  item-text="name"
                  item-value="name"
                  :label="$t('tashkilot_tanlang')"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.deadline"
                      :label="$t('berilgan_muhlat')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :min="current"
                    v-model="task.deadline"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-textarea
                  name="input-7-1"
                  :label="$t('sizning_matningiz')"
                  v-model="task.comment"
                  :hint="$t('topshiriqni_yozing')"
                  #00BCD4
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#00BCD4" text @click="assignedTask.dialog = false">{{
            $t("yopish")
          }}</v-btn>
          <v-btn
            color="#00BCD4"
            text
            @click="assignTask"
            :disabled="!isFormFilled"
            >{{ $t("topshiriq") }}</v-btn
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
import Organizations from '../../services/Organizations'
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
      menu2: false,
      current: new Date().toISOString().substr(0, 10),
      organizations: [],
      task: {
        organization: '',
        deadline: '',
        comment: ''
      }
    }
  },
  computed: {
    isFormFilled () {
      if (this.task.organization && this.task.deadline && this.task.comment) {
        return true
      } else return false
    }
  },
  methods: {
    getOrganization () {
      Organizations.getOrganization()
        .then(res => {
          // console.log(res)
          this.organizations = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    assignTask () {
      this.isSubmited = true
      const task = {
        organizationId: this.task.organization.id,
        deadline: new Date(this.task.deadline).getTime(),
        comment: this.task.comment
      }
      // console.log(task)
      MiddleRequests.assignTask(this.assignedTask.data.id, task)
        .then(res => {
          this.isSubmited = false
          this.assignedTask.dialog = false
          this.$notify({
            group: 'foo',
            title: "Jo'natildi"
          })
          // console.log(res)
          location.reload()
        })
        .catch(err => {
          this.isSubmited = false
          console.log(err)
        })
    }
  },
  created () {
    this.getOrganization()
  }
}
</script>

<style></style>
