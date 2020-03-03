<!-- 标签 -->
<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        class="tags-view-item"
        v-for="(item, index) in (visitedViews)"
        ref="item"
        :class="isActive(item) ? 'item' : ''"
        :to="item"
        :key="index"
      >
        <!-- @contextmenu.prevent.native="openMenu(item, $event)" -->
        {{ item.title }}
        <span
          v-if="item.path !== '/home'"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(item)"
        ></span>
        <span
          v-if="item.path === '/home'"
          class="iconfont ico-shouye"
        > </span>
      </router-link>
    </div>
    <el-dropdown class="tagsViewBtn">
      <i
        class="el-icon-arrow-down el-icon--right"
        color="#aaa"
      ></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
        <el-dropdown-item @click.native="closeAllTags">关闭所有</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},

  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    ...mapGetters(["visitedViews", "iframeTitle", "iframeUrl"])
  },

  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    iframeUrl() {
      this.addViewTags();
      this.moveToCurrentTag();
    }
  },

  mounted() {
    this.addViewTags();
  },

  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.fullPath === this.$route.fullPath;
    },
    addViewTags() {
      let route = this.generateRoute();
      if (!route) {
        return false;
      } else if (route.path === "/iframe") {
        this.$store.dispatch(
          "addVisitedViews",
          Object.assign({}, route, {
            title: this.iframeTitle || "no-name",
            query: {
              iframeUrl: this.iframeUrl,
              name: this.iframeTitle
            }
          })
        );
      } else {
        this.$store.dispatch("addVisitedViews", route);
      }
    },
    moveToCurrentTag() {
      let items = this.$refs.item;
      if (items) {
        this.$nextTick(() => {
          for (const item of items) {
            if (item.to.path === this.$route.path) {
              // this.$refs.scrollPane.moveToTarget(item.$el);
              break;
            }
          }
        });
      }
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delVisitedViews", view);
      this.$forceUpdate();
    },
    // 关闭其他标签
    closeOthersTags() {
      this.$store.dispatch("delOthersViews", this.$route);
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$store.commit("SET_showIframe", false);
      this.$router.push("/index");
    },
    openMenu(item, e) {
      this.visible = true;
      this.selectedTag = item;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetHeight = this.$el.offsetTop; // container margin left
      this.left = e.clientX - offsetLeft; // 15: margin right
      this.top = e.clientY - offsetHeight + 12;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.tags-view-container {
  position: relative;
  margin: 0px 10px;
  .tags-view-wrapper {
    padding-right: 100px;
    background: #fff;
    height: 40px;
    overflow: hidden;
    padding-left: 4px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    text-align: left;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border-right: 1px solid #d8dce5;
      color: #495060;
      background: inherit;
      padding: 0 10px;
      font-size: 12px;
      &.router-link-exact-active {
        color: #409eff;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  overflow-y: auto;
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -2px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
  .iconfont {
    font-size: 12px;
  }
}
.tagsViewBtn {
  position: absolute !important;
  right: 0px;
  top: 4px;
  border: none;
  min-width: 30px !important;
  padding: 6px 12px;
  .iconfont {
    font-size: 15px !important;
    margin-right: 0;
  }
}
.tags-view-wrapper .tags-view-item .el-icon-close:hover {
  background-color: #2196f3;
}
</style>
