<template>
  <div v-if="userInfo.data">
    <v-dialog v-model="userInfo.dialog" width="374">
      <v-card class="mx-auto" max-width="374">
        <v-img
          height="250"
          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
        ></v-img>

        <v-card-title>{{
          userInfo.data.citizen.name + " " + userInfo.data.citizen.surname
        }}</v-card-title>

        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-col cols="12" class="py-0">
              <div class="grey--text ml-2">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{
                  userInfo.data.citizen.street +
                    "," +
                    userInfo.data.citizen.home
                }}
              </div>
            </v-col>
            <v-col cols="12" class="py-0">
              <div class="ml-2 mt-3 #00BCD4--text">
                <v-icon size="20" left color="#00BCD4">mdi-phone</v-icon> +{{
                  userInfo.data.citizen.phone
                }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Murojaatlar ro'yxati</v-card-title>

        <v-card-text>
          <v-chip-group active-class="deep-purple accent-4 white--text" column>
            <v-chip color="#00BCD4">Umumiy: {{ stats.all }}</v-chip>

            <v-chip color="success">Hal etilgan: {{ stats.closed }}</v-chip>

            <v-chip dark color="red lighten-1"
              >Rad etilgan: {{ stats.rejected }}</v-chip
            >

            <v-chip dark color="deep-purple accent-1"
              >Ko'rib chiqilgan: {{ stats.reviewed }}</v-chip
            >
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="userInfo.dialog = false"
            color="deep-purple lighten-2"
            text
          >
            Yopish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Sender from '../../../services/Sender'
export default {
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      stats: {
        all: 0,
        closed: 0,
        rejected: 0,
        reviewed: 0
      }
    }
  },
  methods: {
    getSingleInfo () {
      //   console.log(this.userInfo.data)
      Sender.getSenderProfile(this.userInfo.data.citizen.id).then(res => {
        // console.log(res)
        this.stats = res.data
      })
    }
  },
  created () {
    // console.log(this.userInfo)
    this.getSingleInfo()
  }
}
</script>

<style></style>
