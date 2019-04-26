<template>
  <el-input size="small" :value="value" @change="updateValue">
    <el-button @click="submit" slot="append" icon="el-icon-search"></el-button>
  </el-input>
</template>

<script>
import mixin from '../mixin';

export default {
  mixins: [mixin],
  inject: ['params'],
  methods: {
    updateValue(val) {
      // eslint-disable-next-line
      val = val.trim();
      const { name, params, query } = this.$route;
      this.group.$emit('change', this.keyName, val);
      this.submit();
      this.value = val;
      this.$router.replace({
        name,
        params,
        query: { ...query, [this.keyName]: val },
      });
    },
  },
};
</script>
