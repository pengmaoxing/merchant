<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translateX(-20px);
  }

</style>
