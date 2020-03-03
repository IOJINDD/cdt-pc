<!-- 默认起始页 -->
<template>
  <div id="Index">
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Index",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["allMenu", "showIframe"])
  },
  watch: {
  },
  methods: {
    handleSelect(item) {
      document.title = item.data.mkmc;
      this.$store.commit("SET_asideIcon", item.data.tpdz);
      this.$store.commit("SET_activeMenuTitle", item.data.mkmc);
      this.$store.commit(
        "SET_activeMenus",
        item.childrenNode ? item.childrenNode : []
      );
      // 判断菜单下是否全为报表
      this.$store.commit("SET_isAllReport", item.data.wbmc === "report");
      // 判断菜单下是否为系统管理模块
      this.$store.commit("SET_isSysModule", item.data.wbmc === "sys");
      if (item.data.cdlj) {
        if (item.data.wbmc === "report") {
          this.$store.commit("SET_layId", item.data.mkdm);
          let iframeUrl = item.data.cdlj.trim() + "&yhdh=" + this.userInfo.yhdh + "&dwdm=" + this.userInfo.dwdm + "&yhlx=" + this.userInfo.userExpForm.yhlx;
          this.$store.commit("SET_iframeUrl", iframeUrl);
          this.$store.commit("SET_iframeTitle", item.data.mkmc);
          // this.$router.push("/iframe");

          this.$router.push({
            path: "/iframe",
            query: {
              iframeUrl: iframeUrl,
              name: item.data.mkmc
            }
          });
        } else if (item.data.wbmc === "vue-page") {
          this.$store.commit("SET_layId", item.data.mkdm);
          this.$store.commit("SET_iframeUrl", item.data.cdlj.trim());
          this.$store.commit("SET_iframeTitle", item.data.mkmc);
          // this.$router.push("/iframe");

          this.$router.push({
            path: "/iframe",
            query: {
              iframeUrl: item.data.cdlj,
              name: item.data.mkmc
            }
          });
        } else {
          this.$router.push(item.data.cdlj);
        }
      } else {
        if (item.data.wbmc === "report" || item.data.wbmc === "sys") {
          this.$store.commit("SET_showIframe", true);
        } else {
          this.$store.commit("SET_showIframe", false);
        }
      }
    }
  },

  activated() {},
  mounted() {
    this.handleSelect(this.allMenu[0])
  },
  beforeRouteEnter: (to, from, next) => {
    next(() => {});
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
