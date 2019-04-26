<template>
  <model-form>
    <el-form :class="$style.form" slot="left" label-width="130px">
      <!-- <label :class="$style.label"> 基本信息 </label> -->
      <el-form-item label="打印拣货单规则" prop="distributor_id">
           <el-radio-group v-model="printRule">
             <el-radio :label="1">按仓库特性打印</el-radio>
             <el-radio :label="2">按订单打印</el-radio>
           </el-radio-group>
      </el-form-item>
      <el-form-item label="拣货单拣货规则" prop="distributor_id">
          <el-radio-group v-model="pickRule">
            <el-radio v-if="printRule===1" :label="3">分订单拣货</el-radio>
            <el-radio v-if="printRule===1" :label="4">按货品拣货</el-radio>
            <el-radio v-if="printRule===2" :label="5">分仓库特性拣货</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitCategoryAdd">确定</el-button>
        <el-button @click="printRule = ''">取消</el-button>
      </el-form-item>
    </el-form>
  </model-form>
</template>

<script>
import ModelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  components: {
    ModelForm,
  },
  data() {
    return {
      form: {
        id: '',
        name_cn: '',
        name_en: '',
        value: '',
        need_expiration_date: false,
        need_production_batch_number: false,
        is_enabled: false,
        num1: '',
        warning_stock: '',
        ratio_rate: '',
        extract_rate: '',
        commodity_status: '',
        cargo_property: '',
      },
      cargoPropertyList: [
        { name: '冷冻', id: 1 },
        { name: '冷藏', id: 2 },
        { name: '常温', id: 3 },
      ],
      printRule: '',
      ifPickedFirst: false,
      ifPickedSecond: false,
      pickRule: '',
    };
  },
  computed: {
    // form() {
    //   return {},
    // },
  },
  mixins: [mixin],
  methods: {
    submitCategoryAdd() {
      $http.categoryAdd({
        name_cn: this.form.name_cn,
        name_en: this.form.name_en,
        need_expiration_date: this.form.need_expiration_date,
        need_production_batch_number: this.form.need_production_batch_number,
        is_enabled: this.form.is_enabled,
      }).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success',
        });
        this.$router.push({
          name: 'commodityManage',
        });
      });
    },
  },
};
</script>

<style lang="less" module>
  .form {
    padding: 50px 0 0 50px;
  }
</style>
