<template>
  <div>
    <detail-dialog
      :visible.sync="inboundDialogVisible"
      v-if="inboundInfo"
      :id.sync="batch_id"
    ></detail-dialog>
    <model-form :colValue="24" v-if="inboundInfo">
      <!-- 入库单详情弹框 -->
      <el-form slot="left" label-width="100px" ref="form">
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col>
              <el-button
                @click="handlerDownload()"
                style="float:right"
                icon="el-icon-download"
                size="small"
              >
                下载
              </el-button>
              <el-button
                @click="handlerCancel()"
                style="float:right"
                icon="el-icon-circle-close"
                size="small"
                type="danger"
                v-if="inboundInfo.status !== 3"
              >
                取消订单
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <h2 align="center" style="margin:0px;">
          <div style="float:right">
            <div :class="$style.img">
              <img
                v-if="inboundInfo.batch_code_barcode"
                :src="inboundInfo.batch_code_barcode"
                :class="$style.inboundimg"
              />
            </div>
            <div>
              <span style="font-size:12px;" v-if="inboundInfo">{{ inboundInfo.batch_code }}</span>
            </div>
          </div>
          入库单详细
        </h2>
        <hr style="clear:both" />
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <el-form-item label="创建日期">
              <div>{{ inboundInfo.created_at }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('category')">
              {{ inboundInfo.batch_type.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 供应商 -->
            <el-form-item :label="$t('supplier')">
              {{ inboundInfo.distributor.name_cn }}
            </el-form-item>
          </el-col>
        </el-row>
        <hr />
        <!-- 入库单分类 -->
        <el-card class="box-card">
          <el-table :data="inboundList" border>
            <el-table-column type="index" align="center" header-align="center" width="60">
            </el-table-column>
            <el-table-column
              :label="$t('cnName')"
              prop="spec.product_name"
              align="center"
              header-align="center"
            >
            </el-table-column>
            <el-table-column label="SKU" align="center" header-align="center" prop="relevance_code">
            </el-table-column>
            <el-table-column label="EAN" align="center" header-align="center" prop="ean">
            </el-table-column>
            <el-table-column
              :label="$t('Estimatednumberofwarehousing')"
              align="center"
              header-align="center"
              prop="need_num"
              width="144"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.need_num }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="采购单价"
              align="center"
              header-align="center"
              prop="purchase_price"
            >
            </el-table-column>
            <el-table-column
              :label="$t('Actualwarehousingquantity')"
              align="center"
              header-align="center"
              prop="stockin_num"
            >
            </el-table-column>
            <el-table-column
              :label="$t('Rack')"
              align="center"
              header-align="center"
              prop="location_code"
            >
            </el-table-column>
          </el-table>
          <button-pagination :pageParams="params"></button-pagination>
        </el-card>
        <hr />
        <!-- 提交按钮 -->
        <el-row :gutter="24">
          <el-col :span="18">
            <el-form-item :label="$t('remark')">
              {{ inboundInfo.remark }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预计总数量:">
              <span style="font-size:18px; font-weight:bold">{{
                inboundInfo.total_num.total_need_num
              }}</span>
            </el-form-item>
            <el-form-item label="实际总数量:">
              <span style="font-size:18px; font-weight:bold">{{
                inboundInfo.total_num.total_stockin_num
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="2" :sm="4" :lg="2">
              <el-button
                type="primary"
                icon="el-icon-sell"
                @click="handlerNext()"
                style="float:right"
                v-if="inboundInfo.status !== 3"
              >
                核对清单
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </model-form>
  </div>
</template>

<script>
/* eslint-disable */
import ModelForm from '@/components/form';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';
import mixin from '@/mixin/form_config';
import detailDialog from './components/inbound_detail';

export default {
  name: 'inboundDetail',
  mixins: [getListData, mixin],
  data() {
    return {
      batch_id: 0,
      total: 20, // 列表总条数
      //
      inboundInfo: {},
      inboundDialogVisible: false
    };
  },
  components: {
    buttonPagination,
    ModelForm,
    detailDialog
  },
  watch: {
    warehouseId() {
      this.getData();
    }
  },
  mounted() {
    this.batch_id = this.$route.query.batch_id;
    this.getData();
  },
  methods: {
    handlerNext() {
      this.$router.push({
        name: 'inboundShelf',
        query: {
          batch_id: this.batch_id
        }
      });
    },
    handlerCancel() {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteInbound(this.batch_id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success',
            showClose: true
          });
          this.$router.push({
            name: 'inboundList',
            query: {
              warehouse_id: this.warehouseId
            }
          });
        });
      });
    },
    handlerDownload() {
      this.inboundDialogVisible = true;
    },
    getData() {
      $http
        .getInboundDetail(this.$route.query.batch_id, { warehouse_id: this.warehouseId })
        .then(res => {
          const data = res.data;
          this.inboundInfo = data;
          this.batch_id = data.id;
          this.inboundList = data.batch_products; //货品(规格)列表
        });
    }
  }
};
</script>

<style lang="less" module>
.inboundShelf {
  padding: 0 0 0 10px;
  margin: 10px 0 0 0;
  background-color: #ffffff;
  padding: 0 40px 0 40px;
}
</style>
