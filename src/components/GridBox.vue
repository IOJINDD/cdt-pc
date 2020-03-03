<!-- 事故分析首页模块 -->
<template>
  <section class="GridBox">
    <span class="border lt"></span>
    <span class="border rt"></span>
    <span class="border lb"></span>
    <span class="border rb"></span>
    <slot name="gridContent" class="content"></slot>
  </section>
</template>

<script>
export default {
  name: "",
  components: {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  props: {
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
.GridBox {
  position: relative;
  height: 100%;
  border-top: none;
  padding: 3px;
  color: #fff;
  .border {
    position: absolute;
    padding: 15px;
    border-style: solid;
    border-color: #00ffff;
  }
  .lt {
    border-width: 2px 0 0 2px;
    top: -2px;
    left: -2px;
  }
  .rt {
    border-width: 2px 2px 0 0;
    top: -2px;
    right: -2px;
  }
  .lb {
    border-width: 0 0 2px 2px;
    bottom: -2px;
    left: -2px;
  }
  .rb {
    border-width: 0 2px 2px 0;
    bottom: -2px;
    right: -2px;
  }

  .title {
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    font-family: SourceHanSansCN-Bold;
    font-size: 18px;
    line-height: 22px;
    color: #05f4fd;
    text-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.85);
  }
  .content{
    height: 100%;
  }
}
</style>
