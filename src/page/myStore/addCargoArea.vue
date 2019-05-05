<template>
  <mdoel-form>
    <el-form slot="left"
    ref="CargoAreaReference"
    :model="form"
    label-width="120px"
    :rules="formValidator">
      <label class="label"> {{$t('EssentialInformation')}} </label>
      <el-form-item :label="$t('ShippingAreaNumber')" :class="$style.avatar_uploader" prop="code">
        <el-input v-model="form.code" size="small"  :disabled="!!$route.query.areaId"></el-input>
      </el-form-item>
      <el-form-item :label="$t('ChineseNameOfTheGoodsArea')" prop="name_cn">
        <el-input v-model="form.name_cn" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('ShippingAreaEnglishName')" prop="name_en">
        <el-input v-model="form.name_en" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('cargoProperty')" prop="warehouse_feature_id">
        <el-radio-group v-model="form.warehouse_feature_id">
          <el-radio v-for="(item, index) in features" :label="item.id" :key="index">
            {{item.name_cn}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-tooltip :content="isOpenText" placement="top">
          <el-switch
          v-model="is_enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
      <label class="label"> {{$t('OptionalInformation')}}</label>
      <el-form-item :label="$t('FunctionalClassification')" :class="$style.avatar_uploader">
        <el-select
          v-model="form.functions"
          multiple
          filterable
          allow-create
          default-first-option
          :placeholder="$t('Pleaseselectthecargoareafunction')">
          <el-option
            v-for="item in functions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('remarks')">
        <el-input v-model="form.remark" type="textarea" size="small" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"
        :loading="$store.state.config.button_loading">
          {{$route.query.areaId ? $t('ModifyNow') : $t('CreateNow')}}
        </el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import { English, code, noChinese } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        code: '', // 货区编号
        name_cn: '', // 货区名称
        warehouse_feature_id: '', // 仓库特性
        is_enabled: 0, // 启用状态
        functions: [], // 功能分类
        remark: '', // 备注
        name_en: '', // 外文名称
        warehouse_id: this.$route.query.id, // 所属货区id
      },
      is_enabled: true,
      functions: [
        { label: '收货', value: '1' },
        { label: '拣货', value: '2' },
        { label: '备货', value: '3' },
        { label: '集货', value: '4' },
      ],
      features: {},
      params: {
        warehouse_id: this.$route.query.id,
      },
    };
  },
  computed: {
    isOpenText() {
      let name = '开启';
      if (!this.is_enabled) {
        name = '关闭';
      }
      return name;
    },
    formValidator() {
      // const validatorChinese = (rule, value, callback) => {
      //   if (!Chinese(value)) {
      //     return callback(Error('中文名称必须包含中文'));
      //   }
      //   return callback();
      // };
      const validatorEnglish = (rule, value, callback) => {
        if (!English(value) || !noChinese(value)) {
          return callback(Error(this.$t('外文名称不能出现中文且必须包含外文')));
        }
        return callback();
      };
      const validatorCode = (rule, value, callback) => {
        if (!code(value)) {
          return callback(Error('货区编号只能包含字母、数字、下划线及连字符'));
        }
        return callback();
      };
      return {
        name_cn: [
          { required: true, message: this.$t('PleaseEnterTheNameOfTheGoodsArea'), trigger: 'blur' },
          { max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          // { validator: validatorChinese, trigger: 'blur' },
        ], // 货区中文
        name_en: [
          { required: true, message: this.$t('PleaseEnterTheShippingAreaEnglishName'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorEnglish, trigger: 'blur' },
        ], // 货区外文
        code: [
          { required: true, message: this.$t('PleaseEnterTheWarehouseNumberss'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorCode, trigger: 'blur' },
        ], // 货区代码
        warehouse_feature_id: [
          { required: true, message: '请输入仓库特性', trigger: 'blur' },
        ], // 仓库特性
      };
    },
  },
  created() {
    this.getInfo();
    this.getFeaturesList();
  },
  methods: {
    getInfo() {
      if (!this.$route.query.areaId) return;
      $http.getInfoWarehouseArea(this.$route.query.areaId).then((res) => {
        this.is_enabled = !!res.data.is_enabled;
        this.form = res.data;
      });
    },
    // 拉取特性列表
    getFeaturesList() {
      const warehouseId = this.$route.query.id;
      console.log(warehouseId);
      $http.warehouseFeature({
        warehouse_id: warehouseId,
        page: 1,
        page_size: 10,
        data_count: 0,
      }).then((res) => {
        this.features = res.data.data.filter(item => !!item.is_enabled);
      });
    },
    onSubmit() {
      this.$refs.CargoAreaReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        this.form.area_id = this.$route.query.areaId;
        this.form.functions = !this.form.functions.length ? '' : this.form.functions;
        $http.addWarehouseArea(this.form, this.$route.query.areaId).then(() => {
          this.successTips(this.$route.query.areaId);
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
