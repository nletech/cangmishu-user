<template>
          <div>
                <el-row :class="$style.Permissions_main">
                        <el-col :span="20">
                          <el-form  label-width="200"
                                    :model="permission_form"
                                    :class="$style.form_main">
                                    <el-row :gutter="30">
                                            <el-col :span="10">
                                                    <!-- 请选择仓库 -->
                                                    <el-form-item  :label="is_init ? '当前仓库:' : '请选择仓库:'">
                                                                  <el-radio-group  v-model="form.warehouse_id"
                                                                                  @change="handleChange">
                                                                                  <el-radio  style="dispaly: inline-block;
                                                                                              width: 120px;
                                                                                              margin: 10px 24px 0 0;
                                                                                              height: 20px;
                                                                                              overflow:hidden;
                                                                                              text-overflow:ellipsis;
                                                                                              white-space:nowrap; "
                                                                                              v-for="(item, index) in warehouse"
                                                                                              :key="index"
                                                                                              :label="item.id">
                                                                                              {{item.name_cn}}
                                                                                  </el-radio>
                                                                  </el-radio-group>
                                                    </el-form-item>
                                            </el-col>
                                            <el-col :span="10" :offset="4">
                                                    <!-- 请选择操作权限 -->
                                                    <el-form-item label="请选择操作权限:">
                                                                  <el-checkbox :indeterminate="isIndeterminate"
                                                                               v-model="checkAll"
                                                                               @change="handleCheckAllChange">
                                                                               全选
                                                                  </el-checkbox>
                                                                  <div style="margin: 15px 0;"></div>
                                                                  <el-checkbox-group  v-model="checkedArray"
                                                                                      @change="handleCheckedChange">
                                                                                      <el-checkbox  v-for="item in modules"
                                                                                                    :label="item.id"
                                                                                                    :key="item.name">
                                                                                                    {{item.name}}
                                                                                      </el-checkbox>
                                                                  </el-checkbox-group>
                                                    </el-form-item>
                                            </el-col>
                                    </el-row>
                          </el-form>
                          <el-row>
                            <el-col>
                              <!-- 保存 -->
                              <el-button  :class="$style.submit_form_icon"
                                          size="great"
                                          round
                                          @click="submit_form">
                                          保存
                              </el-button>
                            </el-col>
                          </el-row>
                        </el-col>
                </el-row>
          </div>
</template>

<script>
import $http from '@/api';

export default {
  watch: {
    temp_warehouse_id() {
      if (this.temp_warehouse_id === this.default_warehouse_id) {
        this.checkedArray = this.default_checkedArray;
      } else {
        this.checkedArray = [];
      }
    },
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      temp_warehouse_id: '', // 暂存 仓库 id
      default_warehouse_id: '', // 缓存分组已有仓库id
      default_checkedArray: [], //  缓存分组已有权限模块
      warehouse: [],
      checkAll: false, // 是否全选
      modules: [], // 权限模块
      checkedArray: [], // 已选中数组
      isIndeterminate: true, // 实现全选效果
      is_init: false, // 初始选择
      // 复选框
      permission_form: {
        module: [], // 权限模块数组
        moduleChecked: [],
        warehouse: [],
        usersGroup: [],
      },
      // 提交的表单
      form: {
        modules: [],
        group_id: '',
        warehouse_id: '',
        owner_id: '',
      },
    };
  },
  methods: {
    handleCheckAllChange(val) {
      const modulesId = [];
      if (val) {
        for (let i = 0; i < this.modules.length; i += 1) {
          modulesId.push(this.modules[i].id);
        }
        this.checkedArray = modulesId;
      } else {
        this.checkedArray = [];
      }
      this.isIndeterminate = false;
    }, // 处理全选
    handleCheckedChange(val) {
      const checkedCount = val.length;
      this.checkAll = checkedCount === this.modules.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.modules.length;
    }, // 处理全选
    getData() {
      $http.getStaffDetail(this.$route.params.groupId)
        .then((res) => {
          const data = res.data;
          // 总模块
          this.warehouse = data.authorize.warehouse;
          this.modules = data.authorize.modules;
          // 分情况处理(初次选择权限和已选择两种情况)
          if (res.data.group.warehouse_id) { // 已选择仓库的情况
            this.form.warehouse_id = data.group.warehouse_id;
            this.checkedArray = data.group.module;
            this.default_warehouse_id = data.group.warehouse_id; // 缓存默认数据
            this.default_checkedArray = data.group.module;
            this.is_init = true;
          }
        });
    }, // 获取所有权限模块
    handleChange(warehousId) {
      this.temp_warehouse_id = warehousId;
    }, // 选中仓库联动
    // 提交表单
    submit_form() {
      this.form.group_id = this.$route.params.groupId; // 表单数据预处理
      const modulesIdCopy = []; // 存储 modulesId 用于提交
      for (let i = 0; i < this.modules.length; i += 1) {
        modulesIdCopy.push(this.modules[i].id);
      }
      this.form.modules = modulesIdCopy;
      if (!this.form.modules.length) {
        this.$message({
          type: 'error',
          message: '请选择权限!',
        });
        return;
      }
      if (!this.form.warehouse_id) {
        this.$message({
          type: 'error',
          message: '请选择仓库!',
        });
        return;
      }
      this.$confirm('确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 推送修改信息
          $http.addStaffGroupDetail(this.form)
            .then((res) => {
              // 处理添加成功
              if (res.status === 0) {
                // 显示成功消息
                this.$message({
                  type: 'success',
                  message: '修改成功!',
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
.Permissions_main {
  width: 92%;
  min-height: 607px;
  background-color: white;
  margin: 15px 0 50px 15px;
  padding: 20px 0 0 40px;
  .form_main {
    width: 100%;
    min-height: 507px;
  }
  .owner_main_name {
    display: inline-block;
    margin: 14px 0 0 0;
  }
  .submit_form_icon {
    position: relative;
    left: 500px;
    bottom: 20px;
    background-color: @ThemeColor;
    color: @white;
  }
  .permission_tree {
    margin: 0 0 0 100px;
  }
}
</style>
