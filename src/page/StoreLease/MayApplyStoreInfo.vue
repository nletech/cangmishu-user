<template>
  <mdoel-form>
    <el-form slot="left" label-width="120px">
      <label class="label"> {{$t('EssentialInformation')}} </label>
      <el-form-item label="中文名称">
        {{form.name_cn}}
      </el-form-item>
      <el-form-item label="外文名称">
        {{form.name_en}}
      </el-form-item>
      <el-form-item label="仓库编号">
        {{form.code}}
      </el-form-item>
      <!-- <el-form-item label="仓库类型">
        <el-radio-group :value="form.type">
          <el-radio :label="2">
            自用仓库
          </el-radio>
          <el-radio :label="1">
            公共仓库
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="储存温度">
        {{form.temperature | temperatureType}}
      </el-form-item> -->
      <el-form-item label="仓库面积">
        {{form.area}}㎡
      </el-form-item>
      <label class="label"> 联系信息 </label>
      <el-form-item label="所属国家">
        {{form.country}}
      </el-form-item>
      <el-form-item label="邮编">
        {{form.postcode}}
      </el-form-item>
      <el-form-item label="门牌号">
        {{form.door_no}}
      </el-form-item>
      <el-form-item label="城市">
        {{form.city}}
      </el-form-item>
      <el-form-item label="街道">
        {{form.street}}
      </el-form-item>
      <el-form-item label="联系人">
        {{form.contact_user}}
      </el-form-item>
      <el-form-item label="联系电话">
        {{form.contact_number}}
      </el-form-item>
      <el-form-item label="联系邮箱">
        {{form.contact_email}}
      </el-form-item>
      <el-form-item v-if="this.$route.query.type" label="审核状态">
        {{ form.lease_status | statusType}}
      </el-form-item>
      <!-- <el-form-item label="是否开通">
        {{form.status | switchTypeCn}}
      </el-form-item> -->
      <el-form-item v-if="!$route.query.type">
        <el-button type="primary"
        :loading="$store.state.config.button_loading"
        @click="goLeaseAudit">
        租赁
        </el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>

    <div slot="right" v-if="form.logo_photo">
      <label class="label"> 仓库LOGO </label>
      <img :src=form.logo_photo alt="" width="178px" height="178px">
    </div>
  </mdoel-form>
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
      },
      status: false,
    };
  },
  computed: {
    // form() {
    //   return {},
    // },
  },
  mixins: [mixin],
  created() {
    if (!this.$route.query.id) return;
    this.getInfo();
  },
  name: 'addStoreManage',
  methods: {
    goLeaseAudit() {
      this.$router.push({
        name: 'LeaseAudit',
        query: {
          name: this.form.name_cn,
          id: this.form.id,
        },
      });
    },
    // 获取仓库单条信息
    getInfo() {
      if (this.$route.query.type) {
        $http.rentersShow(this.$route.query.id).then((res) => {
          this.form = res.data && res.data;
        });
        return;
      }
      $http.WarehouseInfo(this.$route.query.id).then((res) => {
        this.form = res.data;
      });
    },
  },
};
</script>

<style lang="less" module>
  .label {
    font-size: 18px;
  }
  .avatar_uploader {
    margin-top: 10px;
  }
</style>
