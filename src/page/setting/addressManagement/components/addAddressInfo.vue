<template>
  <el-dialog
    :title="this.row_data ? `编辑${active_tab_item}` : `添加${active_tab_item}` "
    :center="true"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
    width="60%"
  >
    <el-row :class="$style.add_warehouse_main">
      <!-- 添加信息 -->
      <el-col :span="10" :offset="6">
        <el-form
          :class="$style.staff_form"
          label-width="140px"
          size="middle"
          label-position="left"
          :model="add_info"
          ref="form"
          :rules="info_Verify_rules">
          <el-form-item
            prop="full_name"
            label="姓名"
            size="middle">
            <el-input
              v-model="add_info.full_name"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            prop="phone"
            label="电话"
            size="middle"
          >
            <el-input
              v-model="add_info.phone">
            </el-input>
          </el-form-item>
          <!-- 地址 -->
          <el-form-item
            prop="address"
            label="省市区"
            size="middle">
            <el-cascader
              :props="props"
              :options="addressInfo"
              v-model="add_info.address"
              style="width: 260px;">
            </el-cascader>
          </el-form-item>
          <el-form-item
            prop="addressDetail"
            label="(详细地址)"
            size="middle">
            <el-input
              type="textarea"
              v-model="add_info.addressDetail">
            </el-input>
          </el-form-item>
        </el-form>
        <el-row
          :class="$style.submit_btn"
        >
          <el-col :span="2" :offset="13">
            <el-button
                type="success"
                @click="infoSubmit">
              提交
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import $http from '@/api';
import Address from '@/assets/address.json';

export default {
  name: 'addAddressInfo',
  props: {
    visible: [Boolean],
    tabs: [Array],
    active_tab_item: [String],
    active_add_text: [String],
  },
  data() {
    // 自定义的验证规则
    const check = {
      full_name: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      },
      phone: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入电话'));
        } else {
          callback();
        }
      },
      address: (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入省市区'));
        } else {
          callback();
        }
      },
      addressDetail: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入详细地址'));
        } else {
          callback();
        }
      },
    };
    return {
      add_info: {
        full_name: '', // 姓名
        phone: '', // 电话
        address: [], // 地址
        addressDetail: '', // 详细地址
      },
      formInfo: {},
      addressInfo: Address, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children',
      },
      info_Verify_rules: { // 表单输入验证提醒
        full_name: [
          { validator: check.full_name, trigger: 'blur', required: true },
        ],
        phone: [
          { validator: check.phone, trigger: 'blur', required: true },
        ],
        address: [
          { type: Array, validator: check.address, trigger: 'change', required: true },
        ],
        addressDetail: [
          { validator: check.addressDetail, trigger: 'blur', required: true },
        ],
      },
    };
  },
  methods: {
    // 提交修改信息
    infoSubmit() {
      // 提交的表单信息处理
      /* eslint-disable */
      this.formInfo.fullname = this.add_info.full_name;
      this.formInfo.phone     = this.add_info.phone;
      this.formInfo.province  = this.add_info.address[0];
      this.formInfo.city      = this.add_info.address[1];
      this.formInfo.district  = this.add_info.address[2];
      this.formInfo.address   = this.add_info.addressDetail;
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              console.log(this.row_data.id, 'this.row_data.id');
              // 编辑
              let id = this.row_data.id;
              if (id) {
                this.active_tab_item === '发件人信息'
                ? $http.editSenderAddress(id, this.formInfo)
                    .then(() => {
                      if (status) return;
                      this.active_item_check(this.active_tab_item);
                    })
                    .catch(() => {})
                : $http.editReceiverAddress(id, this.formInfo)
                  .then(() => {
                    if (status) return;
                    this.active_item_check(this.active_tab_item);
                  })
                  .catch(() => {});
                return; // 终止
              } else {
                this.active_tab_item === '发件人信息'
                ? $http.addSenderAddress(this.formInfo)
                    .then((res) => {
                      if (res.status === 0) {
                        // 显示成功消息
                        this.$message({
                          type: 'success',
                          message: '成功!',
                        });
                        this.$emit('update:visible', false);
                      } else {
                        this.$message({
                          type: 'error',
                          message: '添加失败',
                        });
                      }
                    })
                    .catch(() => {
                      console.log('添加出错');
                    })
                : http.addReceiverAddress(this.formInfo)
                    .then((res) => {
                      if (res.status === 0) {
                        this.$message({
                          type: 'success',
                          message: '成功!',
                        });
                        this.$emit('update:visible', false);
                      } else {
                        this.$message({
                          type: 'error',
                          message: '添加失败',
                        });
                      }
                    })
                    .catch(() => {
                      console.log('添加出错');
                    });
              }
            })
            .catch(() => {});
        }
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';

.add_warehouse_main {
  width: 90%;
  height: 50%;
  margin: 0 auto;
  padding: 30px 0 0 0;
  background-color: white;
  .avatar_name {
    display: inline-block;
    margin: 20px 0 10px 20px;
  }
}
.staff_form {
  width: 400px;
  height: 400px;
  margin: 0 auto;
  background-color: white;
}
.staff_title {
  display: inline-block;
  margin: 10px 0 40px 0;
  font-size: 16px;
  font-weight: 400;
}
</style>
