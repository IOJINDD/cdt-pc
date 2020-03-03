<!-- 共同的form表单 -->
<template>
  <section class="CdtForm">
    <el-form
      :inline="true"
      :model="formData"
      ref="formData"
    >
      <!-- 遍历一行两条数据的form-->
      <el-row :gutter="24">
        <!-- 前面其他的item插槽 -->
        <div>
          <slot name="frontOtherFromItem"></slot>
        </div>
        <el-col
          :span="item.span || 24"
          v-for="(item) in filterFormList(formList)"
          :key="item.key"
        >
          <!-- 判断是否禁用 -->
          <el-form-item
            ref="formItem"
            v-if="item.disabled"
            :label="item.label + ':'"
            :rules="item.rules"
          >
            <!-- 图片详情 -->
            <img
              :src="item.imgRender(formData[item.key]).url"
              alt=""
              v-if="item.detailType === 'image'"
            />

            <!-- 多行详情 -->
            <span
              v-else-if="item.detailType === 'textarea'"
              class="text-middle"
            >
              <span v-if="item.render">{{ item.render(formData) || item.render(formData) == 0 ? item.render(formData) : '暂无' }}</span>
              <span v-else>{{ formData[item.key] || formData[item.key] == 0 ? formData[item.key] : '暂无' }}</span>
            </span>

            <!-- 附件详情 -->
            <div
              class="filesContent"
              v-else-if="item.detailType === 'upload'"
            >
              <div v-if="item.render(formData) && item.render(formData).length > 0">
                <el-link
                  v-for="(item2, index2) in item.render(formData)"
                  :key="index2"
                  :underline="false"
                  icon="el-icon-paperclip"
                  @click="downloadFile(item2)"
                >{{ item2.name }} </el-link>
              </div>
              <span
                v-else
                class="text-middle"
              >
                暂无附件
              </span>
            </div>

            <!-- 默认单行详情 -->
            <span
              v-else
              class="text-overflow"
            >
              <el-tooltip
                v-if="item.formType !== 'upload'"
                effect="dark"
                :content="item.render ? item.render(formData) && item.render(formData).toString() || '暂无' : formData[item.key] && formData[item.key].toString() || '暂无'"
                placement="top-start"
              >
                <span v-if="item.render">{{ item.render(formData) || item.render(formData) == 0 ? item.render(formData) : '暂无' }}</span>
                <span v-else>{{ formData[item.key] || formData[item.key] == 0 ? formData[item.key] : '暂无' }}</span>
              </el-tooltip>
            </span>
          </el-form-item>
          <el-form-item
            v-else
            :label="item.label"
            :rules="item.rules"
            :prop="item.key"
          >
            <!-- 判断form 的类型 -->
            <!-- 评分 -->
            <el-rate
              v-if="item.formType === 'rate'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              :colors="item.colors"
              :max="item.max"
              :allow-half="item.allowHalf"
              :show-text="item.showText"
              :show-score="item.showScore"
              :icon-classes="item.iconClasses || ['el-icon-star-on', 'el-icon-star-on','el-icon-star-on']"
              :void-icon-class="item.voidIconClasses || 'el-icon-star-off'"
              :disabled-void-icon-class="item.disabledVoidIconClasses || 'el-icon-star-on'"
              :texts="item.texts || ['极差', '失望', '一般', '满意', '惊喜']"
              :text-color="item.textColor || '#1F2D3D'"
            >
            </el-rate>
            <!-- 上传附件 -->
            <el-upload
              ref="upload"
              action="#"
              v-if="item.formType === 'upload'"
              :file-list="formData[item.key]"
              accept=".png,.jpg,.jpeg,.JGP,.JPEG,.PNG,.doc,.docx,.xls,.xlsx"
              :http-request="uploadFile"
              :before-remove="beforeRemove"
              :on-change="beforeAvatarUpload"
              :auto-upload="false"
              multiple
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div
                slot="tip"
                class="el-upload__tip"
              >支持上传png/jpg/jpeg/doc/docx/xls/xlsx文件，且不超过5M</div>
            </el-upload>

            <!-- 选择框 -->
            <el-select
              v-if="item.formType == 'select'"
              v-model="formData[item.key]"
              filterable
              :multiple="item.multiple"
              :disabled="item.disabled"
              @change="change"
            >
              <el-option
                :label="item2.label"
                :value="item2.value"
                :key="item2.value"
                :disabled="item.disabled"
                v-for="item2 in item.options"
              ></el-option>
            </el-select>

            <!-- 选择框 -->
            <!-- <el-select
              v-if="item.formType == 'multipleSelect'"
              v-model="formData[item.key]"
              multiple
              filterable
              :disabled="item.disabled"
              @change="change"
            >
              <el-option
                :label="item2.label"
                :value="item2.value"
                :key="item2.value"
                :disabled="item.disabled"
                v-for="item2 in item.options"
              ></el-option>
            </el-select> -->

            <!-- 输入框 -->
            <el-input
              v-if="item.formType == 'input'"
              v-model="formData[item.key]"
              :disabled="item.disabled"
              :show-word-limit="item.showWordLimit"
              :maxlength="item.maxlength || 30"
              :placeholder="item.placeholder"
            >
              <template
                v-if="item.unit"
                slot="append"
              >{{
                item.unit
              }}</template>
            </el-input>

            <!-- 密码输入框 -->
            <el-input
              v-if="item.formType == 'password'"
              v-model="formData[item.key]"
              :disabled="item.disabled"
              :maxlength="item.maxlength || 30"
              :placeholder="item.placeholder"
              autocomplete="new-password"
              type="password"
            ></el-input>

            <!-- 数字 -->
            <el-input
              v-if="item.formType == 'number'"
              type="number"
              v-model="formData[item.key]"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
              :controls="false"
              :min="item.min || 1"
            ></el-input>

            <!-- 联动选择 -->
            <el-cascader
              v-if="item.formType == 'cascader'"
              :options="item.options"
              :props="item.props"
              filterable
              :show-all-levels="false"
              :disabled="item.disabled"
              v-model="formData[item.key]"
            ></el-cascader>

            <!-- 日期时间范围 -->
            <el-date-picker
              v-if="item.formType == 'datetimerange'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <!-- 日期范围 -->
            <el-date-picker
              v-if="item.formType == 'daterange'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <!-- 日期选择 -->
            <el-date-picker
              v-if="item.formType == 'date'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>

            <!-- 多选框 -->
            <el-checkbox-group
              v-if="item.formType == 'checkbox' && formData[item.key] && formData[item.key].constructor == Array"
              v-model="formData[item.key]"
              :disabled="item.disabled"
            >
              <el-checkbox
                :label="item2.value"
                :key="item2.value"
                v-for="item2 in item.options"
              >{{ item2.label }}</el-checkbox>
            </el-checkbox-group>
            <!-- 单选框 -->
            <el-radio-group
              v-if="item.formType == 'radio'"
              v-model="formData[item.key]"
              :disabled="item.disabled"
            >
              <el-radio
                v-for="item2 in item.options"
                :label="item2.value"
                :key="item2.value"
              >{{ item2.label }}
              </el-radio>
            </el-radio-group>

            <!-- switch开关 -->
            <el-switch
              :disabled="item.disabled"
              v-if="item.formType == 'switch'"
              v-model="formData[item.key]"
              :active-value="item.activeValue || 1"
              :inactive-value="item.inactiveValue || 0"
            ></el-switch>
            <span
              v-if="item.formType == 'switch'"
              class="el-form_span"
            >{{ formData[item.key] === item.activeValue ? item.activeLabel : item.inactiveLabel }}</span>
            <!-- 文本 -->
            <el-input
              v-if="item.formType == 'textarea'"
              :disabled="item.disabled"
              :rows="6"
              :maxlength="item.maxlength || 200"
              type="textarea"
              :show-word-limit="item.showWordLimit || true"
              :placeholder="item.placeholder"
              v-model="formData[item.key]"
            ></el-input>

            <!-- 树组件 -->
            <el-popover
              ref="glbmListPopover"
              placement="bottom-start"
              trigger="click"
              :disabled="item.disabled"
              v-if="item.formType == 'tree'"
              v-model="visibleTreeObj[item.key]"
            >
              <el-tree
                :data="glbmList"
                :props="glbmListTreeProps"
                node-key="glbm"
                ref="glbmListTree"
                default-expand-all
                @current-change="glbmListTreeCurrentChangeHandle"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <div
                slot="reference"
                @click="handleShow(item)"
                class="treeLable"
              >
                {{ formData[item.key] ? glbmDwdm[formData[item.key]] : (treeObj[item.key] && glbmDwdm[treeObj[item.key].value]) || item.placeholder }}
              </div>
            </el-popover>

            <!-- 号牌号码（号牌种类） -->
            <el-select
              v-model="formData.fzjg"
              :clearable="true"
              v-if="item.formType == 'hphm'"
              @change="change"
              style="width: 35%"
            >
              <el-option
                :label="item2.label"
                :value="item2.value"
                :key="item2.value"
                v-for="item2 in item.options"
              ></el-option>
            </el-select>
            <!-- 号牌号码（号牌号码） -->
            <el-input
              v-model.trim="formData.hphm"
              placeholder="输入号牌号码"
              :clearable="true"
              v-if="item.formType == 'hphm'"
              style="width: 64%;margin-left: 1%;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <slot name="otherFormItem"></slot>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { downloadFiles } from "@/api/service";

