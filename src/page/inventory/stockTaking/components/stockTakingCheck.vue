<template>
  <el-dialog
    title="盘点详情"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
    width="60%">
              <el-form  :model="form"
                        label-width="120px">
                        <el-form-item label="商品名称"
                                      prop="product_name">
                                      {{form.product_name}}
                        </el-form-item>
                        <el-form-item label="SKU"
                                      prop="relevance_code">
                                      {{form.relevance_code}}
                        </el-form-item>
                        <el-form-item label="入库批次"
                                      prop="sku">
                                      {{form.sku}}
                        </el-form-item>
                        <el-form-item label="货位库存"
                                      prop="stock_num">
                                      <el-input v-model="form.stock_num"
                                                size="small">
                                      </el-input>
                        </el-form-item>
                        <el-form-item label="货位"
                                      prop="location_code">
                                      <el-input v-model="form.location_code"
                                                size="small">
                                      </el-input>
                        </el-form-item>
                        <el-form-item label="EAN码"
                                      prop="ean">
                                      <el-input v-model="form.ean"
                                                size="small">
                                      </el-input>
                        </el-form-item>
                        <el-form-item label="生产批次号"
                                      prop="product_batch_num">
                                      <el-input v-model="form.product_batch_num"
                                                size="small">
                                      </el-input>
                        </el-form-item>
                        <el-form-item label="保质期"
                                      prop="expiration_date">
                                      <el-input v-model="form.expiration_date"
                                                size="small">
                                      </el-input>
                        </el-form-item>
                        <el-form-item label="备注"
                                      prop="remark">
                                      <el-input v-model="form.remark"
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
      form: {
        product_name: '', // 商品名称
        relevance_code: '', // sku 也是外部编码
        sku: '', // sku
        shelf_num: '', // 货位库存
        location_code: '', // 货位
        ean: '', // ean
        product_batch_num: '', // 生产批次号
        expiration_date: '', // 保质期
        remark: '', // 备注
      },
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  mounted() {
    this.form.product_name = this.row_data.product_name;
    this.form.relevance_code = this.row_data.relevance_code;
    this.form.sku = this.row_data.sku;
    this.form.stock_num = this.row_data.shelf_num;
    this.form.location_code = this.row_data.location_code;
    this.form.ean = this.row_data.ean;
    this.form.product_batch_num = this.row_data.product_batch_num;
    this.form.expiration_date = this.row_data.expiration_date;
    this.form.remark = this.row_data.remark;
  },
  watch: {
    visible() {
      if (this.visible) {
        this.form.product_name = this.row_data.product_name;
        this.form.relevance_code = this.row_data.relevance_code;
        this.form.sku = this.row_data.sku;
        this.form.stock_num = this.row_data.shelf_num;
        this.form.location_code = this.row_data.location_code;
        this.form.ean = this.row_data.ean;
        this.form.product_batch_num = this.row_data.product_batch_num;
        this.form.expiration_date = this.row_data.expiration_date;
        this.form.remark = this.row_data.remark;
      } else {
        for (const item in this.form) {
          if (Object.prototype.hasOwnProperty.call(this.form, item)) {
            this.form[item] = '';
          }
        } // 清空
      }
    },
  },
  methods: {
    handleComfirm() {
      this.form.warehouse_id = this.warehouseId;
      $http.editInventory(this.row_data.stock_id, this.form)
        .then((res) => {
          if (res.status) return;
          this.$emit('success', true, this.row_data.sku);
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        })
        .catch((e) => {
          console.log('出错', e);
        });
      this.$emit('close', false);
    },
  },
};
</script>

<style lang="less" module>
</style>
