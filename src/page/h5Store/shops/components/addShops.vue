<template>
  <el-dialog
      :title="isEdit ? $t('edit') : $t('add')"
      width="90%"
      @update:visible="$emit('update:visible', $event)"
      :visible="visible">
      <el-row>
          <el-col :span="12" :offset="6">
              <el-form label-width="100px">
                <label
                  style="font-size: 16px;
                  position: relative;
                  font-weight: bold;
                  display: inline-block;
                  margin: 0 0 20px 0">
                  {{$t('shopInformation')}}
                </label>
                <el-form-item :label="$t('shopName')">
                    <el-input
                        v-model="shop_form.name_cn"
                        :maxlength="50"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item :label="$t('shopIntroduction')">
                    <el-input
                        v-model="shop_form.remark"
                        type="textarea"
                        :maxlength="500"
                        show-word-limit>
                    </el-input>
                </el-form-item>
                <label
                  style="font-size: 16px;
                  position: relative;
                  display: inline-block;
                  font-weight: bold;
                  margin: 0 0 20px 0">
                  {{$t('Contactformrmation')}}
                </label>
                <el-form-item :label="$t('shopOwner')">
                    <el-input
                        v-model="shop_form.contact.fullname"
                        :maxlength="10"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item :label="$t('Contactformrmation')">
                    <el-input
                        v-model="shop_form.contact.phone"
                        :maxlength="20"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item
                    prop="address"
                    label="省市区"
                    size="middle">
                    <el-cascader
                        style="width:100%;"
                        :props="props"
                        :options="addressInfo"
                        v-model="shop_form.contact.pre_address">
                    </el-cascader>
                </el-form-item>
                <el-form-item
                    prop="addressDetail"
                    :label="$t('addressDetial')"
                    maxlength="30"
                    size="middle">
                    <el-input
                        type="textarea"
                        :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
                        v-model="shop_form.contact.address">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('Currency')">
                    <el-radio-group @change="handlerRadioChnange" v-model="shop_form.default_currency">
                        <el-radio :label="'CNY'">{{$t('CNY')}}</el-radio>
                        <el-radio :label="'EUR'">{{$t('EUR')}}</el-radio>
                        <el-radio :label="'USD'">{{$t('USD')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <label
                  style="font-size: 16px;
                  position: relative;
                  display: inline-block;
                  font-weight: bold;
                  margin: 0 0 20px 0">
                  {{$t('notNecessaryInfo')}}
                </label>
                <el-form-item>
                    <my-upload
                      :width="180"
                      :height="180"
                      :img.sync="shop_form.logo"
                      @uploadSuccessCallBack="handlerUploadSuccessCallBack">
                      <template slot="btnTitle">{{$t('shopLogoUpload')}}</template>
                    </my-upload>
                </el-form-item>
                <el-form-item>
                  <el-row>
                      <el-col :span="2" :offset="10">
                          <el-button
                              :loading="isButtonLoading()"
                              type="primary"
                              @click.native="onSubmit">
                              {{$t('submit')}}
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
import baseApi from '@/lib/axios/base_api';
import $http from '@/api/index';
import Address from '@/assets/address.json';
import mixin from '@/mixin/form_config';
import pictureUpload from '@/components/picture_upload';
import myUpload from '@/components/imageUpload/index';

export default {
  name: 'addShops',
  mixins: [mixin],
  components: {
    pictureUpload,
    myUpload,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    }, // 弹窗显示
    row_data: {
      type: Object,
      default() {
        return {};
      },
    }, // 数据
    status: {
      type: Number,
      default: 1,
    }, // '添加': 1, '编辑': 2
  },
  data() {
    return {
      showCutter: true,
      url: '',
      myCroppa: {},
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children',
      },
      addressInfo: Address, // 选择地址联动
      shops: [],
      shop_form: {
        name_cn: '', // 店铺名称
        remark: '', // 店铺简介
        logo: '', // logo
        contact: {
          fullname: '', // 店主名称
          phone: '', // 电话
          pre_address: '', // 省市区
          address: '', // 详细地址
        },
        default_currency: 'CNY', // 默认货币形式
      },
    };
  },
  computed: {
    isEdit() {
      return this.status === 2;
    },
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi}/upload/image`;
    },
  },
  watch: {
    visible() {
      if (this.isEdit) { // 编辑操作
        this.editInit(this.row_data);
      } else {
        this.shop_form.default_currency = 'CNY';
      }
      if (!this.visible) {
        const InitObject = {
          name_cn: '', // 店铺名称
          remark: '', // 店铺简介
          logo: '', // 店铺 logo
          contact: {
            fullname: '', // 店主名称
            phone: '', // 电话
            pre_address: '', // 省市区
            address: '', // 详细地址
          },
          default_currency: 'CNY', // 默认货币形式
        };
        this.shop_form = InitObject;
      } // 关闭弹窗初始化表单
    },
  },
  methods: {
    handlerUploadSuccessCallBack(res) {
      this.shop_form.log = res.data.url;
    },
    handlerRadioChnange(val) {
      this.shop_form.default_currency = val;
    },
    handlerLogoUpload(response) {
      this.shop_form.log = response.data.url;
    },
    onSubmit() {
      if (!this.isEdit) {
        this.addShop();
      } else {
        this.editShop(this.row_data.id);
      }
    },
    addShop() {
      this.shop_form.contact.country = 'China';
      this.shop_form.contact.province = this.shop_form.contact.pre_address[0];
      this.shop_form.contact.city = this.shop_form.contact.pre_address[1];
      this.shop_form.contact.district = this.shop_form.contact.pre_address[2];
      $http.addNewShop({ warehouse_id: this.warehouseId, ...this.shop_form })
        .then((res) => {
          if (res.status) return;
          this.successTips(0, false); // 提示路框
          this.$emit('update:visible', false); // 关闭弹窗
          this.$emit('finishCallback', true); // 操作完成回调
        });
    },
    editShop(shopId) {
      this.shop_form.contact.country = 'China';
      this.shop_form.contact.province = this.shop_form.contact.pre_address[0];
      this.shop_form.contact.city = this.shop_form.contact.pre_address[1];
      this.shop_form.contact.district = this.shop_form.contact.pre_address[2];
      $http.editShop(shopId, { warehouse_id: this.warehouseId, ...this.shop_form })
        .then((res) => {
          if (res.status) return;
          this.successTips(1, false); // 提示路框
          this.$emit('update:visible', false); // 关闭弹窗
          this.$emit('finishCallback', true); // 操作完成回调
        });
    },
    editInit(rowData) {
      this.shop_form.name_cn = rowData.name;
      this.shop_form.remark = rowData.remark;
      this.shop_form.logo = rowData.logo;
      this.shop_form.default_currency = rowData.default_currency;
      this.shop_form.contact.fullname = rowData.sender_address.fullname;
      this.shop_form.contact.phone = rowData.sender_address.phone;
      this.shop_form.contact.address = rowData.sender_address.address;
      this.shop_form.contact.pre_address = [`${rowData.sender_address.province}`, `${rowData.sender_address.city}`, `${rowData.sender_address.district}`];
    },
  },
};
</script>
