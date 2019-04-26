<template>
  <div class="lease-audit">
    <mdoel-form>
      <el-form slot="left" label-width="150px" :rules="formValidator" :model="form" ref="form">
        <label class="label"> {{$t('LeasingReview')}} </label>
        <el-form-item :label="$t('ApplyForAuserAccount')">
          {{form.user_account}}
        </el-form-item>
        <el-form-item :label="$t('NeedtoOpenwarehouse')">
          {{$route.query.name}}
        </el-form-item>
        <el-form-item :label="$t('NameOfApplicant')">
          <el-input v-model="form.application_name" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Applicantphone')">
          <el-radio-group v-model="form.type">
          <el-input v-model="form.application_phone" size="small"></el-input>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('ApplyForEmail')">
          <el-input v-model="form.application_email" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Expectedweeklydelivery')">
          <el-input-number v-model="form.weekly_shipments" size="small" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('Expectedweeklyshippingweight')">
          <el-input-number v-model="form.weekly_weight" size="small" :min="1"></el-input-number>
        </el-form-item>
        <label class="label"> {{$t('ProductInformation')}} </label>
        <el-form-item :label="$t('StorageItems')">
          <el-input v-model="form.goods_name" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Salesdestinationcountry')">
          <el-input v-model="form.sell_country" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('methodSales')">
          <el-input v-model="form.sales_mode" size="small"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button v-if="!$route.query.type" type="primary"
          :loading="$store.state.config.button_loading"
          @click="onSubmit">
          {{$t('ConfirmLease')}}
          </el-button>
          <cancel-button></cancel-button>
        </el-form-item>
      </el-form>

      <!-- <div slot="right">
        <label class="label"> {{$t('WarehouseLOGO')}}</label>
      </div> -->
    </mdoel-form>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="() => false"
      width="40%"
      top="24vh">
      <p :class="$style.dialog_text">{{$t('Successful')}}
        <br/><br/>{{$t('RentYoucan')}}
        <router-link :to="{ name: 'MayApplyStore' }">
          {{$t('Mzeasing')}}
          </router-link>
          {{$t('FocusOnReviewDynamics')}}
          <br/><br/>
          <el-button type="success" @click="$router.push({
            name: 'MayApplyStore',
          })">{{$t('confirm')}}</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  components: {
    MdoelForm,
  },
  data() {
    return {
      form: {
        user_account: '', // 仓库产权方邮箱
        warehouse_name: this.$route.query.name,
        warehouse_id: this.$route.query.id, // 仓库ID
        application_name: '', // 仓库租赁方姓名
        application_phone: '', // 仓库租赁方电话
        application_email: '', // 仓库租赁方电话
        weekly_shipments: '', // 预计每周发货量
        weekly_weight: '', // 预计每周发货重量
        sell_country: '', // 销售目的国
        sales_mode: '', // 销售方式
      },
      status: false,
      dialogVisible: true,
    };
  },
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  name: 'addStoreManage',
  computed: {
    formValidator() {
      return {
        application_email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ], // 仓库产权方邮箱
        application_name: [
          { required: true, message: '请输入仓库租赁方姓名', trigger: 'blur' },
        ], // 仓库租赁方姓名
        application_phone: [
          { required: true, message: '请输入仓库租赁方姓名', trigger: 'blur' },
        ], // 仓库租赁方电话
      };
    },
  },
  methods: {
    // 提交创建信息
    onSubmit() {
      this.$refs.form.validate((val) => {
        if (!val) return;
        $http.renters(this.form).then((res) => {
          if (res.status === 0) {
            this.dialogVisible = true;
          }
        });
      });
      // $http.renters(this.form).then(() => {
      //   this.dialogVisible = true;
      // });
    },
    // 获取仓库单条信息
    getInfo() {
      this.dialogVisible = false;
      $http.account().then((res) => {
        this.form.user_account = res.data.email;
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
  .avatar_uploader {
    margin-top: 10px;
  }
  .dialog_text {
    text-align: center;
    font-size: 20px;
    a {
      text-decoration: none;
      color: @red;
    }
  }
</style>
<style lang="less">
  .lease-audit {
    .el-dialog__header {
      display: none;
    }
  }
</style>
