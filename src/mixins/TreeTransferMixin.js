// 树形穿梭框 mixin
import {
  mapGetters
} from "vuex";
import {
  deepClone,
  treeDataTranslate
} from "@/utils/tool.js";
import {
  getDeptUserTree
} from "@/api/service.js";
import {
  queryCustomBook
} from "@/api/message-config.js";
export const TreeTransferMixin = {
  data() {
    return {
      leftTitle: ["根据用户", "根据部门", "自定义通讯录"],
      fromData: [],
      addObj: {}, // 添加的对象
      toData: [], // 选中数据
      yhzList: [], // 用户组
      defaultCheckedKeys: [], // 左侧默认选中数据
      deptUserTree: [],
      deptTree: []
    }
  },
  computed: {
    ...mapGetters(["userInfo", "glbmList"])
  },
  watch: {
    userData: {
      handler(val) {
        console.log(this.userData)
        if (this.userData[this.yhzlx]) {
          this.fromData = deepClone(this.userData[this.yhzlx])
        }
      }
    }
  },
  methods: {
    $_TreeTransferMixin_changeLX(data) { 
      this.yhzlx = data
      this.fromData = deepClone(this.userData[data])
      this.toData = [] //deepClone(this.userData[data])
      if (this.yhzlx === this.ylx && this.yhzList && this.yhzList.length > 0) {
        this.toData = deepClone(this.userData[data])
        // this.toData = this.array2tree(this.userData, this.toData);
        this.searchToData()
        this.searchFromData()
      }
    },
    // 添加按钮
    $_TreeTransferMixin_add(fromData, toData, obj) {
      this.toData = toData
      this.addObj = obj
    },
    // 移除按钮
    $_TreeTransferMixin_remove(fromData, toData, obj) {
      this.toData = toData
    },

    // 获取部门-用户树
    getDeptUserTree() {
      getDeptUserTree(this.userInfo.dwdm).then(res => {
        if (res.code === 200) {
          this.deptUserTree = res.data;
          this.$set(this.userData, "user", this.deptUserTree)
          if (this.xzlbList.indexOf("dept") > -1) {
            this.deptTree = this.getChild(this.glbmList, "0");
            this.$set(this.userData, "dept", this.deptTree)
          }
        }
      });
    },
    getChild(data, pid) {
      let arr = [];
      for (let i in data) {
        let row = {};
        row.pid = pid;
        row.id = data[i].dwdm;
        row.name = data[i].dwmc;
        row.children = [];
        if (data[i].children && data[i].children.length > 0) {
          row.children = this.getChild(data[i].children, data[i].dwdm);
        }
        arr.push(row);
      }
      return arr;
    },

    // 获取
    queryCustomBook() {
      queryCustomBook().then(res => {
        if (res.code === 200) {
          //this.userData.auto = res.data
          let treeData = treeDataTranslate(res.data, "id", "pid");
          this.$set(this.userData, "auto", treeData)
        }
      })
    }
  },
  mounted() {
    if (this.xzlbList) {
      if (this.xzlbList.indexOf("user") > -1 || this.xzlbList.indexOf("dept") > -1) {
        this.getDeptUserTree()
      }
      if (this.xzlbList.indexOf("auto") > -1) {
        this.queryCustomBook()
      }
    }
  }
}
