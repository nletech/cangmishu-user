<template>
  <el-dialog
    title="盘点详情"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
    width="60%">
    <el-form
        :model="form"
        ref="submitForm"
        :rules="valid_rules"
        label-width="120px">
        <el-form-item
            label="商品名称"
            prop="product_name">
            {{form.product_name}}
        </el-form-item>
        <el-form-item
            label="SKU"
            prop="relevance_code">
            {{form.relevance_code}}
        </el-form-item>
        <el-form-item
            label="入库批次"
            prop="sku">
            {{form.sku}}
        </el-form-item>
        <el-form-item
            label="货位库存"
            prop="stock_num">
            <el-input  v-model="form.stock_num"
                      size="small">
            </el-input>
        </el-form-item>
        <el-form-item
            label="货位"
            prop="location_code">
            <el-input  v-model="form.location_code"
                      size="small">
            </el-input>
        </el-form-item>
        <el-form-item
            label="EAN码"
            prop="ean">
            <el-input  v-model="form.ean"
                      size="small">
            </el-input>
        </el-form-item>
        <el-form-item
            label="生产批次号"
            v-if="row_data.need_production_batch_number"
            prop="production_batch_number">
            <el-input  v-model="form.production_batch_number"
                      placeholder="请输入生产批次号"
                      size="small">
            </el-input>
        </el-form-item>
        <el-form-item
            label="保质期"
            v-if="row_data.need_expiration_date"
            prop="expiration_date">
            <el-date-picker
                v-model="form.expiration_date"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择保质期"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </el-form-item>
        <el-form-item
            label="最佳食用期"
            v-if="row_data.need_best_before_date"
            prop="best_before_date">
            <el-date-picker
              v-model="form.best_before_date"
              type="date"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择最佳食用期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </el-form-item>
        <el-form-item
            :label="$t('remark')"
            prop="remark">
            <el-input  v-model="form.remark"
                      type="textarea"
                      size="small">
            </el-input>
        </el-form-item>
    </el-form>
    <span  slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleComfirm">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import $http from '@/api';

export default {
  name: 'stockTakingCheck',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    row_data: {
      type: Object,
    },
  },
  data() {
    return {
      valid_rules: {
        stock_num: [
          { required: true, message: '货位库存不能为空', trigger: 'blur' },
        ],
        location_code: [
          { required: true, message: '货位不能为空', trigger: 'blur' },
        ],
        ean: [
          { required: true, message: 'ean不能为空', trigger: 'blur' },
        ],
        production_batch_number: [
          { required: true, message: '生产批次号不能为空', trigger: 'blur' },
        ],
        expiration_date: [
          { required: true, message: '保质期不能为空', trigger: 'blur' },
        ],
        best_before_date: [
          { required: true, message: '最佳食用期不能为空', trigger: 'blur' },
        ],
      },
      form: {
        product_name: '', // 商品名称
        relevance_code: '', // sku 也是外部编码
        sku: '', // sku
        stock_num: '', // 货位库存
        location_code: '', // 货位
        ean: '', // ean
        production_batch_number: '', // 生产批次号
        expiration_date: '', // 保质期
        best_before_date: '', // 最佳食用期
        remark: '', // 备注
      },
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.form.product_name = '';
        this.form.relevance_code = '';
        this.form.sku = '';
        this.form.stock_num = '';
        this.form.location_code = '';
        this.form.ean = '';
        this.form.production_batch_number = ''; // 生产批次号
        this.form.expiration_date = ''; // 保质期
        this.form.best_before_date = ''; // 最佳使用期
        this.form.remark = '';
      }
      // console.log(this.row_data, 'row_data');
      this.form.product_name = this.row_data.product_name;
      this.form.relevance_code = this.row_data.relevance_code;
      this.form.sku = this.row_data.sku;
      this.form.stock_num = this.row_data.shelf_num;
      this.form.location_code = this.row_data.location_code;
      this.form.ean = this.row_data.ean;
      this.form.production_batch_number = this.row_data.production_batch_number; // 生产批次号
      this.form.expiration_date = this.row_data.expiration_date; // 保质期
      this.form.best_before_date = this.row_data.best_before_date; // 最佳使用期
      this.form.remark = this.row_data.remark;
      // console.log(this.form, 'form');
    },
  },
  methods: {
    handleComfirm() {
      this.$refs.submitForm.validate((valid) => {
        if (!valid) return;
        console.log(this.form, 'form');
        this.form.warehouse_id = this.warehouseId;
        this.form.id = this.row_data.stock_id;
        $http.editInventory(this.row_data.stock_id, this.form)
          .then((res) => {
            if (res.status) return;
            this.$emit('success', true, this.row_data.sku);
            this.$message({
              type: 'success',
              message: '操作成功',
            });
          });
        this.$emit('close', false);
      });
    },
  },
};
</script>

<style lang="less" module>
</style>
