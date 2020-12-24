<template>
  <el-dialog
    :title="title"
    :center="true"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
    @closed="onClosedDialog"
    width="60%"
  >
    <el-row :class="$style.add_warehouse_main">
      <!-- 添加信息 -->
      <el-col>
        <el-form
          :class="$style.staff_form"
          label-width="140px"
          size="middle"
          label-position="left"
          :model="addressInfo"
          ref="addressForm"
          :rules="info_Verify_rules"
        >
          <el-form-item prop="full_name" :label="$t('name')" size="middle">
            <el-input v-model="addressInfo.full_name" placeholder="请输入姓名"> </el-input>
          </el-form-item>
          <el-form-item prop="country" :label="$t('国家/地区')" size="middle">
            <el-select
              v-model="addressInfo.country"
              @change="onChangeCountry"
              placeholder="请选择国家"
              style="width: 100%"
            >
              <el-option
                v-for="item in ocountryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" :label="$t('phone')" size="middle">
            <el-input v-model="addressInfo.phone" placeholder="请输入电话"> </el-input>
          </el-form-item>
          <!-- 地址 -->
          <el-form-item v-if="!visibleOtherCountry" prop="address" :label="$t('SSQ')" size="middle">
            <el-cascader
              style="width: 100%"
              :props="props"
              :options="addressList"
              v-model="addressInfo.address"
              placeholder="请选择地址"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-if="visibleOtherCountry" prop="city" :label="$t('城市')" size="middle">
            <el-input v-model="addressInfo.city" placeholder="请输入城市"> </el-input>
          </el-form-item>
          <el-form-item v-if="visibleOtherCountry" prop="street" :label="$t('街道')" size="middle">
            <el-input v-model="addressInfo.street" placeholder="请输入街道"></el-input>
          </el-form-item>
          <el-form-item
            v-if="visibleOtherCountry"
            prop="door_no"
            :label="$t('门牌号')"
            size="middle"
          >
            <el-input v-model="addressInfo.door_no" placeholder="请输入门牌号"></el-input>
          </el-form-item>
          <el-form-item prop="addressDetail" :label="$t('addressDetial')" size="middle">
            <el-input
              type="textarea"
              v-model="addressInfo.addressDetail"
              placeholder="请输入详细地址"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col>
                <el-button :class="$style.submit_btn" @click="infoSubmit">
                  {{ $t('submit') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import $http from '@/api';
import Address from '@/assets/address.json';
import mixin from '@/mixin/form_config';

export default {
  name: 'addAddressInfo',
  mixins: [mixin],
  props: {
    visible: [Boolean],
    active_tab_item: [String],
    active_add_text: [String],
    row_data: [Object]
  },
  data() {
    return {
      visibleOtherCountry: true,
      country: '',
      Areacode: '',
      AreaCodeList: [
        {
          id: 0,
          label: '中国',
          value: 'CN'
        }
      ],
      ocountryOptions: [
        {
          id: 0,
          label: '中国',
          value: '中国'
        },
        {
          id: 1,
          label: '中国台湾',
          value: '中国台湾'
        },
        {
          id: 2,
          label: '中国香港',
          value: '中国香港'
        },
        {
          id: 3,
          label: '中国澳门',
          value: '中国澳门'
        },
        {
          id: 4,
          label: '荷兰',
          value: '荷兰'
        },
        {
          id: 5,
          label: '德国',
          value: '德国'
        },
        {
          id: 6,
          label: '比利时',
          value: '比利时'
        },
        {
          id: 7,
          label: '波兰',
          value: '波兰'
        },
        {
          id: 8,
          label: '法国',
          value: '法国'
        },
        {
          id: 9,
          label: '英国',
          value: '英国'
        },
        {
          id: 10,
          label: '韩国',
          value: '韩国'
        },
        {
          id: 11,
          label: '美国',
          value: '美国'
        },
        {
          id: 12,
          label: '新加坡',
          value: '新加坡'
        },
        {
          id: 13,
          label: '马来西亚',
          value: '马来西亚'
        },
        {
          id: 14,
          label: '加拿大',
          value: '加拿大'
        },
        {
          id: 15,
          label: '泰国',
          value: '泰国'
        }
      ],
      addressInfo: {
        full_name: '', // 姓名
        phone: '', // 电话
        address: [], // 地址
        addressDetail: '', // 详细地址
        country: '',
        door_no: '',
        street: '',
        city: ''
      },
      initAddressObj: {
        full_name: '', // 姓名
        phone: '', // 电话
        address: [], // 地址
        addressDetail: '', // 详细地址
        country: '',
        door_no: '',
        street: '',
        city: ''
      },
      formInfo: {},
      text_flag: '',
      addressList: Address, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children'
      },
      info_Verify_rules: {
        // 表单输入验证提醒
        country: [{ message: '请选择国家/地区', trigger: 'blur', required: true }],
        city: [{ message: '请输入城市', trigger: 'blur', required: true }],
        street: [{ message: '请输入街道', trigger: 'blur', required: true }],
        door_no: [{ message: '请输入门牌号', trigger: 'blur', required: true }],
        full_name: [
          {
            message: this.$t('Pleasetypeinyourname'),
            trigger: 'blur',
            required: true
          }
        ],
        phone: [
          {
            message: this.$t('PleaseEnterPhone'),
            trigger: 'blur',
            required: true
          }
        ],
        address: [
          {
            message: this.$t('pleaseInputCity'),
            trigger: 'blur',
            required: true
          }
        ],
        addressDetail: [
          {
            message: this.$t('Pleaseenteradetailedaddress'),
            trigger: 'blur',
            required: true
          }
        ]
      }
    };
  },
  computed: {
    title() {
      if (this.text_flag === 1) {
        if (this.active_tab_item === '发件人信息') {
          return this.$t('sender');
        } else if (this.active_tab_item === '收件人信息') {
          return this.$t('receiver');
        }
      } else if (this.active_tab_item === '发件人信息') {
        return this.$t('sender');
      } else if (this.active_tab_item === '收件人信息') {
        return this.$t('receiver');
      }
      return false;
    }
  },
  watch: {
    row_data(value) {
      // 监听传入的 row_data 如果是空对象则弹框文字显示为 "添加",然后清除下表单的缓存
      // 如果是通过编辑按钮传入 row_data 则将信息填充进表单，填充的 id 用于请求编辑信息接口
      if (value.country === 'CN' || !value.country) {
        this.visibleOtherCountry = false;
      } else {
        this.visibleOtherCountry = true;
      }
      if (!value.id) {
        this.text_flag = false;
        if (this.$refs.addressForm) {
          this.$refs.addressForm.resetFields();
          this.addressInfo = JSON.parse(JSON.stringify(this.initAddressObj));
        }
      } else {
        /* eslint-disable */
        this.text_flag = true;
        this.addressInfo.full_name = value.fullname; // 姓名
        this.addressInfo.phone = value.phone; // 电话
        this.addressInfo.address = [value.province, value.city, value.district]; // 地址
        this.addressInfo.addressDetail = value.address; // 详细地址
        this.addressInfo.door_no = value.door_no;
        this.addressInfo.street = value.street;
        this.addressInfo.country = value.country;
        this.addressInfo.city = value.city;
      }
    }
  },
  methods: {
    onClosedDialog() {
      this.$nextTick(() => {
        this.$refs.addressForm.resetFields();
      });
    },
    onChangeCountry(v) {
      this.addressInfo.address = [];
      if (v === 'CN') {
        this.visibleOtherCountry = false;
      } else {
        this.visibleOtherCountry = true;
      }
    },
    // 提交修改信息
    infoSubmit() {
      if (this.loading) return;
      this.loading = true;
      // 提交的表单信息处理
      /* eslint-disable */
      this.formInfo.fullname = this.addressInfo.full_name;
      this.formInfo.phone = this.addressInfo.phone;
      this.formInfo.address = this.addressInfo.addressDetail;
      this.formInfo.door_no = this.addressInfo.door_no;
      this.formInfo.street = this.addressInfo.street;
      this.formInfo.country = this.addressInfo.country;
      if (this.addressInfo.country === 'CN') {
        this.formInfo.province = this.addressInfo.address[0];
        this.formInfo.city = this.addressInfo.address[1];
        this.formInfo.district = this.addressInfo.address[2];
      } else {
        this.formInfo.province = this.addressInfo.city;
        this.formInfo.city = this.addressInfo.city;
        this.formInfo.district = this.addressInfo.city;
      }
      this.$refs.addressForm.validate(async validate => {
        if (validate) {
          let active_item = this.active_tab_item; // 活动标签
          let id = this.row_data.id; // 用于编辑
          this.formInfo.warehouse_id = this.warehouseId;
          // 如果 id 存在, 则为编辑信息，否则是添加信息
          if (id) {
            let res;
            if (this.active_tab_item === '发件人信息') {
              res = await $http.editSenderAddress(id, this.formInfo);
            } else if (this.active_tab_item === '收件人信息') {
              res = await $http.editReceiverAddress(id, this.formInfo);
            }
            if (res.status) return;
            this.$message({
              message: this.$t('success'),
              type: 'success'
            });
            this.$emit('update:visible', false); // 关闭弹窗
            this.$emit('updata_data', active_item); // 更新数据列表
          } else {
            let res;
            try {
              if (this.active_tab_item === '发件人信息') {
                res = await $http.addSenderAddress(this.formInfo);
              } else if (this.active_tab_item === '收件人信息') {
                res = await $http.addReceiverAddress(this.formInfo);
              }
            } catch (error) {
              this.loading = false;
            }
            if (res.status) return;
            this.$message({
              message: this.$t('success'),
              type: 'success'
            });
            this.loading = false;
            this.$emit('update:visible', false); // 关闭弹窗
            this.$emit('updata_data_list', active_item); // 更新数据列表
          }
        }
      });
    }
  }
};
</script>

<style lang="less" module>
.add_warehouse_main {
  width: 96%;
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
