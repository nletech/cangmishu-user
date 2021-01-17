<template>
  <div>
    <el-radio-group v-model="inVal" size="mini" @change="onChange">
      <el-radio-button v-for="item in options" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '-1'
    },
    options: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      inVal: null
    };
  },
  watch: {
    value: {
      handler(val) {
        this.inVal = val;
      }
    }
  },
  created() {
    this.inVal = this.value;
  },
  methods: {
    onChange(val) {
      this.$emit('input', val);
      this.$emit('on-value-change', val);
    }
  }
};
</script>
