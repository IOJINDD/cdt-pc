<template>
  <section class="AppAside">
    <div
      class="collapse"
      @click="handleCollapse"
    >
      <i
        v-if="isCollapse"
        class="el-icon-arrow-right"
      ></i>
      <span v-else>
        <i :class="['icon', 'iconfont', localIcon]"></i>
        <span style="margin-left: 10px">{{ activeMenuTitle }}</span>
        <i class="el-icon-arrow-left"></i>
      </span>
    </div>
    <el-menu
      :default-active="activeSubIndex"
      class="el-menu-vertical"
      :background-color="el_menu_style.backgroundColor"
      :text-color="el_menu_style.textColor"
      :collapse="isCollapse"
    >
      <template v-for="(item, index) in activeMenus">
        <el-submenu
          v-if="
            item.childrenNode &&
              item.childrenNode.length !== 0 &&
              item.data.cdlj === null
          "
          :index="item.data.mkdm + index.toString()"
          :key="index"
        >
          <p slot="title">
            <i
              :class="'icon iconfont ' + item.data.tpdz"
              color="#fff"
            ></i>
            <font v-if="!isCollapse">{{ item.data.mkmc }}</font>
          </p>
          <el-menu-item
            v-for="(obj, index1) in item.childrenNode"
            :index="obj.data.mkdm + index1.toString()"
            :key="index1"
            @click.native="handleSelect(obj, index1)"
          >
            <!-- <i :class="'icon iconfont '+ obj.data.tpdz" color="#fff"></i> -->
            <i
              :class="'icon iconfont ' + obj.data.tpdz"
              color="#fff"
            ></i>
            <span slot="title">{{ obj.data.mkmc }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          v-else
          :index="item.data.mkdm + index.toString()"
          :key="index"
          @click.native="handleSelect(item, index)"
        >
          <i
            :class="'icon iconfont ' + item.data.tpdz"
            color="#fff"
          ></i>
          <span slot="title">{{ item.data.mkmc }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </section>
</template>
<script>
import { mapGetters } from "vuex";

window.__jp0 = function(data) {
  // console.log(data);
};
export default {
  name: "AppAside",
  components: {},
  data() {
    return {
      activeSubIndex: "0",
      localIcon: ""
    };
  },
  computed: {
    ...mapGetters([
      "activeMenus",
      "activeIndex",
      "activeMenuTitle",
      "isCollapse",
      "showIframe",
      "userInfo",
      "isAllReport",
      "isSysModule",
      "asideIcon",
      "theme"
    ]),
    el_menu_style: function() {
      let obj = {
        "night-theme": {
          backgroundColor: "#071b36",
          textColor: "#fff"
        },
        "blue-theme": {
          backgroundColor: "#173254",
          textColor: "#6ca4cd"
        },
        "light-theme": {
          backgroundColor: "#fff",
          textColor: "#828b99"
        }
      };
      return obj[this.theme];
    }
  },
  watch: {
    activeMenus: {
      handler(val, oldVal) {
        if (val && val.length > 0) {
          // 如果二级菜单下还有三级菜单，并且不是系统管理模块，应该进入childrenNode中第一个菜单
          if (val[0].childrenNode.length > 0 && !this.isSysModule) {
            this.handleSelect(val[0].childrenNode[0], 0);
          } else {
            this.handleSelect(val[0], 0);
          }
        }
      }
    },
    asideIcon: {
      handler(val) {
        this.localIcon = val;
      },
      immediate: true
    }
  },
  props: {},
  methods: {
    handleSelect(val, index) {
      if (
        (this.showIframe ||
          val.data.wbmc === "report" ||
          val.data.wbmc === "vue-page") &&
        val.data.wbmc !== "sys-vue-page"
      ) {
        // 排除系统管理下面的vue页面
        let url = "";
        if (this.isAllReport || val.data.wbmc === "report") {
          url =
            val.data.cdlj.trim() +
            "&yhdh=" +
            this.userInfo.yhdh +
            "&dwdm=" +
            this.userInfo.dwdm +
            "&yhlx=" +
            this.userInfo.userExpForm.yhlx;
        } else {
          url = val.data.cdlj.trim();
        }
        this.$store.commit("SET_layId", val.data.mkdm);
        this.$store.commit("SET_iframeUrl", url);
        this.$store.commit("SET_iframeTitle", val.data.mkmc);
        this.$router.push({
          path: "/iframe",
          query: {
            iframeUrl: url,
            name: val.data.mkmc
          }
        });
      } else {
        this.$router.push(val.data.cdlj);
      }
    },

    handleCollapse() {
      this.$store.commit("SET_isCollapse", !this.isCollapse);
    }
  },
  mounted() {
  }
};
</script>
<style lang="scss">
.AppAside,
.el-menu--vertical {
  text-align: left;
  position: relative;
  .iconfont {
    font-size: 14px;
  }
  .collapse {
    color: #9b9ea3;
    background-color: #e1e3e7;
    height: 40px;
    padding-left: 20px;
    font-weight: 800;
    font-size: 14px;
    line-height: 40px;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    .el-icon-arrow-left {
      position: absolute;
      right: 8px;
      top: 13px;
    }
  }
  .el-menu {
    border-right: 0px;
  }
  .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
    padding: 0;
    margin: 10px 0;
    margin-bottom: 0px;
    i {
      margin-right: 10px;
    }
  }
  .el-menu-item.is-active,
  .el-submenu__title:hover,
  .el-menu-item:hover {
    background-color: #f2f7ff !important;
    color: #3978d5 !important;
  }
  li.el-menu-item.is-active:before,
  .el-submenu__title:hover:before,
  .el-menu-item:hover:before {
    content: "";
    width: 5px;
    height: 100%;
    background: #3978d5;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
