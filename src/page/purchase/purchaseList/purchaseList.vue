<template>
    <listUI>
        <template v-slot:search>
            <el-row>
                <purchase-list-search @data_cb="handlerCallBackData"></purchase-list-search>
                <el-col :span="1" :offset="1">
                    <button-public
                        :loading="isButtonLoading"
                        :text="$t('addPurchase')"
                        @handleClickCallBack="handlerAddPurchase">
                    </button-public>
                </el-col>
            </el-row>
        </template>
        <template>
          <slot>
            <el-table
                element-loading-text="loading"
                v-loading="isButtonLoading"
                :data="purchase_list_data"
                border>
                <el-table-column type="expand">
                        <template slot-scope="prop">
                            <el-table
                                :data="prop.row.items"
                                border>
                                <el-table-column label="#" type="index" width="40" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="product_spec_name" :label="$t('ProductName')" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="relevance_code" :label="$t('SKU')" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="status_name" :label="$t('ArrivalStatus')" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="purchase_price" :label="$t('Purchaseunitprice')" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="total_num.total_need_num" :label="$t('ArrivedPurchaseQty')" header-align="center" align="center" >
                                  <template slot-scope="scope">
                                    {{scope.row.confirm_num}}/{{scope.row.need_num}}
                                  </template>
                                </el-table-column>
                                <el-table-column  prop="last_confirm_date"  width="180" :label="$t('ArrivalDate')" header-align="center" align="center" >
                                    <template slot-scope="scope">
                                        <el-date-picker
                                          :disabled="scope.row.status === 3"
                                          style="width: 150px;"
                                          v-model="scope.row.last_confirm_date"
                                          value-format="yyyy-MM-dd"
                                          format="yyyy - MM - dd"
                                          type="date">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column  prop="confirm_num" :label="$t('ArrivedQty')" width="155" header-align="center" align="center" >
                                      <template slot-scope="scope">
                                          <el-input
                                              :disabled="scope.row.status === 3"
                                              v-model="scope.row.confirm_num">
                                          </el-input>
                                      </template>
                                </el-table-column>
                                <el-table-column  :label="$t('operation')" width="200" header-align="center">
                                      <template slot-scope="scope">
                                        <el-tooltip :content="$t('detail')" placement="top">
                                          <el-button
                                              size="mini" icon="el-icon-view" round
                                              @click="viewItemDetails(scope.row)"
                                              :loading="isButtonLoading">
                                          </el-button>
                                        </el-tooltip>
                                        <el-tooltip :content="$t('edit')" placement="top">
                                          <el-button
                                              size="mini"
                                              type="primary"
                                              icon="el-icon-edit"
                                              v-if="scope.row.status !== 3"
                                              @click="modifyItem(scope.row)" round
                                              :loading="isButtonLoading">
                                          </el-button>
                                        </el-tooltip>
                                        <el-tooltip :content="$t('Arrived')" placement="top">
                                          <el-button
                                              size="mini"
                                              icon="el-icon-success"
                                              v-if="scope.row.status !== 3"
                                              @click="finishedItem(scope.row)" round
                                              :loading="isButtonLoading">
                                          </el-button>
                                        </el-tooltip>
                                      </template>
                                </el-table-column>
                            </el-table>
                        </template>
                </el-table-column>
                <el-table-column label="#" type="index" width="40" header-align="center" align="center" ></el-table-column>
                <el-table-column  prop="purchase_code" :label="$t('PONumber')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="distributor.name_cn" :label="$t('supplier')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="created_date" :label="$t('purchaseDate')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="status_name" :label="$t('purchaseStatus')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="need_num" :label="$t('purchaseTotal')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="sub_total" :label="$t('purchaseMoney')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="confirm_num" :label="$t('purchaseRecevice')" width="155" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  :label="$t('operation')" width="200" header-align="center">
                      <template slot-scope="scope">
                        <el-tooltip :content="$t('detail')" placement="top">
                          <el-button
                              size="mini" icon="el-icon-view" round
                              @click="viewDetails(scope.row)"
                              :loading="isButtonLoading">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('Complete')" placement="top">
                          <el-button
                              size="mini"
                              type="primary"
                              icon="el-icon-sell"
                              v-if="scope.row.status !== 3"
                              @click="finishedPurchase(scope.row)" round
                              :loading="isButtonLoading">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('delete')" placement="top">
                          <el-button
                              size="mini" icon="el-icon-delete"
                              v-if="scope.row.status !== 3"
                              @click="deletePurchase(scope.row.id)"
                              type="danger" round
                              :loading="isButtonLoading">
                          </el-button>
                        </el-tooltip>
                      </template>
              </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="2" :offset="22">
                    <pagination-public
                        :class="$style.pagination"
                        :params="params"
                        @changePage="handlerChangePage">
                    </pagination-public>
                </el-col>
            </el-row>
          </slot>
        </template>
        <el-dialog
            width="90%"
            :center="true"
            :title="$t('purchaseOrderDetail')"
            :visible.sync="purcahseView">
            <div id="iframeHtml" v-if="purcahseView"></div>
            <el-row style="margin: 30px 0 0 0;">
              <el-col :span="2" :offset="11">
                  <el-button type="primary" :disabled="isDisabled" @click="handlerClick">{{$t('download')}}</el-button>
              </el-col>
            </el-row>
        </el-dialog>
        <el-dialog
            width="70%"
            :center="true"
            :title="$t('purchaseRecord')"
            :visible.sync="purcahItemsView">
            <el-row>
              <el-table :data="purcahItemsData">
                <el-table-column :label="$t('ArrivedQty')" prop="confirm_num"></el-table-column>
                <el-table-column :label="$t('PurchaseUnit')" prop="need_num"></el-table-column>
                <el-table-column :label="$t('purchaseArrived')" prop="confirm_num"></el-table-column>
                <el-table-column :label="$t('Operationdate')" prop="created_at"></el-table-column>
              </el-table>
            </el-row>
        </el-dialog>
    </listUI>
