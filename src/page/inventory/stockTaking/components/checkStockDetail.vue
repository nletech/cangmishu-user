<template>
    <div :class="$style.stockTaking">
        <div :class="$style.stockTaking_main">
            <div :class="$style.stockTaking_table">
              <el-row>
                    <el-col  :span="8">
                      <span :class="$style.font_desc">单据编号:</span>&nbsp;&nbsp;<span>{{temp_data.recount_no}}</span>
                    </el-col>
                    <el-col  :span="8">
                      <span :class="$style.font_desc">操作日期:</span>&nbsp;&nbsp;<span>{{temp_data.updated_at}}</span>
                    </el-col>
                    <el-col  :span="8">
                      <span :class="$style.font_desc">操作人:</span>&nbsp;&nbsp;<span>{{temp_data.owner_id}}</span>
                    </el-col>
              </el-row>
            </div>
            <el-table
                :data="stock_list"
                border
                style="width:100%">
                <el-table-column
                    label="#"
                    type="index"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="商品名(规格)"
                    prop="name_cn"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="SKU编码"
                    prop="relevance_code"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="入库批次"
                    prop="stock_sku"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="原库存"
                    prop="shelf_num_orgin"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="盘点数量"
                    header-align="center"
                    prop="shelf_num_now"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="盘亏"
                    prop="shelf_num_orgin"
                    header-align="center"
                    align="center">
                    <template slot-scope="scope">
                      {{((+scope.row.shelf_num_now) - (scope.row.shelf_num_orgin)) | nagative_num_filter}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="盘亏金额(元)"
                    header-align="center"
                    align="center">
                    <template slot-scope="scope">
                      {{((+scope.row.total_purcharse_now) - (scope.row.total_purcharse_orgin)) | nagative_num_filter}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="盘盈"
                    header-align="center"
                    align="center">
                    <template slot-scope="scope">
                      {{((+scope.row.shelf_num_now) - (scope.row.shelf_num_orgin)) | positive_num_filter}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="盘盈金额(元)"
                    header-align="center"
                    align="center">
                    <template slot-scope="scope">
                      {{((+scope.row.total_purcharse_now) - (scope.row.total_purcharse_orgin)) | positive_num_filter}}
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="10">
                    <span style="font-size: 1.2rem;
                          position: relative;
                          top: 10px;
                          color: #909399;">
                          {{$t('remark')}}:
                    </span>
                    &nbsp;&nbsp;
                    <span>
                      {{remark}}
                    </span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2" :offset="22">
                    <el-button
                        :loading="isButtonLoading"
                        style="margin-top: 20px;"
                        type="primary"
                        @click="onPreview">
                        预览
                    </el-button>
                </el-col>
            </el-row>
            <el-dialog
              :visible.sync="visible"
              style="width: 100%;"
              title="盘点明细预览">
              <el-row>
                <el-col>
                  <div v-html="content" v-if="visible"></div>
                </el-col>
              </el-row>
              <el-row>
                  <el-col :span="2" :offset="21">
                      <el-button
                          :disable="disable"
                          :loading="isButtonLoading"
                          style="margin-top: 20px;"
                          type="primary"
                          @click="onDownload">
                          下载
                      </el-button>
                  </el-col>
              </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import baseApi from '@/lib/axios/base_api';

export default {
  name: 'checkStockDetail',
  mixins: [mixin],
  data() {
    return {
      visible: false,
      remark: '', // 备注
      stock_list: [], // 预提交列表
      temp_data: {}, // 临时数据
      content: '', // html
      disable: false,
    };
  },
  computed: {
    api() {
      return this.$store.state.token.token.substring(7);
    },
  },
  created() {
    this.checkStockDetails();
    this.previewStockDetails();
  },
  filters: {
    positive_num_filter(val) {
      if (+val >= 0) {
        return +val;
      }
      return 0;
    }, // 盘盈
    nagative_num_filter(val) {
      if (+val <= 0) {
        return +val;
      }
      return 0;
    }, // 盘亏
  },
  methods: {
    previewStockDetails() {
      if (!this.warehouseId) return;
      $http.Stockpreview(this.$route.query.stockId)
        .then((res) => {
          if (res.status) return;
          this.content = res;
        });
    },
    checkStockDetails() {
      if (!this.warehouseId) return;
      $http.checkStockDetail(this.$route.query.stockId)
        .then((res) => {
          if (res.status) return;
          this.stock_list = res.data.stocks;
          this.temp_data = res.data;
        });
    },
    onPreview() {
      this.visible = !this.visible;
    },
    onDownload() {
      if (!this.$route.query.stockId) return;
      this.disable = true;
      this.visible = false;
      window.open(`${baseApi}recount/${this.$route.query.stockId}/download/?api_token=${this.api}&lang`);
      this.disable = false;
    },
  },
};
</script>

<style lang="less" module>


.stockTaking {
  margin: @margin;
  .stockTaking_main {
    width: @width;
    margin: 0 auto;
  }
  .stockTaking_table {
    margin: 0 0 20px 0;
  }
  .pagination {
    margin: 10px 0 0 0;
    float: right;
  }
  .font_desc {
    font-size: 1.2rem;
    font-weight: 400;
  }
}
</style>
