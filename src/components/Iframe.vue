<!-- iframe åµŒå…¥é¡µé�¢ -->
<template>
  <div class="iframe-container">
    <iframe
      :lay-id="layId"
      :src="src"
      scrolling="auto"
      frameborder="0"
      class="frame"
      :style="isFullscreen ? 'height: 100vh' : (sysConfigData.mon_sys_tag_view === 'true'? 'height: calc(100vh - 130px);' : 'height: calc(100vh - 80px);') ">
    ></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},

  data() {
    return {
      src: "",
      globalbaseUrl: ""
    };
  },

  computed: {
    ...mapGetters(["iframeUrl", "layId", 'sysConfigData', 'isFullscreen'])
  },

  watch: {
    iframeUrl: {
      handler: function(val, oldVal) {
        this.resetSrc(val);
      }
    },
    $route: {
      handler(val) {
        this.resetSrc(val.query.iframeUrl);
      },
      immediate: true
    }
  },
  methods: {
    resetSrc(url) {
      this.src = this.globalbaseUrl + url;
    }
  },
  mounted() {
    window.getMyVue = this;//全局存入当前vue实例
  }
};
</script>

<style lang='scss'>
.iframe-container,
.frame {
  width: 100%;
}
.iframe-container {
  overflow: hidden;
}
</style>
