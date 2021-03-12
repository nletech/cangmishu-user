<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="20" type="flex" justify="end">
          <el-col>
            <el-button @click="handlerEdit()" style="float:right" icon="el-icon-edit" size="small">
              修改资料
            </el-button>
            <el-button
              @click="handlerDelete()"
              style="float:right"
              icon="el-icon-circle-close"
              size="small"
              type="danger"
            >
              删除
            </el-button>
          </el-col>
        </el-row>
        <h2 align="center" style="margin:0px;">
          {{ dataInfo.name_cn }}
        </h2>
      </div>
      <el-row>
        <el-col :span="6">
          <el-image
            style="width: 250px; height: 250px; border:1px solid #cccccc"
            :src="dataInfo.photos"
            fit="scale-down"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
        <el-col :span="18" class="product-info">
          <el-row>
            <el-col><label>商品条码:</label> {{ dataInfo.barcode }}</el-col>
          </el-row>
          <el-row>
            <el-col><label>商品分类:</label> {{ dataInfo.category.name_cn }}</el-col>
          </el-row>
          <el-row>
            <el-col><label>可用库存:</label> {{ dataInfo.total_stock_num }}</el-col>
          </el-row>
          <el-row>
            <el-col><label>入库总量:</label> {{ dataInfo.total_stockin_num }}</el-col>
          </el-row>
          <el-row>
            <el-col><label>出库总量:</label> {{ dataInfo.total_stockout_num }}</el-col>
          </el-row>
          <el-row>
            <el-col><label>商品备注:</label> {{ dataInfo.remark }}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <hr />
      <el-table :data="dataInfo.specs" border>
        <el-table-column type="index" label="#" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="relevance_code" label="SKU" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          prop="name_cn"
          :label="$t('specificationChineseName')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name_en"
          v-if="isEnabledLangInput()"
          :label="$t('specificationEnglishName')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gross_weight"
          :label="$t('grossWeight')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="purchase_price"
          :label="$t('PurchasePrice')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sale_price"
          :label="$t('SalePrice')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_stock_num"
          align="center"
          header-align="center"
          :label="$t('inventory')"
        >
        </el-table-column>
        <el-table-column align="center" header-align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showStockDetail(scope.row.id)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 操作记录 -->
    <br />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        操作记录
      </div>
      <el-table :data="logs.dataList" border>
        <el-table-column type="index" align="center" header-align="center" width="60">
        </el-table-column>
        <el-table-column :label="$t('Type')" align="center" header-align="center">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="规格名称" prop="spec.name_cn">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          :label="$t('OperationNumber')"
          prop="operation_num"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="spec_total_stock_num"
          :label="$t('TotalInventory')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="created_at"
          :label="$t('Operationdate')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="order_sn"
          :label="$t('OrderNumber')"
        >
        </el-table-column>
        <el-table-column align="center" header-align="center" prop="remark" :label="$t('remark')">
        </el-table-column>
      </el-table>
      <pagination-public
        :params="logs.params"
        @changePage="handlerLogsChangePage"
      ></pagination-public>
    </el-card>
  </div>
</template>

<script>
import mixin from '@/mixin/form_config';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';

export default {
  name: 'goodsDetail',
  mixins: [mixin],
  data() {
    return {
      dataInfo: {},
      logs: {
        dataList: [],
        params: {}
      }
    };
  },
  created() {
    this.getGoodsData(); // 获取单个货品信息
    this.loadLogs(); //操作记录
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi.BASE_URL}upload/image`;
    },
    imgUrl() {
      return `${baseApi.BASE_URL}${this.form.photos}`;
    }
  },
  methods: {
    showStockDetail(id) {
      this.$router.push({
        name: 'inventoryDetail',
        query: {
          id: id
        }
      });
    }, // 规格库存详细
    // 获取单个货品的信息
    getGoodsData() {
      const productId = this.$route.query.id;
      const whId = this.$route.query.warehouse_id;
      $http.getAProducts(productId, { warehouse_id: whId }).then(res => {
        this.dataInfo = res.data;
      });
    },
    handlerEdit() {
      this.$router.push({
        name: 'goodsEdit',
        query: {
          id: this.dataInfo.id,
          warehouse_id: this.dataInfo.warehouse_id,
          isCheck: true
        }
      });
    }, // 编辑货品
    loadLogs() {
      $http.logsProducts(this.$route.query.id, {}).then(res => {
        this.logs.dataList = res.data.data;
        this.logs.params.total = res.data.total;
        this.logs.params.currentPage = res.data.current_page;
      });
    },
    handlerLogsChangePage(val) {
      this.logs.params.page = val;
      this.loadLogs();
    }, // 分页响应
    handlerDelete() {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteProducts(this.dataInfo.id).then(res => {
          if (res.status) return;
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.$router.push({
            name: 'goodsManage'
          });
        });
      });
    }
  }
};
</script>
<style lang="less" scope>
.total-area {
  text-align: center;
  font-size: 12px;
  color: #666666;
  h3 {
    font-size: 16px;
    color: #000000;
  }
}
.box-card {
  .block {
    width: 49%;
    padding: 30px 0;
    text-align: center;
    border-right: 1px solid #eff2f6;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
  }
}
.product-info {
  line-height: 35px;
  label {
    padding-right: 20px;
    color: #666666;
  }
}
</style>
