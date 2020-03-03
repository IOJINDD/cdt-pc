<template>
  <section class="AppHeader">
    <el-row :gutter="24">
      <el-col
        :span="8"
        class="txtL pointer"
      >
        <img
          style="float: left; height: 35px; margin: 20px 12px 12px 0;;"
          src="../../../assets/images/police-logo.png"
          alt
        />
        <span class="innerplateformtileTitle">{{sysConfigData.mon_sys_title}}</span>
      </el-col>
      <el-col
        :span="16"
        class="txtR"
      >
        <div class="menu-container">
          <el-menu
            :default-active="activeIndex.toString()"
            :class="['el-menu-demo', scroll]"
            mode="horizontal"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#fff"
          >
            <el-menu-item
              :index="index.toString()"
              v-for="(item, index) in showItem"
              :key="index"
              @click.native="handleSelect(item, index)"
              :title="item.data.mkmc"
            >
              <template slot="title">
                <i :class="'icon iconfont '+ item.data.tpdz"></i>
                <span>{{ item.data.mkmc }}</span>
              </template>
            </el-menu-item>
          </el-menu>
          <el-dropdown
            v-if="hideItem.length>0"
            class="avatar-container"
            placement="bottom"
          >
            <div class="avatar-wrapper">
              更多
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu
              class="user-dropdown"
              slot="dropdown"
            >
              <el-dropdown-item
                v-for="(item,index) in hideItem"
                :key="index"
                @click.native="handleSelect(item, index)"
              >
                <i :class="'icon iconfont '+ item.data.tpdz"></i>
                <!-- <span>{{ item.data.mkmc }}</span> -->
                <span>{{ item.data.mkmc }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="userInfoWrapper">
          <el-divider direction="vertical"></el-divider>
          <el-badge
            :value="unreadCount"
            class="item"
            @click.native="hanldeDialog('EachTypeMsgDialog')"
            v-if="unreadCount > 0"
          >
            <!-- <el-button icon="el-icon-s-custom"></el-button> -->
            <i class="el-icon-s-custom userImg"></i>
          </el-badge>
          <i
            @click="hanldeDialog('EachTypeMsgDialog')"
            class="el-icon-s-custom userImg"
            v-else
          ></i>
          <div class="userInfo">
            <el-dropdown :show-timeout="0">
              <div class="userName">
                {{userInfo.xm}},欢迎您
                <i
                  class="el-icon-arrow-down el-icon--right"
                  color="#fff"
                ></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="logout"><i class="iconfont ico-zhuxiao"></i>注销</el-dropdown-item>
                  <el-dropdown-item @click.native="$router.push('/changepass')"><i class="iconfont ico-mima"></i>修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="handleToggleSkin('light-theme')"><i class="iconfont ico-huanfu"></i>亮色主题</el-dropdown-item>
                  <el-dropdown-item @click.native="handleToggleSkin('blue-theme')"><i class="iconfont ico-huanfu"></i>蓝色主题</el-dropdown-item>
                  <el-dropdown-item @click.native="handleToggleSkin('night-theme')"><i class="iconfont ico-huanfu"></i>黑色主题</el-dropdown-item>
                  <el-dropdown-item @click.native="handleRefresh"><i class="iconfont ico-shuaxin"></i>刷新缓存</el-dropdown-item>
                  <el-dropdown-item @click.native="handleScreenFull"><i :class="['iconfont', isFullscreen ? 'ico-tuichuquanping' : 'ico-quanping']"></i>{{ isFullscreen ? '退出全屏' : '进入全屏' }}</el-dropdown-item>
                  <el-dropdown-item @click.native="hanldeDialog('UpdateHistoryDailog')"><i class="iconfont ico-huanfu"></i>关于平台</el-dropdown-item>
                </el-dropdown-menu>
              </div>
            </el-dropdown>
            <div class="nowTime">{{nowTime}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import {
  deptRefresh,
  configRefresh,
  dictRefresh,
  init
} from "@/api/service.js";
import Moment from "moment";
import screenfull from "screenfull";

export default {
  name: "AppHeader",
  components: {
  },
  data() {
    return {
      title: "湖南省高警局多维信息预警服务平台",
      dialogVisible: false,
      nowTime: Moment().format("YYYY-MM-DD HH:mm:ss"),
      menuLeft: 0,
      windowWidth: window.innerWidth,
      scroll: "left",
      unreadCount: 0,
      showMaxMenu: 10 // 显示最多主菜单个数
    };
  },
  computed: {
    ...mapGetters([
      "isFullscreen",
      "theme",
      "allMenu",
      "activeIndex",
      "userInfo",
      "isCollapse",
      "sysConfigData"
    ]),
    showItem: function() {
      let showNum = parseInt((this.windowWidth / 2) / 75);
      return this.allMenu.slice(0, showNum).reverse();
    },
    hideItem: function() {
      let showNum = parseInt((this.windowWidth  / 2) / 75);
      return this.allMenu.slice(showNum);
    }
  },
  watch: {

  },
  methods: {
    handleSelect(item, index) {
      document.title = item.data.mkmc;
      this.$store.commit("SET_asideIcon", item.data.tpdz);
      this.$store.commit("SET_activeMenuTitle", item.data.mkmc);
      this.$store.commit("SET_activeIndex", index.toString());
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
          let iframeUrl =
            item.data.cdlj.trim() +
            "&yhdh=" +
            this.userInfo.yhdh +
            "&dwdm=" +
            this.userInfo.dwdm +
            "&yhlx=" +
            this.userInfo.userExpForm.yhlx;
          this.$store.commit("SET_layId", item.data.mkdm);
          this.$store.commit("SET_iframeUrl", iframeUrl);
          this.$store.commit("SET_iframeTitle", item.data.mkmc);

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
    },

    // 注销
    logout() {
      this.$store.dispatch("logout");
    },
    setNowTime() {
      this.nowTime = Moment().format("YYYY-MM-DD HH:mm:ss");
    },

    // 页面全屏功能
    handleScreenFull() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      // screenfull.toggle();
      if (this.isFullscreen) {
        screenfull.exit();
        this.$store.commit("SET_isFullscreen", false);
        this.$store.commit("SET_isShowHeader", true);
      } else {
        screenfull.request();
        this.$store.commit("SET_isFullscreen", true);
        this.$store.commit("SET_isShowHeader", false);
      }
    },
    /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull() {
      let isFullscreen =
        window.fullScreen ||
        window.isFullscreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      var isFull = document.fullscreenEnabled && !isFullscreen;
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    // 换肤
    handleToggleSkin(val) {
      if (val === "night-theme") {
        this.$store.commit("SET_theme", "night-theme");
        window.localStorage.setItem("theme", "night-theme");
        document.getElementsByTagName("body")[0].className = "night-theme";
      } else if (val === "blue-theme") {
        this.$store.commit("SET_theme", "blue-theme");
        window.localStorage.setItem("theme", "blue-theme");
        document.getElementsByTagName("body")[0].className = "blue-theme";
      } else {
        this.$store.commit("SET_theme", "light-theme");
        window.localStorage.setItem("theme", "light-theme");
        document.getElementsByTagName("body")[0].className = "light-theme";
      }
    },
    // 刷新缓存
    handleRefresh() {
      localStorage.removeItem('vuex')
      deptRefresh().then(res => {
        if (res.code === 200) {
          configRefresh().then(res => {
            if (res.code === 200) {
              dictRefresh().then(res => {
                this.common.CheckCode(res, null, () => {
                  init().then(res => {
                    if (res.code === 200) {
                      this.$emit("result");
                    }
                  });
                });
              });
            }
          });
        }
      });
    },
    handleScroll(val) {
      let menuConWidth = document.getElementsByClassName("menu-container")[0]
        .offsetWidth;
      if (val === "right") {
        this.menuLeft = 0;
        setTimeout(() => {
          this.scroll = "left";
        }, 2000);
      } else {
        this.menuLeft = this.allMenu.length * 90 - menuConWidth;
        setTimeout(() => {
          this.scroll = "right";
        }, 2000);
      }
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.windowWidth = window.innerWidth;
        this.windowWidth = window.windowWidth;
      })();
    };

    let _this = this;
    window.addEventListener(
      "resize",
      () => {
        // 全屏下监控是否按键了ESC
        if (_this.checkFull()) {
          // 全屏下按键esc后要执行的动作
          screenfull.exit();
          _this.$store.commit("SET_isFullscreen", false);
        }
      },
      false
    );
  },
  beforeDestroy() {
  }
};
</script>
<style lang="scss">
.AppHeader {
  .el-menu--horizontal > .el-menu-item {
    float: right;
  }

  .innerplateformtileTitle {
    letter-spacing: 0px;
    font-weight: bold;
    font-family: MicrosoftYaHei-Bold;
    line-height: 76px;
    margin: 0;
    font-size: 26px;
    border: 0;
    background-image: -webkit-linear-gradient(top, #fff, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .el-divider--vertical {
    margin-left: 0px;
    margin-right: 15px;
    width: 1.5px;
    height: 0.7em;
  }
  .el-divider {
    font-size: 48px;
    vertical-align: baseline;
    color: red;
  }
  .menu-container {
    display: inline-block;
    position: relative;
    height: 76px; // aa
    margin-right: 4px;
    .el-menu-demo {
      position: absolute;
      right: 40px;
      top: 8px;
      width: 1000px;
      background: inherit !important;
      border: none !important;
      margin-right: 0px !important;
      transition-duration: 2s;
      transition-timing-function: ease-out;
      .el-menu-item {
        font-size: 16px;
        margin: 0 2px;
        padding: 0 6px;
        height: 62px;
        text-align: center;
        border: 1px solid transparent;
        color: #bfcae0 !important;
        // border: 1px solid transparent!important;
        i {
          display: block;
          margin-top: -8px;
          font-size: 28px;
          height: 46px;
          min-width: 55px;
          color: #fff !important;
          background-image: -webkit-gradient(
            linear,
            left bottom,
            left top,
            from(#a3c7fe),
            to(#bfcae0)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
        }
        span {
          display: block;
          margin-top: -18px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          color: hsla(0, 0%, 100%, 0.9);
        }
        &:hover {
          background: transparent;
          border-color: #fde6c6 !important;
          border-radius: 7px;
        }
      }
    }
    .ico-left-angle {
      position: absolute;
      left: 0;
      top: 0;
      width: 60px;
      background-image: linear-gradient(
        to right,
        #6c9fec 0%,
        rgb(70, 143, 253) 50%,
        rgba(10, 34, 72, 0) 100%
      );
      line-height: 76px; // aa
      z-index: 999;
      text-align: left;
    }
    .ico-right-angle {
      position: absolute;
      right: 0;
      top: 0;
      line-height: 76px; // aa
      width: 60px;
      background-image: linear-gradient(
        to right,
        #6c9fec 0%,
        rgb(70, 143, 253) 50%,
        rgba(10, 34, 72, 0) 100%
      );
      line-height: 76px; // aa
      z-index: 999;
    }
  }
  .avatar-container {
    position: relative;
    right: 0;
    width: 37px;
    height: 76px;
    padding-top: 24px;
    margin-right: 1px;
    color: #fff;
    background-color: transparent;
  }
  .avatar-wrapper {
    text-align: center;
    cursor: pointer;
    position: relative;
  }
  // .el-dialog {
  //   // background-color: transparent;
  // }
  .el-menu--horizontal {
    background-color: #000;
  }
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
    background: none !important;
  }
  .el-menu--horizontal > .el-menu-item.is-active,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
    color: -webkit-linear-gradient(top, #ebecd7, #d2d2d3) !important;
    border-color: -webkit-linear-gradient(top, #ebecd7, #d2d2d3) !important;
    border-radius: 7px;
    i {
      background-image: linear-gradient(0deg, #fde6c6 0%, #fff 100%);
    }
  }
  .operateWrapper {
    display: inline-block;
    vertical-align: top;
    font-size: 30px;
    margin-top: 20px;
    line-height: 42px;
    i {
      display: inline-block;
      margin: 0 2px;
    }
  }
  .userInfoWrapper {
    display: inline-block;
    vertical-align: top;
    .el-badge {
      margin-right: 8px;
      vertical-align: unset;
    }
    .userImg {
      padding: 2px;
      border: 1px solid #fff;
      border-radius: 50%;
      vertical-align: middle;
      font-size: 34px;
      vertical-align: super;
      background-image: linear-gradient(
        0deg,
        #fde6c6 0%,
        #fef2dd 73%,
        #fffef4 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .userInfo {
      display: inline-block;
      padding: 12px 10px;
      min-width: 156px;
      .el-dropdown {
        width: 100%;
        color: #fff;
      }
      .userName,
      .nowTime {
        height: 26px;
        line-height: 30px;
        font-size: 13px;
        text-align: left;
        i {
          color: #aaa;
        }
      }
    }
  }
}
.el-popper[x-placement^="bottom"] .popper__arrow {
  left: 51px !important;
}
</style>
