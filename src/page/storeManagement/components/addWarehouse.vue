<template>
    <div  :class="$style.add_warehouse">
        <div  :class="$style.main">
            <el-row  :class="$style.add_warehouse_main">
                <el-col >
                    <el-form
                        ref="rule_form"
                        label-width="140px"
                        :rules="rules"
                        label-position="left"
                        :model="warehouseInfo">
                        <el-form-item
                            prop="name_cn"
                            :label="$t('storeName')"
                            size="middle">
                            <el-input  v-model="warehouseInfo.name_cn"></el-input>
                        </el-form-item>
                        <el-form-item
                            prop="address"
                            :label="$t('SSQ')"
                            size="middle">
                            <el-cascader
                                :props="props"
                                :options="addressInfo"
                                v-model="warehouseInfo.address"
                                placeholder=""
                                style="width: 100%;">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item
                            prop="addressDetail"
                            :label="$t('addressDetial')"
                            size="middle">
                            <el-input
                              type="textarea"
                              v-model="warehouseInfo.addressDetail">
                            </el-input>
                        </el-form-item>
                        <label class="label">{{$t('extraInfomation')}}</label>
                        <el-form-item
                            prop="area"
                            :label="$t('WarehouseArea')"
                            size="medium">
                            <el-col :span="5">
                                <el-input v-model="warehouseInfo.area">
                                  <template slot="append">m²</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                        <!-- <el-form-item  label="启用多语言输入">
                            <el-switch
                              v-model="warehouseInfo.isEnabledLang"
                              active-text="开启"
                              :active-value="1"
                              :inactive-value="0">
                            </el-switch>
                            <div :class="$style.tips">开启后商品库、分类都需要填写外文名称</div>
                        </el-form-item> -->
                        <el-form-item>
                            <el-button
                                type="primary"
                                :class="$style.submit_btn"
                                @click="warehouseInfoSubmit">
                                {{$t('confirm')}}
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import $http from '@/api';
import Options from '@/assets/address.json';

export default {
  name: 'addWarehouse',
  data() {
    // 自定义的验证规则
    const check = {
      name_cn: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('Warehousenamecannotbeempty')));
        } else {
          callback();
        }
      },
      code: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('Pleaseenterapositiveinteger')));
        } else {
          callback();
        }
      },
      address: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('pleaseInputCity')));
        } else {
          callback();
        }
      },
      addressDetail: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('Pleaseenteradetailedaddress')));
        } else {
          callback();
        }
      },
      area: (rule, value, callback) => {
        if (parseInt(value, 10) <= 0 || isNaN(parseInt(value, 10))) {
          callback(new Error(this.$t('PleaseEnterTheWarehouseArea')));
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
        // isEnabledLang: 0,
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
  // watch: {
  //   row_data() {
  //     if (!Object.keys(this.row_data).length) {
  //       this.text_flag = false;
  //       this.warehouseInfo = {};
  //     } else {
  //       /* eslint-disable */
  //       this.text_flag = true;
  //       this.warehouseInfo.name_cn       = this.row_data.name_cn;
  //       this.warehouseInfo.code          = this.row_data.code;
  //       this.warehouseInfo.address       = [this.row_data.province, this.row_data.city, this.row_data.street];
  //       this.warehouseInfo.addressDetail = this.row_data.door_no;
  //       this.warehouseInfo.area          = this.row_data.area;
  //     }
  //   },
  // },
  methods: {
    message(status, successMsg, failMsg) {
      if (!status) {
        this.$message({
          type: 'success',
          message: `${successMsg}`,
        });
      } else {
        this.$message({
          type: 'info',
          message: `${failMsg}`,
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
    //         });
    //     });
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
      // this.formInfo.is_enabled_lang = this.warehouseInfo.isEnabledLang;
      this.$refs.rule_form.validate((validate) => {
        if (validate) {
          $http.addWarehouse(this.formInfo)
            .then((res) => {
              if (res.status) return;
              this.$router.replace({ name: 'storeManage' });
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" module>


.add_warehouse {
  .main {
    width: 88%;
    min-height: 507px;
    margin: 20px auto;
    padding: 45px;
    background: @white;
    .add_warehouse_main {
      margin: 0 auto;
      height: 100%;
      .submit_btn {
        background-color: @ThemeColor;
        color: @white;
      }
      .staff_form {
        width: 120%;
        height: 120%;
        margin: 0 auto;
      }
    }
    .tips {
      color: red;
    }
  }
}
</style>
