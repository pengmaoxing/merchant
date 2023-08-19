<template>
    <section class="app-main">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </section>
</template>

<script>
export default {
  name: 'appMain'
}
</script>

<style scoped>
    .app-main {
        position: absolute;
        top: 84px; /* navbar + tags-view = 50 +34 */
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
</style>
