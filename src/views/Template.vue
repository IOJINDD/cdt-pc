<!-- 注释 -->
<template>
  <div id="TemplateVue">
  </div>
</template>
<script>
export default {
  name: "TemplateVue",
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mixins: [],
  methods: {},

  activated() {},
  mounted() {},
  beforeRouteEnter: (to, from, next) => {
    next(() => {});
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
<style lang="scss">
#TemplateVue {
}
</style>
