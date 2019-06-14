<template>
          <div>
               <el-select  v-model="value"
                           size="small"
                           :placeholder="select.placeholder">
                           <el-option  v-for="item in select.options"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                           </el-option>
               </el-select>
          </div>
</template>
<script>
export default {
  name: 'selectPublic',
  props: {
    select: {
      type: Object,
      default() {
        return {
          placeholder: '请选择',
          options: [],
        };
      },
    },
  },
  data() {
    return {
      value: '',
    };
  },
};
</script>
