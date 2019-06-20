<template>
<div>
  <el-row :class="$style.staffGroupAdd_main">
    <el-col :span="12" :offset="6">
        <el-form
          label-width="80px"
          :model="staffGroupAdd_form"
        >
          <el-form-item
            label="员工组名"
          >
            <el-input
              v-model="staffGroupAdd_form.name"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="备注"
          >
            <el-input
              type="textarea"
              v-model="staffGroupAdd_form.remark"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              @click="submit_staffGroupAdd_form"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';

export default {
  components: {
    MdoelForm,
  },
  data() {
    return {
      staffGroupAdd_form: {
        name: '',
        remark: '',
      },
    };
  },
  computed: {
  },
  methods: {
    // 提交添加信息
    submit_staffGroupAdd_form() {
      this.$confirm('确认添加', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 推送添加信息
          $http.addStaffGroup(this.staffGroupAdd_form)
            .then((res) => {
              // 处理添加成功
              if (res.status === 0) {
                // 显示成功消息
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                });
                // 跳转
                this.$router.push({ name: 'staffGroupList' });
              } else {
                this.$message({
                  type: 'info',
                  message: '操作失败!',
                });
              }
            });
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';

.staffGroupAdd_main {
  width: 800px;
  height: 600px;
  background-color: white;
  margin: 0 auto;
  padding: 80px 0 0 0;
}
.label {
  font-size: 18px;
}
</style>
