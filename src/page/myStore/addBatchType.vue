<template>
  <mdoel-form>
    <el-form slot="left"
    ref="BatchTypeReference"
    :model="form"
    :rules="formValidator"
    label-width="120px">
      <label class="label"> {{$t('EssentialInformation')}} </label>
      <el-form-item :label="$t('ReceiptCategoryName')" :class="$style.avatar_uploader" prop="name">
        <el-input v-model="form.name" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-switch v-model="is_enabled"></el-switch>
      </el-form-item>
      <label class="label"> {{$t('OptionalInformation')}} </label>
      <el-form-item :label="$t('DesignatedDeliveryArea')" :class="$style.avatar_uploader">
        <el-select v-model="form.area_id" size="small">
          <el-option
          v-for="item in area_list_data"
          :key="item.id" :value="item.id"
          :disabled="!item.is_enabled"
          :label="item.name_cn">
          </el-option>
        </el-select>
      </el-form-item><el-form-item>
        <el-button type="primary"
        :loading="$store.state.config.button_loading"
         @click="onSubmit">
          {{$route.query.batchTypeId ? $t('ModifyNow') : $t('CreateNow')}}
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

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin, mixins],
  data() {
    return {
      form: {
        name: '', // 名称
        warehouse_id: this.$route.query.id, // 仓库 ID
        area_id: 0, // 货区 ID
        is_enabled: '', // 容积
      },
      is_enabled: true,
      area_list_data: [],
      params: {
        type: '',
        warehouse_id: this.$route.query.id,
      },
    };
  },
  computed: {
    batchTypeId() {
      return this.$route.query.batchTypeId;
    },
    formValidator() {
      return {
        name: [
          { required: true, message: this.$t('PleaseEnterTheReceiptCategoryName'), trigger: 'blur' },
        ], // 货架编号
      };
    },
  },
  methods: {
    getList() {
      $http.warehouseArea(this.params).then((res) => {
        this.area_list_data = res.data.data;
        this.area_list_data.unshift({ id: 0, is_enabled: true, name_cn: '请选择' });
      });
    },
    onSubmit() {
      this.$refs.BatchTypeReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        if (this.batchTypeId) this.form.batch_type_id = this.batchTypeId;
        $http.addBatchType(this.form, this.batchTypeId).then(() => {
          this.successTips(this.batchTypeId);
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