</template>

<script>
import $http from '@/api/index';
import baseApi from '@/lib/axios/base_api';
import listUI from '@/components/listUI';
import mixin from '@/mixin/form_config';
import buttonPublic from '@/components/buttonPublic';
import paginationPublic from '@/components/pagination-public';
import getNowDate from '@/lib/format/date';
import { createAnChildNode } from '@/lib/utils/index';
import purchaseListSearch from './components/purchaseListSearch';


export default {
  name: 'purchaseList',
  mixins: [mixin],
  components: {
    listUI,
    buttonPublic,
    purchaseListSearch,
    paginationPublic,
  },
  created() {
    this.getPurchaseListData();
  },
  computed: {
    api() {
      return this.$store.state.token.token.substring(7);
    },
  },
  data() {
    return {
      isDisabled: false,
      pdfData: '',
      pdfHTML: '',
      currentPageCache: 0, // 缓存当前页
      params: {
        total: 0,
        currentPage: 1,
      }, // 分页数据
      purchase_list_data: [],
      purcahseView: false,
      itemListData: [],
      itemListDataDetial: {},
      purcahItemsView: false,
      purcahItemsData: [],
      cache: {
        id: 0,
      },
    };
  },
  methods: {
    handlerClick() {
      this.isDisabled = true;
      setTimeout(() => {
        this.isDisabled = false;
      }, 200);
      window.open(`${baseApi}purchase/${this.cache.id}/download?api_token=${this.api}&lang`);
    },
    handlerChangePage(val) {
      this.getPurchaseListData(val);
    },
    viewItemDetails(row) {
      this.purcahItemsView = !this.purcahItemsView;
      $http.PurchaseDetailData(row.id, {
        warehouse_id: this.warehouseId,
      })
        .then((res) => {
          if (res.status) return;
          this.purcahItemsData = res.data.logs;
        });
    },
    modifyItem(row) {
      if (row.last_confirm_date === '0000-00-00') {
        row.last_confirm_date = getNowDate();
      }
      const data = {
        arrived_date: row.last_confirm_date,
        arrived_num: row.confirm_num,
      };
      if (data.arrived_num === 0) {
        this.$message({
          type: 'error',
          message: '本次到货数量必须大于0',
        });
        return;
      }
      if (!data.arrived_date) {
        this.$message({
          type: 'error',
          message: '到货日期必填',
        });
        return;
      }
      $http.editPurchaseItem(row.id, data).then((res) => {
        if (res.status) return;
        this.$message({
          type: 'success',
          message: this.$t('success'),
        });
        this.getPurchaseListData();
      });
    },
    finishedItem(row) {
      $http.finishePurchaseItem(row.id).then((res) => {
        if (res.status) return;
        this.$message({
          type: 'success',
          message: this.$t('success'),
        });
        this.getPurchaseListData();
      });
    },
    deletePurchase(id) {
      $http.delPurchase(id).then((res) => {
        if (res.status) return;
        this.handlerChangePage(this.currentPageCache);
      });
    },
    handlerCallBackData(res) {
      this.purchase_list_data = res.data.data;
      this.params.currentPage = res.data.current_page;
      this.currentPageCache = res.data.current_page;
      this.params.total = res.data.total;
    },
    handlerAddPurchase(flag) {
      if (!flag) return;
      this.$router.push({
        name: 'addPurchase',
      });
    },
    viewDetails(row) {
      this.purcahseView = !this.purcahseView;
      // eslint-disable-next-line
      this.$nextTick(() => {
        const iframeHtml = document.getElementById('iframeHtml');
        const iframe = createAnChildNode('iframe', {
          width: '100%',
          height: '500',
          frameBorder: '0',
          src: `${baseApi}purchase/${row.id}/pdf?api_token=${this.api}`,
        });
        iframeHtml.appendChild(iframe);
      });
    },

    finishedPurchase(row) {
      $http.finishePurchase(row.id, {
        warehouse_id: this.warehouseId,
      }).then((res) => {
        if (res.status) return;
        this.getPurchaseListData();
      });
    },
    getPurchaseListData(val) {
      const data = {
        warehouse_id: this.warehouseId,
      };
      if (val) {
        data.page = val;
      }
      $http.purchaseList(data).then((res) => {
        if (res.status) return;
        this.purchase_list_data = res.data.data;
        this.params.currentPage = res.data.current_page;
        this.currentPageCache = res.data.current_page;
        this.params.total = res.data.total;
      });
    },
  },
};
</script>

<style lang="less" module>
  .text {
    font-size: 14px;
    font-weight: 700;
    color: #909399;
    margin: 10px 0;
  }
  .dataList {
    margin: 0 0 20px 0;
  }
  .pagination {
    margin: 10px  0 10px 0;
    float: right;
  }
</style>
