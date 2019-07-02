<template>
<div class="goods_edit">
  <mdoel-form>
      <el-form slot="left"
               :rules="formValidate"
               ref="address"
               :model="form" label-width="120px">
        <el-form-item label="姓名">
          <el-input v-model="form.fullname" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('TelephoneTimeZone')" prop="phone_area_code">
          <el-select size="small" style="width: 100%" v-model="form.phone_area_code">
            <el-option value="0031" label="荷兰(0031)"></el-option>
            <el-option value="0049" label="德国(0049)"></el-option>
            <el-option value="0032" label="比利时(0032)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PhoneNumber')" prop="phone">
          <el-input v-model="form.phone" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Country')" prop="country">
          <el-select size="small"
                     style="width: 100%"
                     v-model="form.country"
                     @change="getCityStreet">
            <el-option value="nl" label="荷兰"></el-option>
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
        <el-form-item :label="$t('Street')" prop="address">
          <el-input v-model="form.address"
                    v-bind:class="[helanState? 'disColor':'']"
                    :disabled="helanState"
                    size="small">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('ContactEmail')" prop="email">
          <el-input v-model="form.email" size="small"></el-input>
        </el-form-item>
        <el-form-item label="公司">
          <el-input v-model="form.company" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-switch
          v-model="form.is_default"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button
          type="primary"
          :loading="$store.state.config.button_loading"
          @click="addAddress">提交</el-button>
          <cancel-button></cancel-button>
        </el-form-item>
      </el-form>
    </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import { noChinese } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        is_default: 0,
        phone_area_code: '',
        country: '',
        province: '',
        city: '',
        address: '',
        postcode: '',
        fullname: '',
        phone: '',
        email: '',
        door_no: '',
        company: '',
        remark: '',
      },
      helanState: true,
      helanStateTips: false,
      warehouseList: [],
    };
  },
  computed: {
    formValidate() {
      const validatorNoChinese = (rule, value, callback) => {
        if (!noChinese(value)) {
          return callback(Error(this.$t('InputValueExludingCN')));
        }
        return callback();
      };
      const validatorPhone = (rule, value, callback) => {
        if (this.form.phone_area_code === '0049' && !/^\d{10}$/.test(value)) {
          return callback(Error(this.$t('PleaseEnterPhone10')));
        } else if (this.form.phone_area_code !== '0049' && !/^\d{9}$/.test(value)) {
          return callback(Error(this.$t('PleaseEnterPhone9')));
        }
        return callback();
      };
      return {
        phone_area_code: [
          { required: true, message: this.$t('PleaseSelecTimeZone'), trigger: 'change' },
        ], // 电话时区
        phone: [
          { required: true, message: this.$t('PleaseEnterPhone'), trigger: 'blur' },
          { validator: validatorPhone, trigger: 'blur' },
        ], // 电话
        country: [
          { required: true, message: this.$t('PleaseEnterTimeCountry'), trigger: 'change' },
        ], // 国家
        postcode: [
          { required: true, message: this.$t('PleaseEnterTimePostalCode'), trigger: 'blur' },
          { validator: validatorNoChinese, trigger: 'blur' },
          { pattern: /^[0-9]{4}\s*[a-zA-Z]{2}$/, message: this.$t('NLPostCodeFormat'), trigger: 'blur' },
        ], // 邮编
        door_no: [
          { required: true, message: this.$t('PleaseEnterTimeDoorNumber'), trigger: 'blur' },
          { validator: validatorNoChinese, trigger: 'blur' },
        ], // 门牌号
        city: [
          { required: true, message: this.$t('PleaseEnterTimeDoorCity'), trigger: 'change' },
          // { validator: validatorNoChinese, trigger: 'blur' },
        ], // 城市
        address: [
          { required: true, message: this.$t('PleaseEnterTimeStreet'), trigger: 'change' },
          // { validator: validatorNoChinese, trigger: 'blur' },
        ], // 街道
        email: [
          { required: true, message: this.$t('PleaseEnterTheContactEmail'), trigger: 'blur' },
          { type: 'email', message: this.$t('PleaseEnterTheContactEmails'), trigger: 'blur' },
        ], // 联系邮箱
      };
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    addAddress() {
      if (this.$route.query.id) {
        this.editAddress();
        return;
      }
      this.$refs.address.validate((valid) => {
        if (!valid) return;
        $http.addAddress(this.form, this.$route.name).then(() => {
          this.successTips(this.$route.query.id);
        });
      });
    },
    getCityStreet() {
      const self = this;
      self.form.address = '';
      self.form.city = '';
      self.form.postcode = self.form.postcode.split(' ').join('').toUpperCase();
      if (self.form.country === 'nl' && !!self.form.postcode && !!self.form.door_no) {
        $http.getCityStreet({
          door_no: self.form.door_no,
          postcode: self.form.postcode,
        }).then((res) => {
          if (res.status === 0) {
            self.form.address = res.data.street;
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
    getInfo() {
      if (!this.$route.query.id) return;
      $http.senderInfo(this.$route.query.id, this.$route.name).then((res) => {
        this.form = res.data;
      });
    },
    editAddress() {
      this.$refs.address.validate((valid) => {
        if (!valid) return;
        $http.editAddress(this.form, this.$route.name).then(() => {
          this.successTips(this.$route.query.id);
        });
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.label {
  font-size: 18px;
}
.disColor{
  background-color: #DEEED4;
}
</style>
