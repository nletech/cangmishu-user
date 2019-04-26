<template>
  <el-date-picker
    v-model="date_value"
    :type="type || 'daterange'"
    v-bind="$attrs"
    size="small"
    @change="updateValue"
    :picker-options="dateData"
    value-format="yyyy-MM-dd"
    range-separator= '至'
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    align="right">
  </el-date-picker>
</template>

<script>
import mixin from '../mixin';
// import { log } from 'util';

export default {
  mixins: [mixin],
  inject: ['params'],
  props: ['type'],
  data() {
    return {
      dateData: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          },
        },
        ],
      },
      // date_value: null,
      date_arr: [],
    };
  },
  computed: {
    date_value: {
      get() {
        return this.date_arr;
      },
      set(newValue) {
        console.log(newValue);
        if (newValue) {
          const dateBegin = newValue[0];
          const dateEnd = newValue[1];
          this.date_arr = newValue;
          this.$emit('update:begin', dateBegin);
          this.$emit('update:end', dateEnd);
        } else {
          this.date_arr = newValue;
          this.$emit('update:begin', '');
          this.$emit('update:end', '');
        }
      },
    },
  },
  methods: {
    updateValue() {
      this.submit();
    },
  },
};
</script>
