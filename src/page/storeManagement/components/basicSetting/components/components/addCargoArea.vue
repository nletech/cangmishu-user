<template>
  <mdoel-form>
    <el-form
      slot="left"
      :model="form"
      ref="CargoAreaReference"
      label-width="120px"
      :rules="formValidator"
    >
      <label class="label">{{ $t('EssentialInformation') }}</label>
      <el-form-item prop="code" :label="$t('ShippingAreaNumber')" :class="$style.avatar_uploader">
        <el-input v-model="form.code" maxlength="255" size="small"> </el-input>
      </el-form-item>
      <el-form-item prop="name_cn" :label="$t('ShippingAreaName')">
        <el-input v-model="form.name_cn" maxlength="255" size="small"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-switch v-model="is_enabled" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <label class="label">{{ $t('OptionalInformation') }}</label>
      <el-form-item :label="$t('remark')">
        <el-input v-model="form.remark" type="textarea" size="small" :rows="3"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isButtonLoading">
          {{ $t('submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  components: {
    MdoelForm
  },
  data() {
    return {
      form: {
        code: '', // 货区编号
        name_cn: '', // 货区名称
        warehouse_feature_id: '', // 仓库特性
        is_enabled: 0, // 启用状态
        remark: '', // 备注
        name_en: '', // 外文名称
        warehouse_id: this.$route.query.warehouse_id // 所属货区id
      },
      is_enabled: true
    };
  },
  computed: {
    formValidator() {
      return {
        name_cn: [
          {
            required: true,
            message: this.$t('pleaseEnterShippingAreaName'),
            trigger: 'blur'
          }
        ], // 货区中文
        code: [
          {
            required: true,
            message: this.$t('pleaseEnterShippingAreaNumber'),
            trigger: 'blur'
          }
        ] // 货区代码
      };
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (!this.$route.params.areaId) return;
      $http.getInfoWarehouseArea(this.$route.query.warehouse_id).then(res => {
        this.is_enabled = !!res.data.is_enabled;
        this.form = res.data;
      });
    },
    onSubmit() {
      this.$refs.CargoAreaReference.validate(valid => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        this.form.warehouse_id = this.$route.query.warehouse_id;
        $http.addWarehouseArea(this.form, this.$route.query.warehouse_id).then(res => {
          if (res.status) return;
          this.$message({
            message: this.$t('success'),
            type: 'success',
            showClose: true
          });
          this.$router.push({
            name: 'areaAndShelf',
            params: { backType: 'area' },
            query: {
              warehouse_id: this.form.warehouse_id
            }
          });
        });
      });
    }
  }
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
