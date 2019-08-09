<template>
    <el-dialog
        :title="this.text_flag ? `编辑${active_tab_item}` : `添加${active_tab_item}` "
        :center="true"
        @update:visible="$emit('update:visible', $event)"
        :visible="visible"
        width="50%">
        <el-row :class="$style.add_warehouse_main">
          <!-- 添加信息 -->
          <el-col
              :span="10"
              :offset="6">
              <el-form
                  :model="add_info"
                  ref="form"
                  :class="$style.staff_form"
                  label-width="140px"
                  size="middle"
                  label-position="left"
                  :rules="info_Verify_rules">
                  <el-form-item
                      :label="this.text_flag ? `${active_tab_item}名称` : `${active_tab_item}名称`"
                      prop="name"
                      size="middle">
                      <el-input  v-model="add_info.name">
                      </el-input>
                  </el-form-item>
                  <el-form-item
                      label="是否启用"
                      prop="is_enabled">
                      <el-switch  v-model="is_enabled"
                                  active-color="#13ce66"
                                  active-value="1"
                                  inactive-value="0"
                                  inactive-color="#ccc">
                      </el-switch>
                  </el-form-item>
              </el-form>
              <el-row>
                  <el-col
                      :span="2"
                      :offset="13">
                      <el-button  @click="infoSubmit"
                                  :class="$style.submit_btn">
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
import mixin from '@/mixin/form_config';

export default {
  name: 'addRecordInfo',
  mixins: [mixin],
  props: {
    visible: [Boolean],
    tabs: [Array],
    active_tab_item: [String],
    active_add_text: [String],
    row_data: [Object],
    clear_is_enabled: [Number],
  },
  data() {
    // 自定义的验证规则
    const check = {
      name: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入分类名称'));
        } else {
          callback();
        }
      },
    };
    return {
      add_info: {
        name: '', // 分类名称
      },
      is_enabled: '1',
      formInfo: {},
      text_flag: '',
      info_Verify_rules: { // 表单输入验证提醒
        name: [
          { validator: check.name, trigger: 'blur', required: true },
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
        this.is_enabled = '1';
      } else {
        /* eslint-disable */
        this.text_flag = true;
        this.add_info.name = this.row_data.name; // 姓名
        this.is_enabled  = `${this.row_data.is_enabled}`; // 是否启用
      }
    },
  },
  methods: {
    // 提交修改信息
    infoSubmit() {
      // 提交的表单信息处理
      /* eslint-disable */
      this.formInfo.name = this.add_info.name;
      this.formInfo.is_enabled = +this.is_enabled;
      this.formInfo.warehouse_id = this.warehouseId;
      this.$refs.form.validate((validate) => {
        if (validate) {
          let active_item = this.active_tab_item; // 活动标签
          let id = this.row_data.id; // 用于编辑
          // 如果 id 存在, 则为编辑信息，否则是添加信息
          if (id) { // 编辑信息
            if (this.active_tab_item === '入库单分类') {
              $http.editBatchType(id, this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data', active_item); // 更新数据列表
                });
            } else if(this.active_tab_item === '出库单分类') {
              $http.editOrderType(id, this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data', active_item); // 更新数据列表
                });
            }
          } else { // 添加信息
            if (this.active_tab_item === '入库单分类') {
              $http.addBatchType(this.formInfo)
                .then((re) => {
                  if (re.status) return;
                  this.$emit('updata_data_list', active_item); // 更新数据列表
                });
            } else if(this.active_tab_item === '出库单分类') {
              $http.addOrderType(this.formInfo)
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
  width: 400px;
  height: 200px;
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
