<template>
  <mdoel-form>
    <el-form slot="left"
    ref="KepReference"
    :model="form"
    :rules="formValidator"
    label-width="120px">
      <label class="label"> {{$t('EssentialInformation')}} </label>
      <el-form-item :label="$t('BasketNumber')" :class="$style.avatar_uploader" prop="code">
        <el-input v-model="form.code" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-switch v-model="is_enabled"></el-switch>
      </el-form-item>
      <label class="label"> {{$t('OptionalInformation')}} </label>
      <el-form-item :label="$t('Capacity')">
        <el-input v-model="form.capacity" size="small">
          <span slot="suffix">m³</span>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('ContainerWeight')">
        <el-input v-model="form.weight" size="small">
          <span slot="suffix">g</span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
        :loading="$store.state.config.button_loading"
         @click="onSubmit">
          {{$route.query.kepId ? $t('ModifyNow') : $t('CreateNow')}}
        </el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import mixin from '@/mixin/form_config';
import mixins from '@/mixin/list';
import $http from '@/api';
import { code } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin, mixins],
  data() {
    return {
      form: {
        code: '', // 托盘编号
        warehouse_id: this.$route.query.id, // 仓库 ID
        capacity: '', // 容积
        weight: '', // 重量
        is_enabled: 0, // 是否启用
      },
      is_enabled: true,
    };
  },
  computed: {
    kepId() {
      return this.$route.query.kepId;
    },
    formValidator() {
      const validatorCode = (rule, value, callback) => {
        if (!code(value)) {
          return callback(Error(this.$t('PleaseEnterTheWarehouseNumbers')));
        }
        return callback();
      };
      return {
        code: [
          { required: true, message: this.$t('PleaseEnterTheWarehouseNumberssss'), trigger: 'blur' },
          { validator: validatorCode, trigger: 'blur' },
        ], // 货架编号
      };
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (!this.kepId) return;
      $http.kepInfo(this.$route.query.kepId).then((res) => {
        this.is_enabled = !!res.data.is_enabled;
        this.form = res.data;
      });
    },
    onSubmit() {
      this.$refs.KepReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        if (this.kepId) this.form.kep_id = this.kepId;
        $http.addKep(this.form, this.kepId).then(() => {
          this.successTips(this.kepId);
        });
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
