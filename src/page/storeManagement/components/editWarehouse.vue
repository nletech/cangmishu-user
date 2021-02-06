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
    :title="$t('edit')"
    :center="true"
    :visible.sync="visible"
    :before-close="handleClose"
    width="80%"
  >
    <el-form
      label-width="140px"
      :rules="rules"
      ref="rule_form"
      label-position="left"
      :model="warehouseInfo"
    >
      <label class="label">{{ $t('Essentialformrmation') }}</label>
      <el-form-item prop="name_cn" :label="$t('storeName')" size="medium">
        <el-input v-model="warehouseInfo.name_cn" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="address" :label="$t('SSQ')" size="medium">
        <el-cascader
          :props="props"
          :options="addressInfo"
          v-model="warehouseInfo.address"
          style="width: 100%;"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item prop="contact_number" :label="$t('phone')" size="medium">
        <el-input v-model="warehouseInfo.contact_number"> </el-input>
      </el-form-item>
      <el-form-item prop="addressDetail" :label="$t('addressDetial')" size="medium">
        <el-input v-model="warehouseInfo.addressDetail"> </el-input>
      </el-form-item>
      <label class="label">{{ $t('notNecessaryInfo') }}</label>
      <el-form-item prop="area" :label="$t('WarehouseArea')" size="medium">
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
        <el-button type="primary" :class="$style.submit_btn" @click="warehouseInfoSubmit">
          {{ $t('submit') }}
        </el-button>
        <el-button @click="handleClose">
          {{ $t('cancel') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import $http from '@/api';
import Options from '@/assets/address.json';

export default {
  name: 'editWarehouse',
  props: {
    visible: [Boolean],
    row_data: [Object]
  },
  data() {
    // 自定义的验证规则
    const check = {
      name_cn: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('Pleaseenterawarehousename')));
        } else {
          callback();
        }
      },
      code: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入仓库编码'));
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
          callback(new Error(this.$t('Pleaseenterapositiveinteger')));
        } else {
          callback();
        }
      }
    };
    return {
      rules: {
        name_cn: [{ validator: check.name_cn, trigger: 'blur', required: true }],
        code: [{ validator: check.code, trigger: 'blur', required: true }],
        address: [
          {
            type: Array,
            validator: check.address,
            trigger: 'blur',
            required: true
          }
        ],
        addressDetail: [{ validator: check.addressDetail, trigger: 'blur', required: true }],
        area: [{ validator: check.area, trigger: 'blur', required: true }],
        contact_number: [{ trigger: 'blur', required: true }]
      },
      warehouseInfo: {
        name_cn: '',
        code: '',
        address: [],
        addressDetail: '',
        area: '',
        contact_number: ''
        // isEnabledLang: 0,
      },
      id: '',
      text_flag: '',
      formInfo: {},
      addressInfo: Options, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children'
      }
    };
  },
  watch: {
    row_data() {
      if (!Object.keys(this.row_data).length) {
        this.text_flag = false;
        this.warehouseInfo = {};
      } else {
        /* eslint-disable */
        this.text_flag = true;
        this.warehouseInfo.name_cn = this.row_data.name_cn;
        this.warehouseInfo.code = this.row_data.code;
        this.warehouseInfo.address = [
          this.row_data.province,
          this.row_data.city,
          this.row_data.street
        ];
        this.warehouseInfo.addressDetail = this.row_data.door_no;
        this.warehouseInfo.area = this.row_data.area;
        this.warehouseInfo.contact_number = this.row_data.contact_number;
        // this.warehouseInfo.isEnabledLang = this.row_data.is_enabled_lang;
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    message(status, success_msg, fail_msg) {
      if (!status) {
        this.$message({
          type: 'success',
          message: `${success_msg}`
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
      this.formInfo.contact_number = this.warehouseInfo.contact_number;
      // this.formInfo.is_enabled_lang = this.warehouseInfo.isEnabledLang;
      this.$refs.rule_form.validate(validate => {
        if (validate) {
          let id = this.row_data.id; // 用于编辑
          if (id) {
            $http.modifyWarehouse(id, this.formInfo).then(res => {
              if (res.status) return;
              this.$emit('updata_data', true); // 更新数据列表
              this.$emit('update:visible', false); // 关闭弹窗
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" module>
.tips {
  color: red;
}
</style>
