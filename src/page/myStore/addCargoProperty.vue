<template>
  <mdoel-form>
    <el-form slot="left"
    ref="cargoProperty"
    :model="form"
    label-width="120px"
    :rules="formValidator">
      <label class="label"> {{$t('EssentialInformation')}} </label>
      <el-form-item :label="$t('attributeCnName')" prop="name_cn">
        <el-input v-model="form.name_cn"
                  placeholder="示例：冷冻，冷藏，干货等"
                  size="small">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('attributeEnName')" prop="name_en">
        <el-input v-model="form.name_en"
                  placeholder="Examples: frozen, refrigerated, dry goods, etc."
                  size="small">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-tooltip :content="isOpenText" placement="top">
          <el-switch
          v-model="form.is_enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="logo">
        <el-select size="small" v-model="form.logo">
          <el-option value="" label="无"></el-option>
          <el-option value="雪花" label="雪花"></el-option>
          <el-option value="常温" label="常温"></el-option>
          <el-option value="风扇" label="风扇"></el-option>
        </el-select>
      </el-form-item>
      <label class="label"> {{$t('OptionalInformation')}}</label>
      <el-form-item :label="$t('remarks')">
        <el-input v-model="form.remark" type="textarea" size="small" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"
        :loading="$store.state.config.button_loading">
          {{$route.query.areaId ? $t('ModifyNow') : $t('CreateNow')}}
        </el-button>
        <cancel-button @click="$router.go(-1)"></cancel-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import { English, Chinese, noChinese } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        name_cn: '', // 货区名称
        name_en: '', // 外文名称
        is_enabled: true, // 启用状态
        remark: '', // 备注
        logo: '',
        warehouse_id: this.$route.query.id, // 所属货区id
      },
    };
  },
  computed: {
    isOpenText() {
      let name = '开启';
      if (!this.form.is_enabled) {
        name = '关闭';
      }
      return name;
    },
    formValidator() {
      const validatorChinese = (rule, value, callback) => {
        if (!Chinese(value)) {
          return callback(Error('中文名称必须包含中文'));
        }
        return callback();
      };
      const validatorEnglish = (rule, value, callback) => {
        if (!English(value) || !noChinese(value)) {
          return callback(Error(this.$t('外文名称不能出现中文且必须包含外文')));
        }
        return callback();
      };
      return {
        name_cn: [
          { required: true, message: '请输入仓库特性中文名', trigger: 'blur' },
          { max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorChinese, trigger: 'blur' },
        ], // 货区中文
        name_en: [
          { required: true, message: '请输入仓库特性外文名', trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorEnglish, trigger: 'blur' },
        ], // 货区外文
      };
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (!this.$route.query.propertyId) return;
      $http.getInfoWarehouseFeature(this.$route.query.propertyId).then((res) => {
        this.form = res.data;
        this.form.is_enabled = !!res.data.is_enabled;
      });
    },
    formatSendData() {
      const isEnabled = Number(this.form.is_enabled);
      let sendData = {};
      if (!this.$route.query.areaId) {
        sendData = { ...this.form, is_enabled: isEnabled };
      }
      return sendData;
    },
    onSubmit() {
      this.$refs.cargoProperty.validate((valid) => {
        if (!valid) return;
        const formatedData = this.formatSendData();
        // this.form.is_enabled = +this.is_enabled;
        // this.form.area_id = this.$route.query.areaId;
        // this.form.functions = !this.form.functions.length ? '' : this.form.functions;
        $http.addWarehouseFeature(formatedData, this.$route.query.propertyId).then(() => {
          this.successTips(this.$route.query.propertyId);
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
