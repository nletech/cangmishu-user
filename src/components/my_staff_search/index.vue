<template>
  <el-input
    clearable
    @clear= "handleClear"
    size="small"
    placeholder="请输入用户名"
    v-model="value"
  >
    <el-button
      icon="el-icon-search"
      slot="append"
      @click="submit"
    ></el-button>
  </el-input>
</template>

<script>
import $http from '@/api';

export default {
  props: {
    componentFlag: String,
  },
  data() {
    return {
      value: '',
    };
  },
  methods: {
    // 点击清空按钮
    handleClear() {
      if (this.componentFlag === 'AddEmployee') {
        this.$emit('clearComponentFlag', true);
      }
      this.$emit('clearSearchContent', true);
    },
    // 提交
    submit() {
      // 去除所有空格
      const userName = String(this.value).replace(/\s+/g, '');
      // 过滤内容为空
      if (userName === '') return;
      const requestInfo = {
        user_name: userName,
      };// 在员工列表中的 查看员工 模块查询
      if (this.$route.params.groupId) {
        requestInfo.group_id = this.$route.params.groupId;
      } // 在特定的员工组中查找员工
      if (this.componentFlag === 'AddEmployee') {
        requestInfo.rm = 1;
      }
      $http.staffList(requestInfo)
        .then((res) => {
          // 员工信息
          this.$emit('searchStaff', res.data.data);
        })
        .catch(() => {
          console.log('搜索员工用户名出错');
        });
    },
  },
};
</script>
