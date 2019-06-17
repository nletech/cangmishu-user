<template>
          <div>
              <el-row :class="$style.staffGroupAdd_main">
                      <el-col :span="12" :offset="6">
                              <el-form  label-width="80px"
                                        :model="staffGroupBasicInfo_form">
                                        <el-form-item  label="员工组名">
                                                      <el-input  v-model="staffGroupBasicInfo_form.name"></el-input>
                                        </el-form-item>
                                        <el-form-item  label="备注">
                                                      <el-input  type="textarea"
                                                                 v-model="staffGroupBasicInfo_form.remark">
                                                      </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                                      <el-row>
                                                              <el-col :span="2"
                                                                      :offset="10">
                                                                      <el-button  :class="$style.submit_btn"
                                                                                  @click="submit_staffGroupBasicInfo_form">
                                                                                  保存
                                                                      </el-button>
                                                              </el-col>
                                                      </el-row>
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
  mounted() {
    this.getStaffInfo();
  },
  beforeDestroy() {
    this.deleteStorageStaffGroup();
  },
  data() {
    return {
      staffGroupBasicInfo_form: {
        name: '',
        remark: '',
        group_id: '',
      },
    };
  },
  methods: {
    // 获取在 localStorage 中的用户数据
    getStaffInfo() {
      // number 和 string
      if (+this.$route.params.groupId === +localStorage.getItem('group_id')) {
        for (const item in localStorage) {
          if (Object.prototype.hasOwnProperty.call(localStorage, item)) {
            // 取出用户数据
            this.staffGroupBasicInfo_form[item] = localStorage.getItem(item);
          }
        }
      }
    },
    // 离开页面销毁存储数据
    deleteStorageStaffGroup() {
      for (const item in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, item)) {
          // 删除数据
          localStorage.removeItem(item);
        }
      }
    },
    // 提交修改信息
    submit_staffGroupBasicInfo_form() {
      this.$confirm('确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 推送修改信息
          $http.editStaffGroup(this.$route.params.groupId, this.staffGroupBasicInfo_form)
            .then((res) => {
              // 处理添加成功
              if (res.status === 0) {
                // 显示成功消息
                this.$message({
                  type: 'success',
                  message: '保存成功!',
                });
                // 跳转员工列表页
                this.$router.go(-1);
              } else {
                this.$message({
                  type: 'info',
                  message: '保存失败',
                });
              }
            });
        })
        .catch(() => {
          // 显示取消消息
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';

.staffGroupAdd_main {
  width: 92%;
  min-height: 607px;
  background-color: white;
  margin: 10px auto;
  padding: 80px 0 0 0;
  .submit_btn {
    background-color: @ThemeColor;
    color: @white;
  }
}
.label {
  font-size: 18px;
}
</style>