export default {
  name: "CdtForm",
  components: {},
  data() {
    return {
      index: 0,
      formData: {},
      restaurants: [],
      glbmListTreeProps: {
        label: "dwjc",
        children: "children"
      },
      treeObj: {}, // 树对象
      clickTreeName: "", // 被选中的树
      visibleTreeObj: {}
    };
  },
  computed: {
    ...mapGetters(["glbmList", "glbmDwdm"])
  },
  watch: {
    // 默认值赋值
    defaultData: {
      handler(val) {
        this.formData = val;
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    formList: {
      // 表单数据
      type: Array,
      default() {
        return [];
      }
    },
    defaultData: {
      // 默认值
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    change() {
      this.$forceUpdate();
    },

    // 部门树选中
    glbmListTreeCurrentChangeHandle(data, node) {
      this.treeObj[this.clickTreeName] = {};
      this.treeObj[this.clickTreeName].label = data.dwjc;
      this.treeObj[this.clickTreeName].value = data.dwdm;
      this.formData[this.clickTreeName] = data.dwdm;
      this.visibleTreeObj[this.clickTreeName] = false;
    },

    handleShow(val) {
      this.clickTreeName = val.key;
    },

    // 过滤formList数据
    filterFormList(val) {
      return val.filter(item => {
        return this.formData[item] || !item.isHide;
      });
    },

    // 上传附件前
    beforeAvatarUpload(file) {
      const isLt = file.size / 1024 / 1024 < 5;
      if (!isLt) {
        this.$message.error("上传文件大小不能超过 5MB!");
        for (let i in this.$refs.upload[0].uploadFiles) {
          if (this.$refs.upload[0].uploadFiles[i].name === file.name) {
            this.$refs.upload[0].uploadFiles.splice(i, 1);
            break;
          }
        }
      }
    },

    //默认文件提交方法
    uploadFile() {
      console.log("this.$refs.", this.$refs);
      this.$emit(
        "uploadFile",
        this.$refs.upload && this.$refs.upload[0].uploadFiles
      );
    },

    // 下载附件
    downloadFile(val) {
      downloadFiles({
        wjlj: val.url,
        wjmc: val.name
      }).then(res => {
        this.download(res, val.name);
      });
    },
    download(content, fileName) {
      const blob = new Blob([content]); //创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
      const url = window.URL.createObjectURL(blob); //URL.createObjectURL(object)表示生成一个File对象或Blob对象
      let dom = document.createElement("a"); //设置一个隐藏的a标签，href为输出流，设置download
      dom.style.display = "none";
      dom.href = url;
      dom.setAttribute("download", fileName); //指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
      document.body.appendChild(dom);
      dom.click();
    },

    beforeRemove(file, fileList) {
      return this.$confirm("您确认要删除该附件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 如果statu等于success，说明是已经上传成功的文件
        if (file.status === "success") {
          this.$emit("removeFileUrl", file.url); // 返回需要删除的文件url
        }
        return true;
      });
    },

    // 校验表单
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.formData.validate(valid => {
          console.log("valid", valid);
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },

    // 去除校验
    clearValidate() {
      console.log("formData.resetFields", this.$refs.formData);
      this.$refs.formData.clearValidate();
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.CdtForm {
  // border-bottom: 2px solid #4a9bff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 20px 20px 0;

  .el-form-item {
    width: 100%;
    .el-form-item__label {
      width: 160px;
      font-size: 13px;
      line-height: 32px;
    }
    .el-form-item__content {
      width: calc(100% - 160px);
      float: right;
      text-align: left;
      font-size: 13px;
      line-height: 28px !important;
      // height: 32px;
      .inputs2 {
        width: 50%;
        &:last-child {
          width: 49%;
          margin-left: 1%;
        }
      }
      .inputs3 {
        width: 33%;
        margin-left: 1%;
        &:first-child {
          width: 32%;
          margin-left: 0;
        }
      }
    }
    @media screen and (max-width: 1600px) {
      .el-form-item__label {
        width: 120px;
      }
      .el-form-item__content {
        width: calc(100% - 120px);
      }
    }
    @media screen and (max-width: 1280px) {
      .el-form-item__label {
        width: 90px;
      }
      .el-form-item__content {
        width: calc(100% - 90px);
      }
    }
  }
  .el-autocomplete {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .treeLable {
    -webkit-appearance: none;
    background-image: none;
    text-overflow: ellipsis;
    word-break: keep-all;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    max-width: 200px;
    font-size: 12px;
  }
  .el-cascader {
    width: 100%;
  }
  .el-rate {
    display: inline-block;
    vertical-align: text-bottom;
  }
  .el-link.el-link--default {
    margin-right: 15px;
  }
  .el-link [class*="el-icon-"] + span {
    cursor: pointer;
  }
  .filesContent {
    display: inline-grid;
  }
  .text-middle {
    display: inline-block;
    vertical-align: middle;
    line-height: 32px;
  }
  .text-overflow {
    line-height: 32px;
  }
  .el-textarea .el-input__count {
    background: inherit;
  }
}

@media screen and (min-width: 1600px) {
  .CdtForm {
    padding-right: 80px;
  }
}
</style>
 