<template>
  <el-dialog
    title="新增仓库信息"
    :center="true"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
  >
    <el-row :class="$style.add_warehouse_main">
      <!-- 新增仓库信息 -->
      <el-col :span="10" :offset="6">
        <el-form
          :class="$style.staff_form"
          label-width="140px"
          size="middle"
          label-position="left"
          :model="warehouseInfo"
          ref="form"
          :rules="info_Verify_rules">
          <el-form-item
            prop="name_cn"
            label="仓库名称"
            size="middle">
            <el-input
              v-model="warehouseInfo.name_cn"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            prop="code"
            label="仓库编码"
            size="middle"
          >
            <el-input
              v-model="warehouseInfo.code">
            </el-input>
          </el-form-item>
          <!-- 地址 -->
          <el-form-item
            prop="address"
            label="地址"
            size="middle">
            <el-cascader
              :props="props"
              :options="addressInfo"
              v-model="warehouseInfo.address"
              style="width: 260px;">
            </el-cascader>
          </el-form-item>
          <el-form-item
            prop="addressDetail"
            label="(详细地址)"
            size="middle">
            <el-input
              type="textarea"
              v-model="warehouseInfo.addressDetail">
            </el-input>
          </el-form-item>
          <el-form-item
            prop="area"
            label="面积 (平方米)"
            size="middle">
            <el-input
              v-model="warehouseInfo.area">
            </el-input>
          </el-form-item>
        </el-form>
        <el-row
          :class="$style.submit_btn"
        >
          <el-col :span="2" :offset="13">
            <el-button
                type="success"
                @click="warehouseInfoSubmit">
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
  name: 'addWarehouse',
  props: ['visible'],
  data() {
    // 自定义的验证规则
    const check = {
      name_cn: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入仓库名称'));
        }
      },
      code: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入仓库编码名称'));
        }
      },
      address: (rule, value, callback) => {
        if (value.length === 0) {
          return callback(new Error('请输入地址'));
        }
      },
      addressDetail: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入详细地址'));
        }
      },
      area: (rule, value, callback) => {
        console.log(value, 'val');
        if (!value || Number.isInteger(value) || value <= 0) {
          return callback(new Error('仓库面积必填且为正整数'));
        }
      },
    };
    return {
      warehouseInfo: {
        name_cn: '',
        code: '',
        address: [],
        addressDetail: '',
        area: '',
      },
      formInfo: {},
      addressInfo: Address.children, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children',
      },
      info_Verify_rules: { // 表单输入验证提醒
        name_cn: [
          { validator: check.name_cn, trigger: 'blur', required: true },
        ],
        code: [
          { validator: check.code, trigger: 'blur', required: true },
        ],
        address: [
          { type: Array, validator: check.address, trigger: 'change', required: true },
        ],
        addressDetail: [
          { validator: check.addressDetail, trigger: 'blur', required: true },
        ],
        area: [
          { validator: check.area, trigger: 'blur', required: true },
        ],
      },
    };
  },
  methods: {
    // 提交修改信息
    warehouseInfoSubmit() {
      // 提交的表单信息处理
      this.formInfo.name_cn = this.warehouseInfo.name_cn;
      this.formInfo.code = this.warehouseInfo.code;
      this.formInfo.province = this.warehouseInfo.address[0];
      this.formInfo.city = this.warehouseInfo.address[1];
      this.formInfo.street = this.warehouseInfo.address[2];
      this.formInfo.door_no = this.warehouseInfo.addressDetail;
      this.formInfo.area = this.warehouseInfo.area;
      const flag = this.$refs.form.validate(a => a);
      // eslint-disable-next-line
      if (!flag) {
        // eslint-disable-next-line
        if (Object.values(this.formInfo).includes('')) return;
        this.$confirm('确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            $http.addWarehouse(this.formInfo)
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
                    type: 'info',
                    message: '添加失败',
                  });
                }
              })
              .catch(() => {
                console.log('添加出错');
              });
          })
          .catch(() => {});
      }
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
