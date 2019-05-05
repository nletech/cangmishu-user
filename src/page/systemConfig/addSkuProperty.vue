<template>
<div class="storeManage">
  <mdoel-form :colValue="20">
    <el-form slot="left" label-width="120px" :rules="formValidator" :model="form" ref="form">
      <label class="label"> {{$t('EssentialInformation')}} </label>
      <el-form-item :label="$t('propertyCnName')" prop="batch_code">
        <el-input v-model="form.batch_code" size="small"></el-input>
       </el-form-item>
      <el-form-item :label="$t('propertyEnName')" prop="confirmation_number">
        <el-input v-model="form.confirmation_number" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('inputFormat')" prop="distributor_id">
        <el-select v-model="form.input_format">
          <el-option
            v-for="item in inputFormatList"
            :label="item.name"
            :value="item.id" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('isHandheldSideInput')" prop="confirmation_number">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSave('form')"
          :loading="$store.state.config.button_loading">提交</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import getListData from '@/mixin/list';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import { noChinese } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
    MyInput,
    MyGroup,
    MySelect,
  },
  mixins: [getListData, mixin],
  data() {
    return {
      form: {
        warehouse_id: '',
        type_id: '',
        batch_code: '',
        confirmation_number: '',
        distributor_id: '',
        status: '',
        transportation_type: '',
        waybill_number: '',
      },
      inputFormatList: [
        { name: '日期', id: 1 },
        { name: '文本', id: 2 },
        { name: '数字', id: 3 },
      ],
    };
  },
  created() {
  },
  computed: {
    formValidator() {
      const validatorPropertyEnName = (rule, value, callback) => {
        if (!noChinese(value)) {
          return callback(Error('外文名中不能含有中文'));
        }
        return callback();
      };
      return {
        warehouse_id: [
          { required: true, message: '请选择入库仓库', trigger: 'change' },
        ],
        type_id: [
          { required: true, message: '请选择入库单分类', trigger: 'change' },
        ],
        batch_code: [
          { required: true, message: '请输入属性中文名', trigger: 'blur' },
        ],
        confirmation_number: [
          { required: true, message: '请输入属性外文名', trigger: 'blur' },
          { validator: validatorPropertyEnName, trigger: 'blur' },
        ],
      };
    },
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  methods: {
    // 选择货品弹框关闭
    handleClose() {
      this.goodsSelected = [];
      this.goodsDialog = false;
    },
    // 入库单提交
    onSave(formName) {
      this.items = [];
      // eslint-disable-next-line
      for (const item of this.goodsList) {
        this.items.push({
          id: item.product_id,
          spec_id: item.id,
          relevance_code: item.relevance_code,
          need_num: item.need_num,
          pieces_num: item.pieces_num || '',
          distributor_code: item.distributor_code,
          remark: item.remark || '',
        });
      }
      this.form.product_stock = this.items;
      if (this.startDate && this.startTime && this.endDate && this.endTime) {
        this.form.plan_time = `${this.startDate} ${this.startTime}:00`;
        this.form.over_time = `${this.endDate} ${this.endTime}:00`;
        const timeDiff = Date.parse(this.form.over_time) - Date.parse(this.form.plan_time);
        if (timeDiff < 0) {
          this.$notify({
            message: '结束时间必须晚于开始时间!',
            type: 'warning',
          });
          return;
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $http.inboundAdd(this.form).then(() => {
            this.successTips();
          });
        } else {
          this.$message({
            message: '请检查您的输入!',
            type: 'warning',
          });
          return false;
        }
        return true;
      });
      // $http.inboundAdd(this.form).then(() => {
      //   this.successTips();
      // });
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.myselect {
  line-height:40px;
  height: 40px;
}
</style>
