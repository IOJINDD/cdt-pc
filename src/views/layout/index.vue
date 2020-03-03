<template>
  <div id="Layout">
    <el-container>
      <el-header
        v-show="!isFullscreen"
        height="82"
      >
        <app-header></app-header>
      </el-header>
      <el-container class="body">
        <el-aside
          v-show="!isFullscreen"
          :width="activeMenus.length > 0 ? (isCollapse ? '58px' : '200px') : '0px'"
        >
          <app-aside></app-aside>
        </el-aside>
        <el-main>
          <tags-view v-show="!isFullscreen && !isHide && sysConfigData.mon_sys_tag_view === 'true'"></tags-view>
          <el-scrollbar :style="isFullscreen? 'height: 100%' : 'height: calc(100vh - 80px);' ">
            <app-main></app-main>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { AppMain, AppHeader, AppAside, TagsView } from "./components";
import { mapGetters } from "vuex";
export default {
  name: "Layout",
  components: {
    AppMain,
    AppHeader,
    AppAside,
    TagsView
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "isFullscreen",
      "hasAuth",
      "activeIndex",
      "activeMenus",
      "isCollapse",
      "sysConfigData"
    ]),
    isHide: function() {
      console.log("this.$route.path", this.$route.path);
      // 在某个特定的页面隐藏侧边栏
      return true;
    }
  },
  watch: {
    activeMenus: function(val) {
      // console.log(val);
    }
  },
  methods: {},

  // 当keep-alive 激活时使用
  activated() {},

  mounted() {},
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      // 获取数据字典
      vm.$store.dispatch("getDictionaryList");
      //获取部门代码信息
      vm.$store.dispatch("getAllDept");
      // 获取系统参数
      vm.$store.dispatch("getSysList");
    });
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
<style lang="scss">
#Layout {
  .el-header {
    // background: url(../../assets/images/headerBg.jpg);
    background: #468ffd;
    height: 76px;
    padding-right: 0px;
  }
  .el-header,
  .el-footer {
    // background-color: #393939;
    color: #fff;
    text-align: center;
  }
  .el-footer {
    z-index: 99;
    height: 30px !important;
    line-height: 30px !important;
  }

  .el-main {
    background: #ebedf3;
    color: #333;
    padding: 0px;
    height: 100%;
    overflow: hidden;
    .el-scrollbar__view {
      height: 100%;
    }
    .tags-view-container .tags-view-wrapper .tags-view-item {
      margin: 8px 5px 2px 3px;
      border-radius: 3px;
      font-size: 12px;
      margin-bottom: 13px;
      overflow: hidden;
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      border: 1px solid #e9eaec;
      background: #f8f8f8;
      padding: 0 5px 0 12px;
      vertical-align: middle;
      color: #666;
      -webkit-transition: all 0.3s ease-in;
      transition: all 0.3s ease-in;
      border-right: 0px;
    }
    .tags-view-container
      .tags-view-wrapper
      .tags-view-item.router-link-exact-active {
      border: 1px solid #409eff;
      background: #409eff;
      color: #fff;
    }
  }

  body > .el-container {
    margin-bottom: 40px;
  }
}
</style>
