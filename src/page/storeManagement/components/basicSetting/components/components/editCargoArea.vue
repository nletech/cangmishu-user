<template>
  <mdoel-form>
    <el-form  slot="left"
              :model="form"
              ref="CargoAreaReference"
              label-width="120px"
              :rules="formValidator">
              <label class="label">{{$t('EssentialInformation')}}</label>
              <el-form-item  prop="code"
                             :label="$t('ShippingAreaNumber')"
                             :class="$style.avatar_uploader">
                             <el-input  v-model="form.code"
                                        maxlength="255"
                                        size="small">
                             </el-input>
              </el-form-item>
              <el-form-item  prop="name_cn"
                             :label="$t('ShippingAreaName')">
                            <el-input  v-model="form.name_cn"
                                        maxlength="255"
                                        size="small">
                            </el-input>
              </el-form-item>
              <el-form-item  :label="$t('WhetherToEnable')">
                             <el-switch  v-model="is_enabled"
                                         active-value="1"
                                         inactive-value="0"
                                         active-color="#13ce66"
                                         inactive-color="#ff4949">
                             </el-switch>
              </el-form-item>
              <label  class="label">{{$t('OptionalInformation')}}</label>
              <el-form-item  :label="$t('remark')">
                             <el-input  v-model="form.remark"
                                        type="textarea"
                                        size="small"
                                        :rows="3">
                             </el-input>
              </el-form-item>
              <el-form-item>
                            <el-button  type="primary"
                                        @click="onSubmit"
                                        :loading="isButtonLoading">
                                        {{$t('submit')}}
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
    MdoelForm,
  },
  data() {
    return {
      form: {
        code: '', // 货区编号
        name_cn: '', // 货区名称
        is_enabled: '0', // 启用状态
        remark: '', // 备注
        name_en: '', // 外文名称
        warehouse_id: this.$route.query.warehouse_id, // 所属货区id
      },
      is_enabled: '0',
    };
  },
  computed: {
    formValidator() {
      return {
        name_cn: [
          { required: true, message: '请输入货区名称', trigger: 'blur' },
          { max: 255, message: '货区名称最长为255字符串', trigger: 'blur' },
        ], // 货区中文
        code: [
          { required: true, message: '请输入货区编号', trigger: 'blur' },
          { min: 1, max: 255, message: '货区编号长度必须为1-255', trigger: 'blur' },
        ], // 货区代码
      };
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (this.$route.query.edit) {
        $http.getWarehouseArea({ warehouse_id: this.$route.query.warehouse_id })
          .then((res) => {
            const data = res.data.data;
            for (let i = 0; i < data.length; i += 1) {
              if (data[i].id === +this.$route.query.area_id) {
                this.form.code = data[i].code;
                this.form.name_cn = data[i].name_cn;
                this.is_enabled = `${data[i].is_enabled}`; // 这里必须是字符串
                this.form.remark = data[i].remark;
              }
            }
          });
      }
    },
    onSubmit() {
      this.$refs.CargoAreaReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        this.form.warehouse_id = this.$route.query.warehouse_id;
        $http.editWarehouseArea(this.$route.query.area_id, this.form)
          .then((res) => {
            if (res.status) return;
            this.$router.go(-1);
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
