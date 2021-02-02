<template>
  <ul class="conditions_date clearfix">
    <li v-for="(item, index) in dateNames" :key="index">
      <a
        :class="getClassName(index)"
        @click="
          e => {
            handleClick(index);
          }
        "
        >{{ item.name }}</a
      >
    </li>
    <li>
      <span class="font12">自定义时间 :</span>
      <el-date-picker
        v-model="customDate"
        style="width:300px;"
        type="daterange"
        align="right"
        value-format="yyyy-MM-dd"
        @change="onDateChange"
      />
    </li>
  </ul>
</template>

<script>
import {
  getNullRange,
  getThisMonthRange,
  getThisWeekRange,
  getTodayRange,
  getLast3MonthsRange
} from '@/lib/date.js';

export default {
  name: 'DateRange',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      customDate: '',
      insCurrentIndex: null,
      dateNames: [
        { name: '不限' },
        { name: '今天' },
        { name: '本周' },
        { name: '本月' },
        { name: '过去三个月' }
      ]
    };
  },
  watch: {
    value: {
      handler(value) {
        this.insCurrentIndex = value;
      },
      immediate: true
    },
    insCurrentIndex: {
      handler(val) {
        this.emitDateByCurrentIndex(val);
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    handleClick(index) {
      this.insCurrentIndex = index;
    },
    emitDateByCurrentIndex(index) {
      if (index === null) return;
      this.$emit('input', index);
      const methodsMap = {
        0: getNullRange,
        1: getTodayRange,
        2: getThisWeekRange,
        3: getThisMonthRange,
        4: getLast3MonthsRange
      };
      const method = methodsMap[index];
      if (method) {
        this.customDate = '';
        const dateRange = method();
        this.$emit('on-date-change', dateRange);
      }
    },
    getClassName(index) {
      const currentIndex = this.insCurrentIndex;
      if (index === currentIndex) return 'current';
    },
    onDateChange(data) {
      const dateObj = { beginTime: data[0], endTime: data[1] };
      this.$emit('on-date-change', dateObj);
      this.insCurrentIndex = -1;
      this.$emit('input', -1);
    }
  }
};
</script>

<style lang="less" scope>
.conditions_date {
  padding: 0;
  margin: 0;
  li {
    float: left;
    margin-right: 10px;
    list-style-type: none;
    a {
      padding: 3px 8px;
      font-size: 12px;
    }
    a:link {
      background: #cccccc;
    }
    a.current {
      border: #3198ff solid 2px;
    }
  }
}
</style>
