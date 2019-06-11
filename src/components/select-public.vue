<template>
          <div  :class="$style.selectPublic">
               <el-select  v-model="value"
                           size="small"
                           placeholder="请选择">
                           <el-option  v-for="item in options"
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
  data() {
    return {
      options: '',
      value: '',
    };
  },
};
</script>

<style lang="less" module>
  .selectPublic {
    //
  }
</style>
