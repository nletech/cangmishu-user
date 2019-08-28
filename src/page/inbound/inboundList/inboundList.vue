<template>
    <div :class="$style.page">
        <div :class="$style.main">
            <div  :class="$style.header">
                  <el-row>
                      <inbound-list-search @data_cb="handlerCallBackData"></inbound-list-search>
                      <el-col :span="1" :offset="1">
                          <el-button
                              type="text"
                              :class="$style.header_btn"
                              size="small"
                              @click="addInbound"
                              icon="el-icon-plus"
                              :loading="isButtonLoading()">
                              {{$t('addInbound')}}
                          </el-button>
                      </el-col>
                  </el-row>
            </div>
            <el-table  :data="inbound_list_data" border>
                <el-table-column label="#" type="index" width="40" header-align="center" align="center" ></el-table-column>
                <el-table-column  prop="confirmation_number" label="单据编号" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="status_name" label="状态" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="batch_type.name" label="类型" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="distributor.name_cn" label="供应商" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="total_num.total_need_num" label="预计数量" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="total_num.total_stockin_num" label="实际数量" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="created_at" label="创建时间" width="155" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  label="操作" width="200" header-align="center">
                      <template slot-scope="scope">
                        <el-tooltip content="查看详情" placement="top">
                          <el-button
                              size="mini" icon="el-icon-view" round
                              @click="viewDetails(scope.row)"
                              :loading="isButtonLoading()">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip content="入库&上架" placement="top">
                          <el-button
                              size="mini"
                              type="primary"
                              icon="el-icon-sell"
                              v-if="scope.row.status !== 3"
                              @click="toInbound(scope.row)" round
                              :loading="isButtonLoading()">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                          <el-button
                              size="mini" icon="el-icon-delete"
                              v-if="scope.row.status !== 3"
                              @click="inboundDelete(scope.row.id)"
                              type="danger" round
                              :loading="isButtonLoading()">
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
        </div>
        <!-- 入库单详情弹框 -->
        <detail-dialog
            :visible.sync="inboundDialogVisible"
            :id="id">
        </detail-dialog>
    </div>
</template>

<script>
import datePickerPublic from '@/components/date-picker-public';
import paginationPublic from '@/components/pagination-public';
import selectPublic from '@/components/select-public';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import detailDialog from './components/inbound_detail';
import inboundListSearch from './components/inboundListSearch';

export default {
  mixins: [mixin],
  components: {
    detailDialog,
    datePickerPublic,
    selectPublic,
    paginationPublic,
    inboundListSearch,
  },
  data() {
    return {
      params: {
        total: 0,
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
        cb_flag: 0,
      },
      select_data_status: {
        placeholder: '入库单状态',
        options: [],
        cb_flag: 1,
      },
      select_data_distributor: {
        placeholder: '供应商',
        options: [],
        cb_flag: 2,
      },
      select_batch_code: {
        placeholder: '入库单号或确认单号',
        flag: 2,
      },
      //
      dateValue: [], // 选择时间
      inboundTypeValue: '',
      inboundTypeList: [],
      inboundStatus: '',
      inboundStatusList: [],
      distributorValue: '',
      distributorList: [],
      codeValue: '',
    };
  },
  created() {
    this.getBatchType();
    this.getData();
    this.getBatchStatus();
    this.getDistributors();
  },
  watch: {
    warehouseId() {
      this.getData();
    },
  },
  methods: {
    handlerCallBackData(res) {
      console.log(res, 'Cb_res');
      this.inbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
      this.$set(this.params);
    },
    handlerQuery(res) {
      this.inbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 选择框回调
    handlerInputQuery(res) {
      this.inbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    getBatchType() {
      $http.getBatchType({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.select_data_type.options = res.data.data;
        });
    }, // 入库单分类列表
    getBatchStatus() {
      this.select_data_status.options = this.statusList;
    }, // 入库单状态列表
    getDistributors() {
      $http.getDistributor()
        .then((res) => {
          if (res.status) return;
          this.select_data_distributor.options = res.data.data;
        });
    }, // 供应商列表
    handlerChangePage(val) {
      $http.getInboundPage({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          this.inbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    },
    handlerSelect_data(val) {
      if (val && val.length === 2) {
        this.getData(val);
      } else {
        // 刷新列表
        this.getData();
      }
    },
    getData(query) {
      if (!this.warehouseId) return;
      const obj = {};
      obj.warehouse_id = this.warehouseId; // 仓库 id 必填
      // query有几种形式
      if (Array.isArray(query)) {
        // 查询时间段
        obj.created_at_b = query[0]; // 开始时间
        obj.created_at_e = query[1]; // 结束时间
      }
      $http.getInbounds(obj)
        .then((res) => {
          this.inbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 获取列表
    // 以上重写
    toInbound(info) {
      // eslint-disable-next-line
      const batch_id = info.id;
      this.$router.push({
        name: 'inboundShelf',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
          batch_id, // 入库单 id
        },
      });
    }, // 入库上架
    // 添加入库单
    addInbound() {
      this.$router.push({
        name: 'addInbound',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
        },
      });
    },
    // 入库单详情弹框
    viewDetails(row) {
      this.inboundDialogVisible = true;
      this.id = row.id;
    },
    // 删除入库单
    inboundDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.deleteInbound(id)
          .then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true,
            });
            this.getData();
          });
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.page {
  margin: @margin;
  .main {
    width: @width;
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
      }
    }
  }
}
.pagination {
  margin: 10px 0 0 0;
  float: right;
}
</style>
