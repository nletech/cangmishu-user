<template>
          <div :class="$style.outboundList">
                <div  :class="$style.outboundList_main">
                      <el-row :class="$style.outboundList_tags">
                              <el-row  :class="$style.outboundList_tags">
                                       <el-col :span="4">
                                              <el-date-picker  v-model="date"
                                                               size="small"
                                                               type="date"
                                                               placeholder="选择日期">
                                              </el-date-picker>
                                       </el-col>
                                       <el-col  :span="4"
                                                :offset="2">
                                                <el-date-picker  v-model="outbound_date"
                                                                size="small"
                                                                type="date"
                                                                placeholder="预计出库日期">
                                               </el-date-picker>
                                       </el-col>
                                       <el-col  :span="4"
                                                :offset="2">
                                                <el-select  v-model="outbound_status"
                                                            size="small"
                                                            placeholder="请选择出库单状态">
                                                            <el-option  v-for="item in outbound_status_options"
                                                                        :key="item.value"
                                                                        :label="item.label"
                                                                        :value="item.value">
                                                            </el-option>
                                              </el-select>
                                       </el-col>
                                       <el-col  :span="6"
                                                :offset="2">
                                                <el-input  v-model="outbound_number_search"
                                                           size="small"
                                                           placeholder="请输入库单号">
                                                           <i  slot="suffix"
                                                               @click="handleOutboundSearch"
                                                               class="el-input__icon el-icon-search">
                                                           </i>
                                                </el-input>
                                       </el-col>
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
                                                   prop="order_code">
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
                                                                         @click="checkedOutbound(scope.row)">
                                                                         设为出库
                                                             </el-button>
                                                             <el-button  size="mini"
                                                                         style="margin: 0; pading: 0;"
                                                                         @click="cancelOrder(scope.row)">
                                                                         取消订单
                                                            </el-button>
                                                   </template>
                                 </el-table-column>
                      </el-table>
                      <el-pagination  v-show="+total"
                                      layout=" total, prev, pager, next, jumper"
                                      @current-change="handleCurrentChange"
                                      :current-page="currentPage"
                                      :total="+total">
                      </el-pagination>
                     <!-- 入库单详情弹框 -->
                     <DetailDialog  :visible.sync="outboundDialogVisible"
                                    :id="id">
                     </DetailDialog>
                </div>
          </div>
</template>

<script>
import $http from '@/api';
import DetailDialog from './components/outbound_detail';

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
      typeList: [
        { id: 0, name: '订单被取消' },
        { id: 1, name: '待拣货' },
        { id: 2, name: '拣货中' },
        { id: 3, name: '已拣货' },
        { id: 4, name: '待出库' },
        { id: 5, name: '配送中' },
        { id: 6, name: '已收货' },
      ],
    };
  },
  components: {
    DetailDialog,
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
      $http.getOutbound({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.outbound_list_data = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    }, // 获取出库单列表
    checkedOutbound(row) {
      const itemsArr = [];
      for (let i = 0; i < row.order_items.length; i += 1) {
        // eslint-disable-next-line
        let obj = new Object();
        obj.order_item_id = row.order_items[i].id;
        obj.pick_num = row.order_items[i].amount;
        itemsArr.push(obj);
      } // 这段代码是用于处理提交的数据
      const perForm = {
        order_id: row.id,
        warehouse_id: row.warehouse_id,
        items: itemsArr,
      }; // 与提交的表单
      $http.checkedOutbound(perForm)
        .then((res) => {
          if (res.status) return;
          console.log(res, 'checkedOutbound');
        });
    }, // 设为出库
    // 出库单详情弹框
    viewDetails(row) {
      this.outboundDialogVisible = true;
      this.id = row.id;
    },
    // 取消订单
    cancelOrder(row) {
      $http.cancelOutbound(row.id, { warehouse_id: row.warehouse_id })
        .then((res) => {
          if (res.status) return;
          this.getOutbounds();
          this.$message({
            type: 'success',
            message: res.msg,
          });
        })
        .catch((res) => {
          this.$message({
            type: 'error',
            message: res.msg,
          });
        });
    },
  },
};
</script>

<style lang="less" module>
.outboundList {
  text-align: right;
  margin: 20px 0 0 0 ;
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
