<template>
    <listUI>
        <template v-slot:search>
            <el-row>
                <purchase-list-search @data_cb="handlerCallBackData"></purchase-list-search>
                <el-col :span="1" :offset="1">
                    <button-public
                        :loading="isButtonLoading"
                        :text="'添加采购单'"
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
                                <el-table-column  prop="status_name" :label="$t('到货状态')" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="purchase_price" :label="$t('进货单价元')" header-align="center" align="center" ></el-table-column>
                                <el-table-column  prop="total_num.total_need_num" :label="$t('到货数量/采购数量')" header-align="center" align="center" >
                                  <template slot-scope="scope">
                                    {{scope.row.confirm_num}}/{{scope.row.need_num}}
                                  </template>
                                </el-table-column>
                                <el-table-column  prop="last_confirm_date"  width="180" :label="$t('到货日期')" header-align="center" align="center" >
                                    <template slot-scope="scope">
                                        <el-date-picker
                                          style="width: 150px;"
                                          v-model="scope.row.last_confirm_date"
                                          value-format="yyyy-MM-dd"
                                          format="yyyy - MM - dd"
                                          type="date">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column  prop="confirm_num" :label="$t('本次到货数量')" width="155" header-align="center" align="center" >
                                      <template slot-scope="scope">
                                          <el-input v-model="scope.row.confirm_num"></el-input>
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
                                        <el-tooltip :content="$t('修改')" placement="top">
                                          <el-button
                                              size="mini"
                                              type="primary"
                                              icon="el-icon-edit"
                                              @click="modifyItem(scope.row)" round
                                              :loading="isButtonLoading">
                                          </el-button>
                                        </el-tooltip>
                                        <el-tooltip :content="$t('已到货')" placement="top">
                                          <el-button
                                              size="mini"
                                              icon="el-icon-success"
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
                <el-table-column  prop="purchase_code" :label="$t('采购单号')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="distributor.name_cn" :label="$t('supplier')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="created_date" :label="$t('purchaseDate')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="status_name" :label="$t('purchaseStatus')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="" :label="$t('purchaseTotal')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="" :label="$t('purchaseMoney')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="" :label="$t('purchaseRecevice')" width="155" header-align="center" align="center" >
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
                        <el-tooltip :content="$t('完成采购')" placement="top">
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
                              @click="purchaseDelete(scope.row.id)"
                              type="danger" round
                              :loading="isButtonLoading">
                          </el-button>
                        </el-tooltip>
                      </template>
              </el-table-column>
            </el-table>
            <el-row>
                <!-- <el-col :span="2" :offset="22">
                    <pagination-public
                        :class="$style.pagination"
                        :params="params"
                        @changePage="handlerChangePage">
                    </pagination-public>
                </el-col> -->
            </el-row>
          </slot>
        </template>
        <el-dialog
            width="70%"
            :center="true"
            title="详情"
            :visible.sync="purcahseView">
            <el-row>
              <el-col :class="$style.text" :span="8">发票号：{{itemListDataDetial.purchase_code}}</el-col>
              <el-col :class="$style.text" :span="8"></el-col>
              <el-col :class="$style.text" :span="8">NO：</el-col>
            </el-row>
            <el-row>
              <el-col :class="$style.text" :span="8" v-if="itemListDataDetial.distributor">供应商：{{itemListDataDetial.distributor.name_cn}}</el-col>
              <el-col :class="$style.text" :span="8" v-if="itemListDataDetial.warehouse">采购部门：{{itemListDataDetial.warehouse.name_cn}}</el-col>
            </el-row>
            <el-row>
              <el-table
                  border
                  :class="$style.dataList"
                  :data="itemListData">
                  <el-table-column label="#" type="index" ></el-table-column>
                  <el-table-column label="SKU编码" prop="relevance_code"></el-table-column>
                  <el-table-column label="货品名称" prop="product_spec_name"></el-table-column>
                  <el-table-column label="数量" prop="need_num"></el-table-column>
                  <el-table-column label="进货单价（元）" prop="purchase_price"></el-table-column>
                  <el-table-column label="金额（元）" prop=""></el-table-column>
                  <el-table-column label="到货数量" prop="confirm_num"></el-table-column>
              </el-table>
            </el-row>
            <el-row>
                <el-col :class="$style.text">
                  <span>备注:{{itemListDataDetial.remark}}</span>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :class="$style.text">制单日期：{{itemListDataDetial.created_at}}</el-col>
                <el-col :class="$style.text">采购人签名：</el-col>
            </el-row>
            <el-row style="margin: 30px 0 0 0;">
              <el-col :span="2" :offset="11">
                  <el-button type="primary">下载</el-button>
              </el-col>
            </el-row>
        </el-dialog>
        <el-dialog
            width="70%"
            :center="true"
            title="到货记录"
            :visible.sync="purcahItemsView">
            <el-row>
              <el-table :data="purcahItemsData">
                <el-table-column label="本次到货数量"></el-table-column>
                <el-table-column label="采购数量"></el-table-column>
                <el-table-column label="已到货数"></el-table-column>
                <el-table-column label="操作时间"></el-table-column>
              </el-table>
            </el-row>
            <el-row>
            </el-row>
        </el-dialog>
    </listUI>
</template>

<script>
import $http from '@/api/index';
import listUI from '@/components/listUI';
import mixin from '@/mixin/form_config';
import buttonPublic from '@/components/buttonPublic';
import purchaseListSearch from './components/purchaseListSearch';

export default {
  name: 'purchaseList',
  mixins: [mixin],
  components: {
    listUI,
    buttonPublic,
    purchaseListSearch,
  },
  created() {
    this.getPurchaseListData();
  },
  data() {
    return {
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
      $http.editPurchaseItem(row.id, {
        arrived_date: row.last_confirm_date,
        arrived_num: row.confirm_num,
      }).then((res) => {
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
    purchaseDelete(id) {
      $http.delPurchase(id).then((res) => {
        if (res.status) return;
        this.getPurchaseListData();
      });
    },
    handlerCallBackData() {
      //
    },
    handlerAddPurchase(flag) {
      if (!flag) return;
      this.$router.push({
        name: 'addPurchase',
      });
    },
    viewDetails(row) {
      if (row.id !== this.cache.id) { // 这里缓存了一下
        this.cache.id = row.id;
        $http.purchaseDetial(row.id, {
          warehouse_id: this.warehouseId,
        }).then((res) => {
          if (res.status) return;
          this.itemListData = res.data.items;
          this.itemListDataDetial = res.data;
          this.purcahseView = !this.purcahseView;
        });
      } else {
        this.purcahseView = !this.purcahseView;
      }
    },
    finishedPurchase(row) {
      $http.finishePurchase(row.id, {
        warehouse_id: this.warehouseId,
      }).then((res) => {
        if (res.status) return;
        this.getPurchaseListData();
      });
    },
    getPurchaseListData() {
      $http.purchaseList({
        warehouse_id: this.warehouseId,
      }).then((res) => {
        if (res.status) return;
        this.purchase_list_data = res.data.data;
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
</style>
