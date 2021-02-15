<template>
  <div>
    <transition name="component-fade" mode="out-in" color="#00BCD4">
      <router-view></router-view>
    </transition>
    <notifications
      animation-type="velocity"
      position="bottom right"
      group="foo"
    />
  </div>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
  created () {}
}
</script>
<style scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
