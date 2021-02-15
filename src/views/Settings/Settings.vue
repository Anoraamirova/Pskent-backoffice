<template>
  <div>
      <v-row v-if="$access(1) || $access(3)" class="mx-auto" no-glutters>
          <v-col cols="auto">
              <v-card ripple  to="/sozlamalar/tashkilotlar">
                  <v-card-text>
                    <v-row justify="center" align="center">
                      <v-col class="py-0" cols="auto">
                           <v-avatar color="transparent">
                                <v-icon size="30">mdi-city-variant-outline</v-icon>
                            </v-avatar>
                      </v-col>
                      <v-col class="py-0"  cols="auto">
                        <p class="py-0 my-0">{{$t('tashkilotlar')}}</p>
                        <span>{{$t('umumiy')}}: {{organizations}}</span>
                      </v-col>
                  </v-row>
                  </v-card-text>
              </v-card>
          </v-col>
              <v-col cols="auto">
              <v-card ripple  to="/sozlamalar/kategoriya">
                  <v-card-text>
                    <v-row justify="center" align="center">
                      <v-col class="py-0" cols="auto">
                           <v-avatar color="transparent">
                                <v-icon size="30">mdi-tune-vertical</v-icon>
                            </v-avatar>
                      </v-col>
                      <v-col class="py-0"  cols="auto">
                        <p class="py-0 my-0">{{$t('kategoriyalar')}}</p>
                        <span>{{$t('umumiy')}}: {{categories}}</span>
                      </v-col>
                  </v-row>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
  </div>
</template>

<script>
import Organizations from '../../services/Organizations'
export default {
  data () {
    return {
      organizations: '',
      categories: ''
    }
  },
  methods: {
    init () {
      Organizations.getOrgLength().then(res => {
        // console.log(res)
        this.organizations = res.data.organizations
        this.categories = res.data.categories
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>

</style>
