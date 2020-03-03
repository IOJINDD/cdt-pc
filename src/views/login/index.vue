<template>
  <div :class="['login-page']">
    <div class="login-video-bg">
      <img
        width="1920"
        height="1080"
        src="static/loginBg.jpg"
      >z
    </div>
    <div class="login-header">
      <img src="../../assets/images/police-logo.png" />
      <span>{{ sysConfigData.mon_sys_title }}</span>
    </div>
    <div class="login-center">
      <div class="login-wrapper">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            用户登录
          </div>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              autocomplete="off"
              maxlength="10"
              @keyup.enter.native="$refs.pass.focus"
            >
              <i
                slot="prefix"
                class="iconfont ico-user"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="pass"
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              autocomplete="new-password"
              :trigger-on-focus="false"
              @keyup.enter.native="login"
            >
              <i
                slot="prefix"
                class="iconfont ico-lock"
              ></i>
            </el-input>
          </el-form-item>
          <div class="loginError">
            {{ loginError }}
            <div class="checkWrapper">
              <el-checkbox v-model="keepUserName">记住用户名</el-checkbox>
            </div>
          </div>
          <el-button
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="login()"
          >登录
          </el-button>
        </el-form>
      </div>
    </div>
    <div class="login-footer">
      <div class="footer-cont">
        <span>
          <a
            v-if="userAgent === 'xp'"
            href="/downloadChrome/chrome-win-77.exe"
          >浏览器下载</a>
          <a
            v-else-if="userAgent === 'win'"
            href="/downloadChrome/chrome-win-x86-80.zip"
          >浏览器下载</a>
          <a
            v-else
            href="/downloadChrome/chrome-for-mac.exe"
          >浏览器下载</a>
          &nbsp;&nbsp;
          <a href="/downloadChrome/操作手册.doc">操作手册</a>
        </span>
        <span class="floatL">{{ sysConfigData.mon_sys_support + '&nbsp;&nbsp;&nbsp;&nbsp;' }}</span>
        <span class="floatR pointer">{{ sysConfigData.mon_sys_ownership + '&nbsp;&nbsp;' + sysConfigData.mon_sys_version }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { init, getUserInfo, getAllMenus } from "@/api/service.js";
import { setToken } from "@/utils/auth";
import { setStore, getStore } from "@/utils/tool";
import { mapGetters } from "vuex";
import { MessageBox } from "element-ui";

export default {
  components: {},
  name: "LoginPage",
  data: () => ({
    dialogVisible: false,
    keepUserName: true,
    showpass: false,
    loginForm: {
      username: "",
      password: ""
    },
    loginRules: {
      username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
      password: [{ required: true, trigger: "blur", message: "请输入密码" }]
    },
    loginError: "",
    formList: [
      {
        formType: "input",
        span: 24,
        key: "yhdh",
        label: "用户名"
      },
      {
        formType: "input",
        span: 24,
        key: "ymm",
        label: "原密码"
      },
      {
        formType: "input",
        span: 24,
        key: "xmm",
        label: "新密码"
      }
    ],
    formDetail: {},
    userAgent: ""
  }),
  methods: {
    login() {
      if (this.keepUserName) {
        setStore("username", this.loginForm.username);
      } else {
        setStore("username", "");
      }
      this.loginError = "";
      if (this.loginForm.username === "") {
        this.loginError = "请输入用户名！";
      } else if (this.loginForm.password === "") {
        this.loginError = "请输入密码！";
      } else {
        this.$store
          .dispatch("login", this.loginForm)
          .then(res => {
            if (res.code === 200) {
              this.$store.commit("SET_hasAuth", true);
              setToken(res.data);
              this.init();
            } else {
              this.loginError = res.msg;
            }
          })
          .catch(error => {
            this.loginError = error;
          });
      }
    },
    init() {
      init().then(res => {
        if (res.code === 200) {
          if (!window.localStorage.getItem("theme")) {
            document.getElementsByTagName(
              "body"
            )[0].className = this.sysConfigData.mon_sys_theme;
            window.localStorage.setItem(
              "theme",
              this.sysConfigData.mon_sys_theme
            );
          } else {
            document.getElementsByTagName(
              "body"
            )[0].className = window.localStorage.getItem("theme");
          }
          this.$store.commit("SET_showIframe", false);

          // 获取菜单栏
          getAllMenus().then(res => {
            if (res.code === 200) {
              let allMenu = [];
              let allOperation = [];
              if (res.data) {
                for (let key in res.data.modules) {
                  if (res.data.modules[key].data.qxzl === "1") {
                    allMenu.push(res.data.modules[key]);
                  } else if (res.data.modules[key].data.qxzl === "2") {
                    allOperation.push(key);
                  }
                }
                this.$router.push("/index");
                this.$store.commit(
                  "SET_allMenu",
                  this.sortMenu(allMenu).reverse()
                );
                this.$store.commit("SET_allOperation", allOperation);
                // 先注释掉这句，刷新页面时会触发跳转激活菜单下第一个子菜单
                // this.$store.commit("SET_activeMenus", this.allMenu[parseInt(this.activeIndex)].childrenNode);
              }
            }
          });
          this.$store.commit("SET_activeMenus", []);
          this.$store.commit("SET_activeIndex", -1);
          this.$store.dispatch("delAllViews");
          getUserInfo(this.loginForm.username).then(res => {
            this.$store.commit("SET_userInfo", res.data);
          });
        }
      });
    },
    // 菜单显示是倒序的，给菜单排列一个倒序
    sortMenu(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j].data.plsx < arr[j + 1].data.plsx) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
      return arr;
    },
    getUserName() {
      this.loginForm.username = getStore("username");
    },
    getTips() {
      this.$store.dispatch("getConfigData");
    },
    // 分辨率提示
    testResolution(func) {
      if (window.document.body.clientWidth < 1440) {
        MessageBox.alert(
          "当前浏览器窗口的分辨率可能会影响部分功能的显示效果。建议切换到1440 * 900以上的分辨率以达到最佳显示效果。",
          "提示",
          {
            callback: action => {
              func();
            }
          }
        );
      }
    },
    // 获取谷歌浏览器版本
    googleLevel() {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      if (userAgent.indexOf("Chrome") != -1) {
        return (
          userAgent.split("Chrome/") &&
          userAgent.split("Chrome/")[1] &&
          userAgent.split("Chrome/")[1].split(".") &&
          userAgent.split("Chrome/")[1].split(".")[0]
        );
      } else {
        return 0;
      }
    },
    // 获取用户操作系统
    getUserAgent() {
      let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      if (isMac) {
        return "mac";
      } else {
        let version = navigator.userAgent;
        console.log(version);
        if (version.indexOf("Windows NT 5.1") > -1) {
          return "px";
        } else {
          return "win";
        }
      }
    }
  },
  mounted() {
    this.getTips();
    this.getUserName();
    this.testResolution(() => {});
    this.userAgent = this.getUserAgent();

    let google = Number(this.googleLevel());
    if (google != 0 && google < 60) {
      MessageBox.alert(
        "检测到当前谷歌浏览器版本过低，为了更好的体验，请点下方‘浏览器下载’更新到最新浏览器！",
        "提示",
        {
          callback: action => {}
        }
      );
    }
  },
  computed: {
    ...mapGetters(['sysConfigData'])
  }
};
</script>

