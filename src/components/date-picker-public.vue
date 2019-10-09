<template>
          <div>
                <el-date-picker  v-model="value"
                                 type="daterange"
                                 :start-placeholder="$t('startDate')"
                                 :end-placeholder="$t('endDate')"
                                 size="small"
                                 :format="params.format"
                                 value-format="yyyy-MM-dd"
                                 :placeholder="params.placeholder"
                                 :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
          </div>
</template>
<script>
export default {
  name: 'datePickerPublic',
  props: {
    params: {
      type: Object,
      default() {
        return {
          format: 'yyyy 年 MM 月 dd 日',
          placeholder: '选择日期',
        };
      },
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            // eslint-disable-next-line
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          },
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            // eslint-disable-next-line
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          },
        }],
      },
      value: '',
    };
  },
  watch: {
    value() {
      if (Array.isArray(this.value) && this.value.length === 2) {
        this.$emit('select_data', this.value); // 返回选中的时间
      } else if (this.value === null) {
        this.$emit('select_data', false); // 返回一个标志
      }
    },
  },
};
</script>

