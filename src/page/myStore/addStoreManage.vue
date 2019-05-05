<template>
  <mdoel-form>
    <el-form slot="left"
    ref="WarehouseReference"
    :model="form"
    label-width="120px"
    :rules="formValidator">
      <label class="label"> {{$t('Essentialformrmation')}} </label>
      <el-form-item :label="$t('WarehouseCnName')" prop="name_cn">
        <el-input v-model="form.name_cn" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('WarehouseEnName')" prop="name_en">
        <el-input v-model="form.name_en" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('WarehouseNumber')" prop="code">
        <el-input  :disabled="!!$route.query.id" v-model="form.code" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('WarehouseType')" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :disabled="!!form.is_used"  :label="2">
            {{$t('SelfUseWarehouse')}}
          </el-radio>
          <el-radio :disabled="!!form.is_used"  :label="1">
            {{$t('PublicWarehouse')}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item :label="$t('StorageTemperature')" prop="temperature">
        <el-radio-group v-model="form.temperature">
          <el-radio
          :disabled="!!form.is_used"
          v-for="(item, index) in temperatures"
          :label="+index" :key="index">
            {{item}}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item :label="$t('WarehouseArea')"  prop="area">
        <el-input v-model="form.area" size="small">
          <span slot="suffix">㎡</span>
        </el-input>
      </el-form-item>
      <label class="label"> {{$t('Contactformrmation')}} </label>
      <el-form-item :label="$t('Countrys')" prop="country">
        <el-select v-model="form.country" @change="getCityStreet" size="small">
          <el-option label="NL-荷兰" value="NL"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('PostalCode')" prop="postcode">
        <el-input v-model="form.postcode" @change.native="getCityStreet" size="small"></el-input>
        <div v-show="helanStateTips" class="el-form-item__error">
          请输入正确的邮编或门牌号
        </div>
      </el-form-item>
      <el-form-item :label="$t('DoorNumber')" prop="door_no">
        <el-input v-model="form.door_no" @change.native="getCityStreet" size="small"></el-input>
        <div v-show="helanStateTips" class="el-form-item__error">
          请输入正确的邮编或门牌号
        </div>
      </el-form-item>
      <el-form-item :label="$t('City')" prop="city">
        <el-input v-model="form.city"
                  v-bind:class="[helanState? 'disColor':'']"
                  :disabled="helanState"
                  size="small">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('Street')" prop="street">
        <el-input v-model="form.street"
                  v-bind:class="[helanState? 'disColor':'']"
                  :disabled="helanState"
                  size="small">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('Contacts')" prop="contact_user">
        <el-input v-model="form.contact_user" size="small"></el-input>
      </el-form-item>
        <el-form-item :label="$t('TelephoneTimeZone')" prop="phone_codes">
          <el-select clearable v-model="form.phone_codes" @input="changeValue" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PhoneNumber')" prop="phone">
          <el-input v-model="form.phone" size="small"></el-input>
        </el-form-item>
      <el-form-item :label="$t('ContactEmail')" prop="contact_email">
        <el-input v-model="form.contact_email" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('IsItOpen')">
        <el-switch
        v-model="status"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
        :loading="$store.state.config.button_loading"
        @click="onSubmit">
        {{$t('Change')}}{{$route.query.id ? $t('edit') : $t('create')}}
        </el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>

    <div slot="right">
      <label class="label"> {{$t('WarehouseLOGO')}}({{$t('Optional')}}) </label>
      <picture-upload :photo.sync="form.logo_photo"></picture-upload>
    </div>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import PictureUpload from '@/components/picture_upload';
import { English, noChinese, Chinese, code, area } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
    PictureUpload,
  },
  data() {
    return {
      form: {
        name_cn: '', // 仓库中文
        name_en: '', // 仓库外文
        // owner_id: '', // 创建者用户ID
        type: 1, // 仓库类型
        code: '', // 仓库代码
        country: '', // 国家
        city: '', // 城市
        street: '', // 街道
        postcode: '', // 邮政编码
        status: false, // 状态
        area: '', // 仓库面积
        contact_user: '', // 联系人
        phone_codes: '', // 电话时区
        phone: '', // 电话
        contact_number: '', // 联系电话
        contact_email: '', // 联系邮箱
        logo_photo: '', // logo图片
        door_no: '',
        is_used: 0,
      },
      helanState: true,
      helanStateTips: false,
      options: [{
        value: '0031',
        label: '荷兰(0031)',
      }, {
        value: '0032',
        label: '比利时(0032)',
      }, {
        value: '0049',
        label: '德国(0049)',
      }],
      status: false,
    };
  },
  mixins: [mixin],
  created() {
    if (!this.$route.query.id) return;
    this.getInfo();
  },
  name: 'addStoreManage',
  computed: {
    formValidator() {
      const validatorEnglish = (rule, value, callback) => {
        if (!English(value) || !noChinese(value)) {
          return callback(Error(this.$t('PleaseEnterCompanyNameInEhineses')));
        }
        return callback();
      };
      const validatorChinese = (rule, value, callback) => {
        if (!Chinese(value)) {
          return callback(Error('中文名称必须包含中文'));
        }
        return callback();
      };
      const validatorCode = (rule, value, callback) => {
        if (!code(value) || !noChinese(value)) {
          return callback(Error(this.$t('PleaseEnterTheWarehouseNumbers')));
        }
        return callback();
      };
      const validatorArea = (rule, value, callback) => {
        if (!area(value)) {
          return callback(Error(this.$t('PleaseEnterTheWarehouseAreas')));
        }
        return callback();
      };
      const validatorNoChinese = (rule, value, callback) => {
        if (!noChinese(value)) {
          return callback(Error(this.$t('InputValueExludingCN')));
        }
        return callback();
      };
      const validatorPhone = (rule, value, callback) => {
        if (this.form.phone_codes === '0049' && !/^\d{10}$/.test(value)) {
          return callback(Error(this.$t('PleaseEnterPhone10')));
        } else if (this.form.phone_codes !== '0049' && !/^\d{9}$/.test(value)) {
          return callback(Error(this.$t('PleaseEnterPhone9')));
        }
        return callback();
      };
      return {
        name_cn: [
          { required: true, message: this.$t('PleaseEnterTheChineseName'), trigger: 'blur' },
          { max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorChinese, trigger: 'blur' },
        ], // 仓库中文
        name_en: [
          { required: true, message: this.$t('PleaseEnterTheenName'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorEnglish, trigger: 'blur' },
        ], // 仓库外文
        code: [
          { required: true, message: this.$t('PleaseEnterTheWarehouseNumber'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorCode, trigger: 'blur' },
        ], // 仓库代码
        country: [
          { required: true, message: this.$t('PleaseEnterTimeCountry'), trigger: 'change' },
        ], // 国家
        door_no: [
          { required: true, message: this.$t('PleaseEnterTimeDoorNumber'), trigger: 'blur' },
        ], // 门牌号
        city: [
          { required: true, message: this.$t('PleaseEnterTimeDoorCity'), trigger: 'change' },
        ], // 城市
        street: [
          { required: true, message: this.$t('PleaseEnterTimeStreet'), trigger: 'change' },
        ], // 街道
        postcode: [
          { required: true, message: this.$t('PleaseEnterTimePostalCode'), trigger: 'blur' },
          { validator: validatorNoChinese, trigger: 'blur' },
          { pattern: /^[0-9]{4}\s*[a-zA-Z]{2}$/, message: this.$t('NLPostCodeFormat'), trigger: 'blur' },
        ], // 邮编
        area: [
          { required: true, message: this.$t('PleaseEnterTheWarehouseArea'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          // { type: 'float', message: this.$t('PleaseEnterTheWarehouseAreas'), trigger: 'blur' },
          { validator: validatorArea, trigger: 'blur' },
        ], // 仓库面积
        type: [
          { required: true, message: this.$t('PleaseEnterTheWarehouseArea'), trigger: 'blur' },
        ], // 仓库类型
        contact_user: [
          { required: true, message: this.$t('PleaseEnterTheContacts'), trigger: 'blur' },
          { pattern: /\D+/, message: this.$t('PleaseNotEnterAllNumber'), trigger: 'blur' },
        ], // 联系人
        phone_codes: [
          { required: true, message: this.$t('PleaseSelecTimeZone'), trigger: 'change' },
        ], // 电话时区
        phone: [
          { required: true, message: this.$t('PleaseEnterPhone'), trigger: 'blur' },
          { validator: validatorPhone, trigger: 'blur' },
        ], // 电话
        contact_email: [
          { required: true, message: this.$t('PleaseEnterTheContactEmail'), trigger: 'blur' },
          { type: 'email', message: this.$t('PleaseEnterTheContactEmails'), trigger: 'blur' },
        ], // 联系邮箱
      };
    },
  },
  methods: {
    changeValue(e) {
      this.form.phone_codes = e;
    },
    // 提交创建信息
    onSubmit() {
      this.form.status = +this.status;
      this.form.contact_number = this.form.phone_codes + this.form.phone;
      this.$refs.WarehouseReference.validate((val) => {
        if (!val) return;
        $http.warehousePut(this.form, this.$route.query.id).then((res) => {
          if (res.status === 0) {
            this.successTips(this.$route.query.id);
          }
        });
      });
    },
    getCityStreet() {
      console.log(1);
      const self = this;
      self.form.street = '';
      self.form.city = '';
      self.form.postcode = self.form.postcode.split(' ').join('').toUpperCase();
      if (self.form.country === 'NL' && !!self.form.postcode && !!self.form.door_no) {
        $http.getCityStreet({
          door_no: self.form.door_no,
          postcode: self.form.postcode,
        }).then((res) => {
          console.log(res.status);
          if (res.status === 0) {
            self.form.street = res.data.street;
            self.form.city = res.data.city;
            self.helanStateTips = false;
          } else if (res.status !== 0) {
            self.street = '';
            self.city = '';
            self.helanStateTips = true;
          }
        });
      } else {
        self.helanStateTips = false;
      }
    },
    // // 拉取温度列表
    // getTemperaturesList() {
    //   $http.temperatures().then((res) => {
    //     this.temperatures = res.data;
    //   });
    // },
    // 获取仓库单条信息
    getInfo() {
      $http.WarehouseInfo(this.$route.query.id).then((res) => {
        this.status = !!res.data.status;
        res.data.warehouse_id = res.data.id;
        this.form = res.data;
        // this.form.phone_codes = res.data.contact_number.slice(0, 4);
        this.$set(this.form, 'phone_codes', res.data.contact_number.slice(0, 4));
        this.form.phone = res.data.contact_number.slice(4);
        // this.form.door_no = (res.data.door_no === null ? '' : res.data.door_no);
        // this.form.postcode = (res.data.postcode === null ? '' : res.data.postcode);
      });
    },
  },
  // watch: {
  //   form: {
  //     handler(curVal) {
  //       const self = this;
  //       self.street = '';
  //       self.city = '';
  //       self.form.postcode = self.form.postcode.split(' ').join('').toUpperCase();
  //       if (curVal.country === 'NL' && curVal.postcode !== '' && curVal.door_no !== '') {
  //         $http.getCityStreet({
  //           door_no: self.form.door_no,
  //           postcode: self.form.postcode,
  //         }).then((res) => {
  //           if (res.status === 0) {
  //             self.form.street = res.data.street;
  //             self.form.city = res.data.city;
  //             self.helanStateTips = false;
  //           } else if (res.status !== 0) {
  //             self.street = '';
  //             self.city = '';
  //             self.helanStateTips = true;
  //           }
  //         });
  //       } else {
  //         self.helanStateTips = false;
  //       }
  //     },
  //     deep: true,
  //   },
  // },
};
</script>

<style lang="less" module>
  .label {
    font-size: 18px;
  }
  .avatar_uploader {
    margin-top: 10px;
  }
  .address_msg{
  text-align:center;
  color:red;
  margin-bottom:20px;
}
.disColor{
  background-color: #DEEED4;
}
</style>
