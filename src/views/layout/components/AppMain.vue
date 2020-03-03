<template>
  <section class="AppMain" :style="{'margin': isFullscreen || isHome ? '0' : '10px'}">
    <div style="position: absolute; left: 0; top: 0; right: 0; height: 10px; z-index: 999" @mouseenter="handleHover()" @mouseleave="handleOut()"></div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive v-if="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
      <router-view v-if="!cachedViews"></router-view>
    </transition>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "AppMain",
  computed: {
    ...mapGetters(["isFullscreen", 'theme']),
    cachedViews() {
      const cacheds = this.$store.state.cachedViews
      if(cacheds && cacheds.length > 0){
        const cachedIdx = cacheds.findIndex(i => this.$route.name == i)
        return cachedIdx > -1
      }
      return false
    },
    key() {
      return this.$route.fullPath
    },
    isHome() {
      return this.$route.path == '/home' && (this.theme == 'night-theme' || this.theme == 'blue-theme')
    }
  },

  methods: {
    handleHover(){
      if(this.isFullscreen){
        this.$store.commit("SET_isShowHeader", true)
      }
    },
    handleOut(){
      if(this.isFullscreen){
        setTimeout(() => {
          this.$store.commit("SET_isShowHeader", false)
        }, 3500)
      }
    }
  }
};
</script>

<style lang="scss">
.AppMain {
  margin: 10px;
  height: 100%;
  // overflow: auto;
  .tabPane {
    min-height: 700px;
  }
  .iframe {
    width: 100%;
    height: calc(100vh - 70px);
  }
}
</style>
