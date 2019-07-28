<template>
  <el-dialog  :title="this.text_flag ? `编辑${active_tab_item}` : `添加${active_tab_item}` "
              :center="true"
              @update:visible="$emit('update:visible', $event)"
              :visible="visible"
              width="60%">
              <el-row  :class="$style.add_warehouse_main">
                       <!-- 添加信息 -->
                       <el-col>
                                <el-form  :class="$style.staff_form"
                                          label-width="140px"
                                          size="middle"
                                          label-position="left"
                                          :model="add_info"
                                          ref="form"
                                          :rules="info_Verify_rules">
                                          <el-form-item  prop="full_name"
                                                         label="姓名"
                                                         size="middle">
                                                         <el-input  v-model="add_info.full_name">
                                                         </el-input>
                                          </el-form-item>
                                          <el-form-item  prop="phone"
                                                         label="电话"
                                                         size="middle">
                                                         <el-input  v-model="add_info.phone">
                                                         </el-input>
                                          </el-form-item>
                                          <!-- 地址 -->
                                          <el-form-item  prop="address"
                                                         label="省市区"
                                                         size="middle">
                                                         <el-cascader style="width:100%;"
                                                                       :props="props"
                                                                       :options="addressInfo"
                                                                       v-model="add_info.address">
                                                         </el-cascader>
                                          </el-form-item>
                                          <el-form-item  prop="addressDetail"
                                                         label="详细地址"
                                                         size="middle">
                                                         <el-input  type="textarea"
                                                                    v-model="add_info.addressDetail">
                                                         </el-input>
                                          </el-form-item>
                                          <el-form-item>
                                            <el-button  :class="$style.submit_btn" @click="infoSubmit">提交</el-button>
                                          </el-form-item>
                                </el-form>
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
    row_data: [Object],
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
        if (!value) {
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
      text_flag: '',
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
          { type: Array, validator: check.address, trigger: 'blur', required: true },
        ],
        addressDetail: [
          { validator: check.addressDetail, trigger: 'blur', required: true },
        ],
      },
    };
  },
  watch: {
    row_data() {
      // 监听传入的 row_data 如果是空对象则弹框文字显示为 "添加",然后清除下表单的缓存
      // 如果是通过编辑按钮传入 row_data 则将信息填充进表单，填充的 id 用于请求编辑信息接口
      if (!Object.keys(this.row_data).length) {
        this.text_flag = false;
        this.add_info = {};
      } else {
        /* eslint-disable */
        this.text_flag = true;
        this.add_info.full_name       = this.row_data.fullname; // 姓名
        this.add_info.phone           = this.row_data.phone; // 电话
        this.add_info.address         = [this.row_data.province, this.row_data.city, this.row_data.district]; // 地址
        this.add_info.addressDetail   = this.row_data.address; // 详细地址
      }
    },
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
          let active_item = this.active_tab_item; // 活动标签
          let id = this.row_data.id; // 用于编辑
          // 如果 id 存在, 则为编辑信息，否则是添加信息
          if (id) {
            if (this.active_tab_item === '发件人信息') {
              $http.editSenderAddress(id, this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data', active_item); // 更新数据列表
                });
            } else if(this.active_tab_item === '收件人信息') {
              $http.editReceiverAddress(id, this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data', active_item); // 更新数据列表
                });
            }
          } else {
            if (this.active_tab_item === '发件人信息') {
              $http.addSenderAddress(this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data_list', active_item); // 更新数据列表
                });
            } else if(this.active_tab_item === '收件人信息') {
              $http.addReceiverAddress(this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data_list', active_item); // 更新数据列表
                });
            }
          }
          this.$emit('update:visible', false); // 关闭弹窗
        }
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';

.add_warehouse_main {
  width: 96%;
  height: 50%;
  margin: 0 auto;
  padding: 30px 0 0 0;
  background-color: white;
  .avatar_name {
    display: inline-block;
    margin: 20px 0 10px 20px;
  }
  .submit_btn {
    background-color: @ThemeColor;
    color: white;
  }
}
.staff_form {
  width: 100%;
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
