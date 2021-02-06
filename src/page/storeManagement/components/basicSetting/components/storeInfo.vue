<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <el-dialog
    :title="this.text_flag ? `编辑${active_tab_item}` : `添加${active_tab_item}`"
    :center="true"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
    width="50%"
  >
    <el-row :class="$style.add_warehouse_main">
      <!-- 添加信息 -->
      <el-col :span="10" :offset="6">
        <el-form
          :model="add_info"
          ref="form"
          :class="$style.staff_form"
          label-width="140px"
          size="middle"
          label-position="left"
          :rules="info_Verify_rules"
        >
          <!-- 货区编号 -->
          <el-form-item :label="`${active_tab_item}编号`" prop="code" size="middle">
            <el-input v-model="add_info.code"> </el-input>
          </el-form-item>
          <!-- 货区名称 -->
          <el-form-item :label="`${active_tab_item}名称`" prop="name_cn" size="middle">
            <el-input v-model="add_info.name_cn"> </el-input>
          </el-form-item>
          <!-- 是否启用 -->
          <el-form-item label="是否启用" prop="is_enabled">
            <el-switch
              v-model="is_enabled"
              active-color="#13ce66"
              active-value="1"
              inactive-value="0"
              inactive-color="#ccc"
            >
            </el-switch>
          </el-form-item>
          <label class="label"> 选填信息: </label>
          <el-form-item :label="$t('remark')" prop="remark" size="middle">
            <el-input v-model="add_info.remark" type="textarea"> </el-input>
          </el-form-item>
        </el-form>
        <!-- 提交 -->
        <el-row>
          <el-col :span="2" :offset="13">
            <el-button @click="infoSubmit" :class="$style.submit_btn">
              提交
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :class="$style.add_warehouse_main">
      <!-- 添加信息 -->
      <el-col :span="10" :offset="6">
        <el-form
          :model="add_info"
          ref="form"
          :class="$style.staff_form"
          label-width="140px"
          size="middle"
          label-position="left"
          :rules="info_Verify_rules"
        >
          <!-- 货区编号 -->
          <el-form-item :label="`${active_tab_item}编号`" prop="code" size="middle">
            <el-input v-model="add_info.code"> </el-input>
          </el-form-item>
          <!-- 货区名称 -->
          <el-form-item
            :label="this.text_flag ? `${active_tab_item}名称` : `${active_tab_item}名称`"
            prop="name_cn"
            size="middle"
          >
            <el-input v-model="add_info.name_cn"> </el-input>
          </el-form-item>
          <!-- 是否启用 -->
          <el-form-item label="是否启用" prop="is_enabled">
            <el-switch
              v-model="is_enabled"
              active-color="#13ce66"
              active-value="1"
              inactive-value="0"
              inactive-color="#ccc"
            >
            </el-switch>
          </el-form-item>
          <label class="label"> 选填信息: </label>
          <el-form-item label="通道">
            <el-input size="small"> </el-input>
          </el-form-item>
          <el-form-item label="排">
            <el-input size="small"> </el-input>
          </el-form-item>
          <el-form-item label="列">
            <el-input size="small"> </el-input>
          </el-form-item>
          <el-form-item label="层">
            <el-input size="small"> </el-input>
          </el-form-item>
          <el-form-item :label="$t('remark')">
            <el-input type="textarea" size="small" :rows="3"> </el-input>
          </el-form-item>
        </el-form>
        <!-- 提交 -->
        <el-row :class="$style.submit_btn">
          <el-col :span="2" :offset="13">
            <el-button @click="infoSubmit" :class="$style.submit_btn">
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

export default {
  name: 'addRecordInfo',
  props: {
    visible: [Boolean],
    tabs: [Array],
    active_tab_item: [String],
    active_add_text: [String],
    row_data: [Object],
    clear_is_enabled: [Number]
  },
  data() {
    // 自定义的验证规则
    const check = {
      code: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入编号'));
        } else {
          callback();
        }
      },
      name_cn: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入名称'));
        } else {
          callback();
        }
      }
    };
    return {
      add_info: {
        code: '',
        name_cn: '', // 分类名称
        remark: '' // 备注
      },
      is_enabled: '0',
      formInfo: {},
      text_flag: '',
      info_Verify_rules: {
        // 表单输入验证提醒
        code: [{ validator: check.code, trigger: 'blur', required: true }],
        name_cn: [{ validator: check.name_cn, trigger: 'blur', required: true }]
      }
    };
  },
  methods: {
    // 提交修改信息
    infoSubmit() {
      // 提交的表单信息处理
      /* eslint-disable */
      this.formInfo.code = this.add_info.code;
      this.formInfo.name_cn = this.add_info.name_cn;
      this.formInfo.is_enabled = +this.is_enabled;
      this.formInfo.remark = `${this.add_info.remark}`;
      this.formInfo.warehouse_id = this.$route.params.warehouses_id; // 仓库 id
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let active_item = this.active_tab_item; // 活动标签
              let id = this.row_data.id; // 用于编辑
              // 如果 id 存在, 则为编辑信息，否则是添加信息
              if (id) { // 编辑信息
                if (this.active_tab_item === '货区') {
                  $http.editWarehouseArea(id, this.formInfo)
                    .then((re) => {
                      if (re.status) return;
                      this.$emit('updata_data', active_item); // 更新数据列表
                    });
                } else if (this.active_tab_item === '货位') {
                  $http.editWarehouseshelf(id, this.formInfo)
                    .then((re) => {
                      if (re.status) return;
                      this.$emit('updata_data', active_item); // 更新数据列表
                    });
                }
              } else { // 添加信息
                if (this.active_tab_item === '货区') {
                  $http.addWarehouseArea(this.formInfo)
                    .then((re) => {
                      if (re.status) return;
                      this.$emit('updata_data_list', active_item); // 更新数据列表
                    });
                } else if (this.active_tab_item === '货位') {
                  $http.addWarehouseshelf(this.formInfo)
                    .then((re) => {
                      if (re.status) return;
                      this.$emit('updata_data_list', active_item); // 更新数据列表
                    });
                }
              }
              this.$emit('update:visible', false); // 关闭弹窗
            });
        }
      });
    },
  },
};
</script>

<style lang="less" module>
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
}
.staff_form {
  width: 400px;
  height: 300px;
  margin: 0 auto;
  background-color: white;
}
.staff_title {
  display: inline-block;
  margin: 10px 0 40px 0;
  font-size: 16px;
  font-weight: 400;
}
.submit_btn {
  background-color: @ThemeColor;
  color: #fff;
}
</style>
