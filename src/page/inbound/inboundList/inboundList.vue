<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <listUI>
    <template v-slot:search>
      <inbound-list-search @queryParams="handlerCallBackData"></inbound-list-search>
      <button-public
        :loading="isButtonLoading"
        text="导入"
        @handleClickCallBack="$router.push({ name: 'inventoryImport' })"
      >
      </button-public>
    </template>
    <slot>
      <el-table
        element-loading-text="loading"
        v-loading="isButtonLoading"
        :data="inbound_list_data"
        border
      >
        <el-table-column
          label="#"
          type="index"
          width="40"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="confirmation_number"
          :label="$t('Numbers')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status_name"
          :label="$t('Status')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="batch_type.name"
          :label="$t('Type')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="distributor.name_cn"
          :label="$t('supplier')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_num.total_need_num"
          :label="$t('planNumber')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_num.total_stockin_num"
          :label="$t('realityNumber')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_purchase_price"
          label="总费用"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="$t('createdTime')"
          width="155"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column :label="$t('operation')" width="200" header-align="center">
          <template slot-scope="scope">
            <el-tooltip :content="$t('detail')" placement="top">
              <el-button
                size="mini"
                icon="el-icon-view"
                round
                @click="viewDetails(scope.row)"
                :loading="isButtonLoading"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('inboundAndShelf')" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-sell"
                v-if="scope.row.status !== 3"
                @click="toInbound(scope.row)"
                round
                :loading="isButtonLoading"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('delete')" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                v-if="scope.row.status !== 3"
                @click="inboundDelete(scope.row.id)"
                type="danger"
                round
                :loading="isButtonLoading"
              >
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
            @changePage="handlerChangePage"
          >
          </pagination-public>
        </el-col>
      </el-row>
    </slot>
    <!-- 入库单详情弹框 -->
    <detail-dialog :visible.sync="inboundDialogVisible" :id="id"> </detail-dialog>
  </listUI>
</template>

<script>
import paginationPublic from '@/components/pagination-public';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import listUI from '@/components/listUI';
import detailDialog from './components/inbound_detail';
import inboundListSearch from './components/inboundListSearch';

export default {
  name: 'inboundList',
  mixins: [mixin],
  components: {
    listUI,
    detailDialog,
    paginationPublic,
    inboundListSearch
  },
  data() {
    return {
      query: {},
      params: {
        total: 0
      }, // 分页数据
      inbound_list_data: [], // 入库单列表
      inboundDialogVisible: false, // 入库单详情弹框
      inbound_info: {},
      id: 0,
      boundList: [],
      select: [],
      typeList: [],
      // 子组件数据
      select_data_type: {
        placeholder: '入库单分类',
        options: [],
        cb_flag: 0
      },
      select_data_status: {
        placeholder: '入库单状态',
        options: [],
        cb_flag: 1
      },
      select_data_distributor: {
        placeholder: '供应商',
        options: [],
        cb_flag: 2
      },
      select_batch_code: {
        placeholder: '入库单号或确认单号',
        flag: 2
      },
      //
      dateValue: [], // 选择时间
      inboundTypeValue: '',
      inboundTypeList: [],
      inboundStatus: '',
      inboundStatusList: [],
      distributorValue: '',
      distributorList: [],
      codeValue: ''
    };
  },
  created() {
    this.getData();
  },
  watch: {
    warehouseId() {
      this.getData();
    }
  },
  methods: {
    handlerCallBackData(query) {
      this.query = query;
      this.getData(this.query);
    },
    handlerChangePage(val) {
      this.query.page = val;
      this.getData(this.query);
    },
    getData() {
      if (!this.warehouseId) return;
      this.query.warehouse_id = this.warehouseId; // 仓库 id 必填
      $http.getInbounds(this.query).then(res => {
        this.inbound_list_data = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    }, // 获取列表

    toInbound(info) {
      // eslint-disable-next-line
      const batch_id = info.id;
      this.$router.push({
        name: 'inboundShelf',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
          batch_id: batch_id // 入库单 id
        }
      });
    }, // 入库上架

    viewDetails(info) {
      const batch_id = info.id;
      this.$router.push({
        name: 'inboundDetail',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
          batch_id: batch_id // 入库单 id
        }
      });
    }, // 入库单详情弹框

    inboundDelete(id) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteInbound(id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success',
            showClose: true
          });
          this.getData();
        });
      });
    } // 删除入库单
  }
};
</script>

<style lang="less" module>
.pagination {
  margin: 10px 0 0 0;
  float: right;
}
</style>