<style lang="scss">
.login-page {
  height: 100vh;
  width: 100%;
  .login-video-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -20;
    overflow: hidden;
    video {
      object-fit: fill;
    }
  }
  .login-header {
    height: 120px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(rgba(51, 51, 51, 0.5)),
      to(rgba(31, 31, 31, 0.4))
    );
    background: linear-gradient(rgba(51, 51, 51, 0.5), rgba(31, 31, 31, 0.4));
    img {
      display: inline-block;
      vertical-align: baseline;
      height: 80px;
      margin-top: 20px;
      width: auto;
    }
    span {
      color: #faed1b;
      font-size: 38px;
      font-weight: bold;
      line-height: 120px;
      vertical-align: top;
      margin-left: 30px;
      text-shadow: 1px 1.732px 8px #0c406d;
      font-family: "Microsoft YaHei";
    }
  }
  .login-center {
    z-index: 10;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    .login-wrapper {
      position: absolute;
      top: 50%;
      right: 50%;
      -webkit-transform: translate(50%, -50%);
      transform: translate(50%, -50%);
      width: 420px;
      // height: 456px;
      border-radius: 10px;
      padding: 0 40px;
      background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(rgba(0, 0, 0, 0.5)),
        to(rgba(0, 0, 0, 0.8))
      );
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8));
      .login-form {
        .title-container {
          color: #fff;
          font-size: 24px;
          padding: 50px 0 40px;
          text-align: center;
        }
        .el-input__inner {
          color: #fff;
        }
        .loginError {
          margin: 0 0 10px;
          color: #f93e54;
          line-height: 20px;
          height: 20px;
          text-align: left;
          .checkWrapper {
            float: right;
            .changePassword {
              color: #43a7fe;
              line-height: 22px;
              cursor: pointer;
              font-size: 14px;
            }
          }
        }
        .el-input {
          .el-input__prefix {
            left: 12px;
            color: #43a7fe;
            .iconfont {
              font-size: 20px;
            }
          }
          .el-input__inner {
            padding-left: 40px !important;
            background: rgba(255, 255, 255, 0.15);
          }
        }
        .el-button {
          border: none;
          margin-bottom: 44px !important;
          box-shadow: 2px 3px 13px 0px rgba(19, 80, 185, 0.35);
          background-color: rgba(24, 81, 255, 0.65);
          &:hover {
            background-color: rgba(24, 81, 255, 0.75);
          }
          span {
            font-size: 16px;
            color: #fff;
            letter-spacing: 8px;
          }
        }
      }
    }
  }
  .login-footer {
    position: absolute;
    bottom: 0;
    height: 40px;
    width: 100%;
    background: rgba(12, 19, 32, 0.5);
    line-height: 40px;
    color: #a9d0fe;
    .footer-cont {
      width: 1280px;
      margin: 0 auto;
      a {
        color: #a9d0fe;
        cursor: pointer;
      }
    }
  }
}
</style>
