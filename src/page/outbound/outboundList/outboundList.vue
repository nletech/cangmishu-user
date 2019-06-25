<template>
          <div :class="$style.outboundList">
                <div  :class="$style.outboundList_main">
                      <el-row :class="$style.outboundList_tags">
                              <el-row  :class="$style.outboundList_tags">
                                       <!-- <el-col  :span="4">
                                                <date-picker-public @select_data="handlerSelect_data">
                                                </date-picker-public>
                                       </el-col>
                                       <el-col  :span="4"
                                                :offset="4">
                                                <date-picker-singe-public @select_data="handlerSelect_data">
                                                </date-picker-singe-public>
                                       </el-col>
                                       <el-col  :span="4"
                                                :offset="2">
                                                <select-public :select="select_data_distributor"
                                                               @data_cb="handlerQuery">
                                                </select-public>
                                       </el-col>
                                       <el-col  :span="4"
                                                :offset="2">
                                                <input-public :select="select_batch_code"
                                                              @data_cb="handlerInputQuery">
                                                </input-public>
                                       </el-col> -->
                                       <outbound-list-search @data_cb="handlerCallBackData"></outbound-list-search>
                              </el-row>
                              <el-row>
                                       <el-col>
                                               <el-button  type="text"
                                                           :class="$style.btn"
                                                           @click="addOutbound"
                                                           icon="el-icon-plus">
                                                           {{$t('addOutbound')}}
                                               </el-button>
                                       </el-col>
                              </el-row>
                      </el-row>
                      <el-table  :data="outbound_list_data"
                                 :class="$style.outboundList_table"
                                 border
                                 style="width:100%;">
                                 <el-table-column  label="#"
                                                   header-align="center"
                                                   align="center"
                                                   type="index">
                                 </el-table-column>
                                 <el-table-column  label="状态"
                                                   header-align="center"
                                                   align="center"
                                                   prop="status_name">
                                 </el-table-column>
                                 <el-table-column  label="出库单号"
                                                   header-align="center"
                                                   align="center"
                                                   prop="out_sn">
                                 </el-table-column>
                                 <el-table-column  label="运单号"
                                                   header-align="center"
                                                   align="center"
                                                   prop="express_num">
                                 </el-table-column>
                                 <el-table-column  label="出库单类型"
                                                   header-align="center"
                                                   align="center"
                                                   prop="order_type.name">
                                 </el-table-column>
                                 <el-table-column  label="出库数量"
                                                   header-align="center"
                                                   align="center"
                                                   prop="sum">
                                 </el-table-column>
                                 <el-table-column  label="创建时间"
                                                   header-align="center"
                                                   align="center"
                                                   prop="created_at">
                                 </el-table-column>
                                 <el-table-column  label="预计出库日期"
                                                   header-align="center"
                                                   align="center"
                                                   prop="delivery_date">
                                 </el-table-column>
                                 <el-table-column  label="操作"
                                                   header-align="center"
                                                   width="270">
                                                   <template slot-scope="scope">
                                                             <el-button  size="mini"
                                                                         style="margin: 0; pading: 0;"
                                                                         @click="viewDetails(scope.row)">
                                                                         查看详情
                                                             </el-button>
                                                             <el-button  size="mini"
                                                                         style="margin: 0; pading: 0;"
                                                                         v-if="scope.row.status === 0 || scope.row.status === 4 "
                                                                         @click="checkedOutbound(scope.row)">
                                                                         设为出库
                                                             </el-button>
                                                             <el-button  size="mini"
                                                                         style="margin: 0; pading: 0;"
                                                                         v-if="scope.row.status === 0 || scope.row.status === 4 "
                                                                         @click="cancelOrder(scope.row)">
                                                                         取消订单
                                                            </el-button>
                                                   </template>
                                 </el-table-column>
                      </el-table>
                      <pagination-public  :params="params"
                                          @changePage="handlerChangePage">
                      </pagination-public>
                     <!-- 入库单详情弹框 -->
                     <DetailDialog  :visible.sync="outboundDialogVisible"
                                    :id="id"
                                    :row_data="row_data">
                     </DetailDialog>
                </div>
          </div>
</template>

<script>
import paginationPublic from '@/components/pagination-public';
import $http from '@/api';
import datePickerPublic from '@/components/date-picker-public';
import selectPublic from '@/components/select-public';
import inputPublic from '@/components/input-public';
import datePickerSingePublic from '@/components/date-picker-singe-public';
import DetailDialog from './components/outbound_detail';
import outboundListSearch from './components/outboundListSearch';


export default {
  data() {
    return {
      date: '', // 查询日期
      outbound_date: '', // 预计出库日期
      outbound_status: '', // 出库状态
      outbound_status_options: '', // 出库状态选项列表
      outbound_list_data: [], // 出库单列表
      outbound_number_search: '', // 出库单号查询
      // 分页的参数
      total: '1', // 列表总条数
      currentPage: 1, // 当前页
      id: 0,
      outboundDialogVisible: false, // 出库单详情弹框
      params: {
        delivery_date: '',
      },
      row_data: {},
    };
  },
  components: {
    DetailDialog,
    datePickerPublic,
    datePickerSingePublic,
    selectPublic,
    inputPublic,
    outboundListSearch,
    paginationPublic,
  },
  created() {
    this.getOutbounds();
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    warehouseId() {
      this.getOutbounds();
    },
  },
  methods: {
    handlerChangePage(val) {
      $http.getInboundPage({ page: val })
        .then((res) => {
          this.outbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页回调
    handlerCallBackData(res) {
      this.outbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
      this.$set(this.params);
    }, // 搜索回调
    handlerQuery(res) {
      this.outbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 选择框回调
    handlerInputQuery(res) {
      this.outbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    handlerSelect_data(val) {
      console.log(val, '出入库');
      if (val && (Array.isArray(val) || typeof val === 'string')) {
        this.getOutbounds(val);
      } else {
        // 刷新列表
        this.getOutbounds();
      }
    }, // 创建时间筛选
    handleCurrentChange(val) {
      $http.checkOrder({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          if (res.status) return;
          this.outbound_list_data = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    }, // 分页
    handleOutboundSearch() {
      //
    }, // 搜索功能
    addOutbound() {
      this.$router.push({
        name: 'addOutbound',
      });
    }, // 添加出库单
    getOutbounds() {
      if (!this.warehouseId) return;
      $http.getOutbound({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.outbound_list_data = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    }, // 获取出库单列表
    checkedOutbound(row) {
      this.$router.push({
        name: 'setOutbound',
        query: {
          order_id: row.id,
        },
      });
    }, // 设为出库
    // 出库单详情弹框
    viewDetails(row) {
      this.outboundDialogVisible = true;
      this.id = row.id;
      this.row_data = row;
    },
    // 取消订单
    cancelOrder(row) {
      this.$confirm('确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          $http.cancelOutbound(row.id, { warehouse_id: row.warehouse_id })
            .then((res) => {
              if (res.status) return;
              this.getOutbounds();
              this.$message({
                type: 'success',
                message: res.msg,
              });
            });
        });
    },
  },
};
</script>

<style lang="less" module>
.outboundList {
  text-align: right;
  margin: 30px 0 20px 0 ;
  .outboundList_main {
    width: 90%;
    margin: 0 auto;
    .outboundList_tags {
      margin: 0 0 10px 0;
      .btn {
        font-size: 1.2rem;
      }
    }
    .outboundList_table {
      margin: 10px 0 0 0;
    }
  }
}
</style>
