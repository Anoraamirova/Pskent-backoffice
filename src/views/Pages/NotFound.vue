<template>
  <div>
    <v-app style="height: 100%">
      <v-container style="height: 100%">
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <h2 class="text-center display-4">404</h2>
            <h2 class="text-center display-3">Not found</h2>
            <h1 class="text-center">
              <v-icon size="200">mdi-emoticon-sad-outline</v-icon>
            </h1>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-btn
              rounded
              large
              elevation="10"
              color="#00BCD4 ligten-2"
              to="/"
              dark
              >Back to home</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
