<template>
  <div :class="$style.authentication_form">
    <mdoel-form>
      <el-form
      :rules="formValidate"
      ref="authentication"
      :model="form"
      slot="left"
      label-width="120px">
        <label class="label"> {{$t('EssentialInformation')}} </label>
        <el-form-item  :label="$t('WarehouseCnName')" prop="warehouse_name_cn">
          <el-input v-model="form.warehouse_name_cn" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WarehouseEnName')" prop="warehouse_name_en">
          <el-input v-model="form.warehouse_name_en" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('StorehousePropertyRightParty')" prop="warehouse_property">
          <el-input v-model="form.warehouse_property"
                    :placeholder="$t('StorehousePropertyRightPartyTip')"
                    size="small">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('TelephoneTimeZone')" prop="phone_codes">
          <el-select clearable v-model="form.phone_codes" size="small">
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
        <!-- <el-form-item :label="$t('uploadFile')">
          <file-upload @addFile='addFile'></file-upload>
          <span :class="$style.uploader_tips">*请上传合同扫描件，文件格式为pdf</span>
        </el-form-item> -->
        <label class="label"> {{$t('AddressInformation')}} </label>
        <el-form-item :label="$t('Country')" prop="country">
          <el-select clearable v-model="form.country" @change="getCityStreet" size="small">
            <el-option value="NL" label="NL-荷兰"></el-option>
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
        <el-form-item >
          <el-button :loading="$store.state.config.button_loading"
                     @click="save"
                     type="primary">
                     {{$t('CreateCertification')}}
          </el-button>
          <cancel-button></cancel-button>
        </el-form-item>
      </el-form>

      <div slot="right">
        <!-- <label class="label"> {{$t('WarehousePlan')}} </label>
        <el-upload
          :class="$style.avatar_uploader"
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </div>
    </mdoel-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="() => false"
      width="40%"
      top="24vh">
      <h1>{{$t('authenticationRequest')}}</h1>
      <div :class="$style.dialog_text">
        <p>
          {{$t('Your')}}
          <span :class="$style.red_text">
          {{$t('CreateAwarehouse')}}</span>
          {{$t('authenticationRequest')}}
          {{$t('reviewandwellBeRight')}}
        </p>
        <p>
          在审核过程中如有任何疑问，我们的工作人员将会致电您的联系人，请保持联系电话畅通。
        </p>
        <p>
          审核通过后，您的注册邮箱会及时收到确认信。
        </p>
        <p>
          您还可以登录系统，在“我的认证”页面随时查看审核动态。
        </p>
        <p>
          如有疑问，欢迎致电：+31(0)886681291
        </p>
      </div>
      <div :class="$style.success">
        <el-button type="success" @click="$router.push({
          name: 'home',
        })">{{$t('confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $http from '@/api';
import MdoelForm from '@/components/form';
import { English, noChinese } from '@/lib/validateForm';
import CancelButton from '@/components/cancel_button';
import FileUpload from '@/components/pdf_upload';

export default {
  data() {
    return {
      form: {
        warehouse_name_cn: '', // 仓库中文名
        warehouse_name_en: '', // 仓库外文名
        warehouse_property: '', // 仓库产权方
        phone_codes: '', // 电话时区
        phone: '', // 电话
        country: '', // 国家
        postcode: '', // 邮编
        door_no: '', // 门牌号
        city: '', // 城市
        street: '', // 街道
        warehouse_plan: '', // logo
        contract: [],
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
      dialogVisible: false,
    };
  },
  components: {
    MdoelForm,
    CancelButton,
    FileUpload,
  },
  computed: {
    formValidate() {
      const validatorEnglish = (rule, value, callback) => {
        if (!English(value)) {
          return callback(Error(this.$t('PleaseEnterTheenNames')));
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
        warehouse_name_cn: [
          { required: true, message: this.$t('PleaseEnterTheChineseName'), trigger: 'blur' },
          { max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
        ], // 仓库中文名
        warehouse_name_en: [
          { required: true, message: this.$t('PleaseEnterTheenName'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorEnglish, trigger: 'blur' },
          { validator: validatorNoChinese, trigger: 'blur' },
        ], // 仓库外文名
        warehouse_property: [
          { required: true, message: this.$t('PleaseEnterTheWarehouseProperty'), trigger: 'blur' },
          { max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
        ], // 仓库产权方
        phone_codes: [
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
        ], // 城市
        street: [
          { required: true, message: this.$t('PleaseEnterTimeStreet'), trigger: 'change' },
        ], // 街道
      };
    },
  },
  methods: {
    save() {
      this.$refs.authentication.validate((valid) => {
        if (!valid) return;
        $http.apply(this.form).then(() => {
          this.dialogVisible = true;
          this.$store.dispatch('token/getVipInfo');
        });
      });
    },
    addFile(val) {
      const obj = {};
      obj.pdf_name = val.pdfname;
      obj.pdf_url = val.url;
      this.form.contract.push(obj);
      console.log(this.form.contract);
    },
    getCityStreet() {
      const self = this;
      self.form.street = '';
      self.form.city = '';
      self.form.postcode = self.form.postcode.split(' ').join('').toUpperCase();
      if (self.form.country === 'NL' && !!self.form.postcode && !!self.form.door_no) {
        $http.getCityStreet({
          door_no: self.form.door_no,
          postcode: self.form.postcode,
        }).then((res) => {
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
  },
};
</script>

<style lang="less" module>
  @import '../../less/public_variable.less';
  .authentication_form {
    h1 {
      text-align: center;
    }
    .avatar_uploader {
      margin-top: 10px;
    }
    .dialog_text {
      width: 80%;
      margin: 0 auto;
      text-indent: 20px;
      border: 1px solid @textColor;
      padding: 20px;
      margin-top: 20px;
      .red_text {
        color: @red;
      }
      .green_text {
        color: #67c23a;
      }
      p {
        margin: 5px;
      }
    }
    .success {
      text-align: center;
      margin-top: 20px;
    }
  }
  .disColor{
  background-color: #DEEED4;
}
.uploader_tips {
  color: red;
}
</style>
