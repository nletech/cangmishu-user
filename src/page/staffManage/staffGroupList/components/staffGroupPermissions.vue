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
                                                    <el-form-item :label="is_init ? '当前仓库:' : '请选择仓库:'" prop="warehouse">
                                                                  <el-radio-group  v-model="form.warehouse_id"
                                                                                    @change="handleChange">yarndev
                                                                                    <el-radio  :disabled="is_init"
                                                                                              v-for="(item, index) in warehouse"
                                                                                              style="display: block; margin: 0; padding: 16px 0 16px 0;"
                                                                                              :key="index"
                                                                                              :label="item.id">
                                                                                              <span style="color: #000;">{{item.name_cn}}</span>
                                                                                    </el-radio>
                                                                  </el-radio-group>
                                                    </el-form-item>
                                            </el-col>
                                            <el-col :span="10" :offset="4">
                                                    <!-- 请选择操作权限 -->
                                                    <el-form-item label="请选择操作权限:" prop="modules">
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
  data() {
    return {
      temp_warehouse_id: '', // 暂存 仓库 id
      default_warehouse_id: '', // 缓存分组已有仓库id
      default_checkedArray: [], //  缓存分组已有权限模块
      default_warehouse: {}, //  缓存分组已有仓库
      modules: [], // 权限模块
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
      // 重写
      warehouse: [], // 仓库列表
      checkAll: false, // 是否全选(按钮)
      checkedArray: [], // 已选中权限模块数组
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    temp_warehouse_id() {
      if (this.temp_warehouse_id === this.default_warehouse_id) {
        this.checkedArray = this.default_checkedArray;
      } else {
        this.checkedArray = [];
      }
    },
  },
  computed: {
    checked() {
      return { warehouse_id: this.temp_warehouse_id, checkedArray: this.checkedArray };
    },
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
    handleCheckedChange(val) { // 全选按钮的显示状态
      const checkedCount = val.length;
      this.checkAll = checkedCount === this.modules.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.modules.length;
    }, // 处理全选
    getData() {
      $http.getStaffDetail(this.$route.params.groupId)
        .then((res) => {
          const data = res.data;
          // 总模块
          const WAREHOUSE = data.authorize.warehouse; // 总的仓库列表
          const MODULES = data.authorize.modules; // 总的权限模块列表
          const GROUP_MODULES = data.group.module; // 属于用户组的权限模块列表
          const GROUP_WAREHOUSE = data.group.warehouse; // 属于用户组的仓库信息
          this.warehouse = WAREHOUSE;
          this.modules = MODULES;
          // 分情况处理(初次选择权限和已选择两种情况)
          if (res.data.group.warehouse_id && GROUP_MODULES.length > 0) { // 已选择仓库的情况
            this.form.warehouse_id = GROUP_WAREHOUSE.id; // 表单 warehouse_id
            this.checkedArray = GROUP_MODULES; // 用户组已拥有的权限模块
            this.default_warehouse_id = GROUP_WAREHOUSE.id; // 缓存默认数据
            this.default_checkedArray = GROUP_MODULES;
            this.warehouse = [];
            this.warehouse.push(GROUP_WAREHOUSE);
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
      this.form.modules = this.checkedArray;
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
        });
    },
  },
};
</script>

<style lang="less" module>

.Permissions_main {
  width: 92%;
  min-height: 607px;
  background-color: white;
  margin: 15px 0 50px 15px;
  padding: 20px 0 0 40px;
  .form_main {
    width: 110%;
    min-height: 607px;
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
