<template>
  <div
    id="app"
    v-show="isReloadOk"
  >
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "app",
  components: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      isReloadOk: false
    };
  },
  computed: {
    ...mapGetters(["theme"]),
  },
  methods: {
    // 刷新当前页
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  }, 
  mounted() {
    // console.log('theme', this.theme);   把设置皮肤的代码放在登录那
    this.$nextTick(() => {
      document.getElementsByTagName("body")[0].className = this.theme;
      this.isReloadOk = true;
    })
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style> 
