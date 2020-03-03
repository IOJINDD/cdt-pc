import common from '@/utils/common.for.vue.js';
 
/**
 * 数据字典
 * @param {*} zdlb 数据字典类别
 * @param {*} val 数据字典值
 */
export function filter_dic(zdlb, val) {
  let arr = common.getDic(zdlb)
  let label = "";
  arr.forEach(item => {
    if (item.value == val) {
      label = item.label;
    }
  });
  return label || val;
}

/**
 * 状态过滤器
 * @param {*} arr 数据字典列表
 * @param {*} val 数据字典值
 */
export function filter_xtlbIcon(arr, val) {
  let icon = "";
  arr.forEach(item => {
    if (item.value == val) {
      icon = item.icon;
    }
  });
  return icon;
}

/**
 * 格式化时间
 * @param {*} val
 */
export function formatDate(val) {
  return new Date(val).format("yyyy-MM-dd hh:mm:ss");
}

/**
 * 回溯页面中文编程??
 * @param {*} val
 */
export function filterTitle(val) {
  return val || '回溯详情'
}
