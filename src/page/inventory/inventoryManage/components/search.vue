<template>
  <div class="clearfix">
    <!-- 导出商品库存弹框 -->
    <el-dialog
      :title="$t('ExportProductinventory')"
      :visible.sync="dialogVisible"
      @closed="onClosedDialog"
      width="500px"
    >
      <el-checkbox-group v-model="export_data">
        <el-checkbox value="1" label="1">{{ $t('ExportProductList') }}</el-checkbox>
        <el-checkbox value="2" label="2">{{ $t('Productmeasurementlist') }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button size="mini" type="primary" @click="processExportOrder">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <el-card shadow="never" class="oper-btn-card">
      <div class="clearfix">
        <el-form
          class="fl form-no-bottom"
          :inline="true"
          label-position="left"
          label-width="80px"
          @clear="handlerChange"
          @keydown.enter.native="handlerChange"
        >
          <el-form-item>
            <div class="btn-group">
              <el-input
                v-model="keywords"
                clearable
                style="width: 360px"
                placeholder="按商品条码、SKU"
                size="small"
              />
              <el-button
                type="primary"
                @click="handlerChange"
                size="small"
                style="margin-left:10px;"
              >
                搜索
              </el-button>
              <el-checkbox
                v-model="show_low_stock"
                true-label="1"
                false-label="0"
                border
                type="text"
                size="small"
                style="margin-left:10px;"
                @change="handlerChange"
              >
                低于库存
              </el-checkbox>
            </div>
          </el-form-item>
        </el-form>
        <div class="fr">
          <el-button
            size="small"
            type="primary"
            class="fr"
            @click="addSaleList"
            icon="el-icon-plus"
            style="margin-left:10px;"
          >
            库存概览
          </el-button>
          <el-button
            size="small"
            class="fr"
            @click="$router.push({ name: 'inventoryImport' })"
            icon="el-icon-plus"
            style="margin-left:10px;"
          >
            批量导入库存
          </el-button>
          <el-button size="small" :disabled="isDisabled" @click="handlerExportOrder">
            导出商品库存
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import baseApi from '@/lib/axios/base_api';

export default {
  name: 'search',
  components: {},
  data() {
    return {
      btnFilterSearch: {},
      isDisabled: false,
      keywords: '',
      show_low_stock: 0,
      dialogVisible: false,
      export_data: []
    };
  },
  created() {
    if (this.$route.query.checked) {
      this.handlerChange();
    }
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    api() {
      return this.$store.state.token.token.substring(7);
    },
    currentLang() {
      return localStorage.getItem('lang') || 'cn';
    }
  },
  methods: {
    onClosedDialog() {
      this.export_data = [];
    },
    addSaleList() {
      this.$router.push({
        name: 'inventoryOverview'
      });
    }, // 添加
    handlerClearConditions() {
      this.keywords = '';
      this.show_low_stock = 0;
      this.handlerChange();
    },
    handlerChange() {
      const query = {
        warehouse_id: this.warehouseId,
        keywords: this.keywords,
        show_low_stock: this.show_low_stock
      };
      this.$emit('queryParams', query);
    },
    handlerExportOrder() {
      this.dialogVisible = true;
    },
    processExportOrder() {
      if (!this.warehouseId) return;
      // eslint-disable-next-line
      const exportParams = `&barcode=${this.keywords}`;
      if (this.export_data.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择导出方式'
        });
        return;
      }
      if (this.export_data.length === 2) {
        // 同时导出两个
        // 导出 SKU 列表
        window.open(
          `${baseApi.BASE_URL}export/sku?warehouse_id=${this.warehouseId}&api_token=${this.$store.state.token.token}${exportParams}`
        );
        // 导出 货品库列表
        window.open(
          `${baseApi.BASE_URL}export/stock?warehouse_id=${this.warehouseId}&api_token=${this.$store.state.token.token}${exportParams}`
        );
      } else if (this.export_data[0] === '1') {
        // 单独导出货品列表
        window.open(
          `${baseApi.BASE_URL}export/stock?warehouse_id=${this.warehouseId}&api_token=${this.$store.state.token.token}${exportParams}`
        );
      } else {
        window.open(
          `${baseApi.BASE_URL}export/sku?warehouse_id=${
            // 单独导出 sku
            this.warehouseId
          }&api_token=${this.$store.state.token.token}${exportParams}`
        );
      }
      this.dialogVisible = false;
    }
  }
};
</script>
