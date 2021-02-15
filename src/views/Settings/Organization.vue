<template>
  <div>
      <v-row justify="center">
          <v-col >
              <organization-list />
          </v-col>
      </v-row>
  </div>
</template>

<script>
import OrganizationList from '../../components/Settings/OrganizationList'
export default {
  components: {
    OrganizationList
  }
}
</script>

<style>

</style>
