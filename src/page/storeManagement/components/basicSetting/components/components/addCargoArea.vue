<template>
  <mdoel-form>
    <el-form  slot="left"
              :model="form"
              ref="CargoAreaReference"
              label-width="120px"
              :rules="formValidator">
              <label class="label">{{'基础信息'}}</label>
              <el-form-item  prop="code"
                             label="货区编号"
                             :class="$style.avatar_uploader">
                             <el-input  v-model="form.code"
                                        size="small">
                             </el-input>
              </el-form-item>
              <el-form-item  prop="name_cn"
                             label="货区名称">
                            <el-input  v-model="form.name_cn"
                                        size="small">
                            </el-input>
              </el-form-item>
              <el-form-item  label="是否启用">
                             <el-switch  v-model="is_enabled"
                                         active-color="#13ce66"
                                         inactive-color="#ff4949">
                             </el-switch>
              </el-form-item>
              <label  class="label">{{'可选信息'}}</label>
              <el-form-item  label="备注">
                             <el-input  v-model="form.remark"
                                        type="textarea"
                                        size="small"
                                        :rows="3">
                             </el-input>
              </el-form-item>
              <el-form-item>
                            <el-button  type="primary"
                                        @click="onSubmit"
                                        :loading="$store.state.config.button_loading">
                                        {{'提交'}}
                            </el-button>
              </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';

export default {
  components: {
    MdoelForm,
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
        warehouse_id: this.$route.query.warehouse_id, // 所属货区id
      },
      is_enabled: true,
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
      if (!this.$route.params.areaId) return;
      $http.getInfoWarehouseArea(this.$route.query.warehouse_id)
        .then((res) => {
          this.is_enabled = !!res.data.is_enabled;
          this.form = res.data;
        });
    },
    onSubmit() {
      this.$refs.CargoAreaReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        this.form.warehouse_id = this.$route.query.warehouse_id;
        $http.addWarehouseArea(this.form, this.$route.query.warehouse_id)
          .then((res) => {
            if (res.status) return;
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
            });
            this.$router.push({
              name: 'basicSetting',
              params: { add_shelf_back: false },
              query: {
                warehouse_id: this.form.warehouse_id,
              },
            });
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
