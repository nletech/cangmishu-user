<template>
  <el-dialog
    :title="this.text_flag ? '编辑仓库信息' : '新增仓库信息'"
    :center="true"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
    width="60%"
  >
    <el-row :class="$style.add_warehouse_main">
      <el-col :span="10" :offset="6">
        <el-form
          :class="$style.staff_form"
          label-width="140px"
          size="middle"
          :rules="rules"
          ref="rule_form"
          label-position="left"
          :model="warehouseInfo"
        >
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
                style="width: 100%;">
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
// import Axios from 'axios';
import $http from '@/api';
import Options from '@/assets/address.json';

export default {
  name: 'addWarehouse',
  props: {
    visible: [Boolean],
    row_data: [Object],
  },
  data() {
    // 自定义的验证规则
    const check = {
      name_cn: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      },
      code: (rule, value, callback) => {
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
      area: (rule, value, callback) => {
        if (parseInt(value, 10) <= 0 || isNaN(parseInt(value, 10))) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      },
    };
    return {
      rules: {
        name_cn: [
          { validator: check.name_cn, trigger: 'blur', required: true },
        ],
        code: [
          { validator: check.code, trigger: 'blur', required: true },
        ],
        address: [
          { type: Array, validator: check.address, trigger: 'blur', required: true },
        ],
        addressDetail: [
          { validator: check.addressDetail, trigger: 'blur', required: true },
        ],
        area: [
          { validator: check.area, trigger: 'blur', required: true },
        ],
      },
      warehouseInfo: {
        name_cn: '',
        code: '',
        address: [],
        addressDetail: '',
        area: '',
      },
      id: '',
      text_flag: '',
      formInfo: {},
      addressInfo: Options, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children',
      },
    };
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.$emit('update:visible', false); // 关闭弹窗
      }
    },
    row_data() {
      if (!Object.keys(this.row_data).length) {
        this.text_flag = false;
        this.warehouseInfo = {};
      } else {
        /* eslint-disable */
        this.text_flag = true;
        this.warehouseInfo.name_cn       = this.row_data.name_cn;
        this.warehouseInfo.code          = this.row_data.code;
        this.warehouseInfo.address       = [this.row_data.province, this.row_data.city, this.row_data.street];
        this.warehouseInfo.addressDetail = this.row_data.door_no;
        this.warehouseInfo.area          = this.row_data.area;
      }
    },
  },
  methods: {
    message(status, success_msg, fail_msg) {
      if (!status) {
        this.$message({
          type: 'success',
          message: `${success_msg}`,
        });
      } else {
        this.$message({
          type: 'info',
          message: `${fail_msg}`,
        });
      }
    },
    // 获取省市区
    // getAddress() {
    //   Axios.get('https://postcode.exss.io/public/pcd/version.json')
    //     .then((re) => {
    //       Axios.get(`https://postcode.exss.io/public/pcd/${re.version}/pcd.json`)
    //         .then((res) => {
    //           this.addressInfo = this.deleteChildren(res).children;
    //           console.log(this.addressInfo, 'this.addressInfo');
    //           // eslint-disable-next-line
    //           // for (const item in re) {
    //           //   console.log(item, 'item');
    //           // }
    //           // this.addressInfo = res.children;
    //         })
    //         .catch();
    //     })
    //     .catch();
    // },
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
      //
      this.$refs.rule_form.validate((validate) => {
        if (validate) {
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let id = this.row_data.id; // 用于编辑
              if (id) {
                $http.modifyWarehouse(id, this.formInfo)
                  .then((re) => {
                    if (re.status) return;
                    this.$emit('updata_data', true); // 更新数据列表
                  })
                  .catch();
              } else {
                $http.addWarehouse(this.formInfo)
                  .then((res) => {
                    if (res.status) return;
                    // this.message(res.status, '添加成功!', '添加失败!')
                    this.$emit('updata_data', true); // 更新数据列表
                  })
                  .catch(() => {
                    console.log('添加出错');
                  });
              }
              this.$emit('update:visible', false); // 关闭弹窗
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';
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
  width: 120%;
  height: 120%;
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
