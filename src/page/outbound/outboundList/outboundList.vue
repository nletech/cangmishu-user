<template>
          <div :class="$style.outboundList">
                <div  :class="$style.outboundList_main">
                      <el-row :class="$style.outboundList_tags">
                              <el-row  :class="$style.outboundList_tags">
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
                                                   prop="status_name" width="128">
                                 </el-table-column>
                                 <el-table-column  label="出库单号"
                                                   header-align="center"
                                                   align="center"
                                                   prop="out_sn" width="150">
                                 </el-table-column>
                                 <el-table-column  label="运单号"
                                                   header-align="center"
                                                   align="center"
                                                   prop="express_num" width="150">
                                 </el-table-column>
                                 <el-table-column  label="类型"
                                                   header-align="center"
                                                   align="center"
                                                   prop="order_type.name" width="150">
                                 </el-table-column>
                                 <el-table-column  label="下单数量"
                                                   header-align="center"
                                                   align="center"
                                                   prop="sub_order_qty" width="150">
                                 </el-table-column>
                                 <el-table-column  label="出库数量"
                                                   header-align="center"
                                                   align="center"
                                                   prop="sub_pick_num" width="150">
                                 </el-table-column>
                                 <el-table-column  label="出库日期"
                                                   header-align="center"
                                                   align="center"
                                                   prop="delivery_date" width="150">
                                 </el-table-column>
                                 <el-table-column  label="创建时间"
                                                   header-align="center"
                                                   align="center"
                                                   prop="created_at" width="150">
                                 </el-table-column>
                                 <el-table-column  label="操作"
                                                   header-align="center"
                                                   width="200">
                                    <template slot-scope="scope">
                                      <el-tooltip content="查看详情" placement="top">
                                        <el-button size="mini" icon="el-icon-view" round
                                                    @click="viewDetails(scope.row)"
                                                    :loading="$store.state.config.button_loading"></el-button>
                                      </el-tooltip>
                                      <el-tooltip content="设为出库" placement="top">
                                        <el-button  size="mini" type="primary" icon="el-icon-sell" @click="checkedOutbound(scope.row)" round></el-button>
                                      </el-tooltip>
                                      <el-tooltip content="取消订单" placement="top">
                                        <el-button  size="mini" icon="el-icon-circle-close"
                                                         v-if="scope.row.status == 1"
                                                         @click="cancelOrder(scope.row.id)"
                                                         type="danger" round>
                                        </el-button>
                                      </el-tooltip>
                                  </template>
                                 </el-table-column>
                      </el-table>
                      <el-row>
                              <el-col :span="6" :offset="18">
                                      <pagination-public  :params="params"
                                                          @changePage="handlerChangePage">
                                      </pagination-public>
                              </el-col>
                      </el-row>
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
        total: 0,
        currentPage: 1,
      }, // 分页数据
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
      $http.getOutbound({
        warehouse_id: this.warehouseId,
        page: val,
      })
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
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
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
  text-align: left;
  margin: 30px 0 60px 0 ;
  .outboundList_main {
    width: 96%;
    margin: 0 auto;
    .outboundList_tags {
      text-align: right;
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
