<template>
          <div  :class="$style.selectPublic">
                <el-row>
                        <el-col :span="20">
                                <el-input v-model="value" size="small"></el-input>
                        </el-col>
                        <el-col :span="2">
                                <el-button size="small">搜索</el-button>
                        </el-col>
                </el-row>
          </div>
</template>
<script>
export default {
  name: 'inputPublic',
  data() {
    return {
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
