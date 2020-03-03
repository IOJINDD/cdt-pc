<!-- 下拉加载table组件 公共的表格组件 -->
<template>
  <section class="ScrollTable">
    <div
      class="toolBar hidden"
      v-if="toolRight || toolBar"
    >
      <!-- 按钮插槽 -->
      <div
        class="floatL txtL"
        v-if="toolBar"
      >
        <slot name="toolBar"></slot>
      </div>
      <div
        class="floatR"
        v-if="toolRight"
      >
        <el-tooltip content="导出清单">
          <i
            class="el-icon-download"
            @click="handleExport"
            v-if="download"
          ></i>
        </el-tooltip>
        <el-popover
          placement="bottom"
          title="展示列控制"
          width="200"
          trigger="click"
        >
          <el-checkbox-group
            v-model="displayList"
            @change="onCheckboxChange"
          >
            <el-checkbox
              v-for="item in columns"
              :label="item"
              :key="item.key"
            >{{item.title}}</el-checkbox>
          </el-checkbox-group>
          <el-tooltip
            content="展示列控制"
            slot="reference"
          >
            <i class="el-icon-setting floatR"></i>
          </el-tooltip>
        </el-popover>
      </div>
      <div class="floatR">
        <el-button
          size="mini"
          type="info"
          @click="handleReset()"
          class="resetBtn"
        >重置
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleRefresh()"
          class="refreshBtn"
        >刷新</el-button>
      </div>
    </div>
    <el-table
      size="small"
      ref="tableRef"
      :data="tableData"
      :empty-text="emptyText"
      style="width: 100%"
      class="tableData"
      tooltip-effect="dark"
      @row-click="handleRow"
      @selection-change="handleSelectChange"
      :show-summary="showSummary"
      :summary-method="getTotal"
      @cell-click="handleCell"
      :row-class-name="rowClassName"
      v-if="displayListRefresh"
      stripe
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="selection"
        :selectable="selectable"
        align="center"
      ></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :show-overflow-tooltip="false"
        align="center"
      ></el-table-column>

      <!-- 其他属性栏插槽 -->
      <slot name="otherColumn"></slot>

      <!-- 常用属性栏 -->
      <el-table-column
        v-for="(item) in displayList"
        :prop="item.key"
        :label="item.title"
        :width="item.width"
        :min-width="item.minWidth"
        :key="item.title"
        :show-overflow-tooltip="true"
        :align="item.align || 'left'"
        :class-name="item.className || ''"
        style="width: 100%"
      >
        <template slot-scope="scope">
          <span v-if="item.render">{{ item.render(scope.row) }}</span>
          <span v-if="!item.render">{{ scope.row[item.key] || scope.row[item.key] === 0 ? scope.row[item.key] : noMessage }}</span>
        </template>
      </el-table-column>

      <!-- 按钮插槽 -->
      <slot
        name="buttonColumn"
        class="text-center"
      ></slot>
    </el-table>
    <slot name="bottomDiv"></slot>
  </section>
</template>
<script>
import { tableToXls } from "@/utils/tool.js";

export default {
  name: "ScrollTable",
  components: {},
  data: function() {
    return {
      displayList: [],
      displayListRefresh: true
    };
  },
  computed: {},
  watch: {
    columns: {
      handler(val) {
        this.displayList = val.filter(x => {
          return !x.hidden;
        });
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    tableData: {
      // 表单内的数据
      type: Array
    },
    columns: {
      // 表单内的属性
      type: Array
    },
    download: {
      // 是否显示下载按钮
      type: Boolean,
      default() {
        return true;
      }
    },
    selection: {
      // 是否有选择框，默认无
      type: Boolean,
      default() {
        return false;
      }
    },
    toolBar: {
      //默认有
      type: Boolean,
      default() {
        return false;
      }
    },
    //是否显示导出，列表控制按钮
    toolRight: {
      //默认有
      type: Boolean,
      default() {
        return false;
      }
    },
    noMessage: {
      type: String,
      default() {
        return "暂无";
      }
    },
    showSummary: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      }
    },
    emptyText: {
      type: String,
      default() {
        return "暂无数据";
      }
    },
    selectable: {
      type: Function,
      default() {
        return true;
      }
    },
    tableHeight: {
      type: String,
      default() {
        return null;
      }
    }
  },
  methods: {
    // 获取选中项
    handleSelectChange(val) {
      this.$emit("multipleSelection", val);
    },

    // 点击某一行
    handleRow(val) {
      this.$emit("row-click", val);
    },

    // 点击某个单元格
    handleCell(row, columns, cell) {
      this.$emit("cell-click", row, columns, cell);
    },

    // 全部选中
    init() {
      this.$refs.tableRef.toggleAllSelection();
    },

    //展示列勾选
    onCheckboxChange() {
      this.displayListRefresh = false;
      setTimeout(() => {
        this.displayListRefresh = true;
      }, 0);
    },

    // 默认选择
    toggleRowSelection(val) {
      this.$refs.tableRef.toggleRowSelection(val, true);
    },

    // 导出清单
    handleExport() {
      let dataList = [];
      let header = [];
      for (var item of this.displayList) {
        header.push(item.title);
      }
      dataList.push(header);
      this.tableData.forEach((ele, index) => {
        let contentItem = [];
        this.displayList.forEach((ele2, index2) => {
          contentItem.push(ele[ele2.key] || "暂无");
        });
        dataList.push(contentItem);
      });
      tableToXls(dataList, this.$route.meta.title);
    },

    // 自定义合计列
    getTotal(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        } else {
          sums[index] = "--";
        }
      });

      return sums;
    },

    // 重置表单
    handleReset() {
      for (let key in this.searchForm) {
        this.searchForm[key] = null;
      }
      this.$forceUpdate();
      this.$emit("handleSearch", this.searchForm, "reset");
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.ScrollTable {
  height: calc(100vh - 320px);
  .clickMore {
    text-align: center;
    padding: 10px;
    font-size: 12px;
    background-color: #fdfbf9;
    color: #909399;
    cursor: pointer;
  }
  .toolBar {
    padding: 6px 2px;
    background: #f6f6f6;
    // background: #141118;
    overflow: hidden;
    .el-icon-download,
    .el-icon-setting {
      margin: 0 8px;
      font-size: 22px;
      line-height: 28px;
      color: #7fb8ff;
    }
    .el-icon-download {
      font-weight: bold;
    }
    .el-icon-setting {
      padding-right: 6px;
    }
  }
  .el-table {
    .tag {
      span {
        display: inline-block;
        background: #ecf5ff; //#0bafec;
        color: #409eff;
        padding: 0 16px;
        border-radius: 5px;
        border: 1px solid #d9ecff;
      }
    }
    .spzt {
      &::before {
        display: inline-block;
        margin-right: 4px;
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 3px;
        vertical-align: middle;
      }
      &.spzt0::before {
        background: #909399;
      }
      &.spzt2::before {
        background: #f56c6c;
      }
      &.spzt1::before {
        background: #67c23a;
      }
    }
    .zt {
      i {
        display: inline-block;
        margin-right: 4px;
      }
      &.complete {
        color: #67c23a;
      }
      &.pending {
        color: #e6a23c;
      }
    }
  }
  .block {
    .el-pagination {
      background: $-light-bg-color;
      padding: 12px 20px;
      text-align: right;
      // border-top: 1px solid #ddd;
    }
  }
  .floatL {
    min-width: 50%;
  }
}
.blue-theme {
  .el-table {
    .tag {
      span {
        background: rgba(#284a94, 0.5); //#0bafec;
        color: #fff;
        border-color: #284a94;
      }
    }
  }
}
</style>
