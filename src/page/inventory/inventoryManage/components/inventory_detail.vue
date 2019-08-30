<template>
    <el-dialog
        :title="this.warehouseName"
        width="80%"
        @update:visible="$emit('update:visible', $event)"
        :visible="visible">
        <div :class="$style.inventory_detail">
              <h1  :class="$style.details_h1">({{rowInfo.product_name}}) 出入库记录</h1>
              <el-row  :class="$style.header">
                        <el-col  :span="7">
                                <date-picker-public @select_data="handlerSelect_data">
                                </date-picker-public>
                        </el-col>
                        <el-col  :span="4" :offset="13">
                                <select-public :select="select_data_status"
                                              @data_cb="handlerQuery">
                                </select-public>
                        </el-col>
              </el-row>
              <el-table :data="inventoryList" border style="width: 100%">
                        <el-table-column label="类型">
                                        <template slot-scope="scope">
                                                  {{scope.row.type}}
                                        </template>
                        </el-table-column>
                        <el-table-column label="入库批次" prop="sku">
                        </el-table-column>
                        <el-table-column label="操作数量" prop="operation_num">
                        </el-table-column>
                        <el-table-column prop="spec_total_stock_num" label="总仓库库存">
                        </el-table-column>
                        <el-table-column prop="created_at" label="操作时间">
                        </el-table-column>
                        <el-table-column prop="order_sn" label="相关单号">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                        </el-table-column>
              </el-table>
              <el-row  :class="$style.pagination">
                      <pagination-public  :params="params"
                                          @changePage="handlerChangePage">
                      </pagination-public>
              </el-row>
        </div>
    </el-dialog>
</template>

<script>
// eslint-disable-next-line
import $http from '@/api';
import datePickerPublic from '@/components/date-picker-public';
import paginationPublic from '@/components/pagination-public';
import selectPublic from '@/components/select-public';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';

export default {
  props: {
    visible: Boolean,
    id: Number,
    rowInfo: Object,
    warehouseName: String,
  },
  components: {
    MySelect,
    MyGroup,
    paginationPublic,
    datePickerPublic,
    selectPublic,
  },
  data() {
    return {
      params: {
        total: 0,
      },
      select_data_status: {
        placeholder: '类型',
        options: [],
        cb_flag: 4,
        goods_id: '', // 规格 id
      },
      // 重写
      inventoryList: [],
      inventoryInfo: {},
      tableLoading: false,
      order_status_list: [],
      statusMap: {
        1: '入库上架',
        2: '出库',
        3: '盘点',
      },
      stockTypes: [],
    };
  },
  create() {
    this.getList();
  },
  watch: {
    // 如果ID发生变化则重新拉取记录
    id() {
      this.getList();
      this.getStockTypes();
    },
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    getStockTypes() {
      $http.stocktypes().then((res) => {
        if (res.status) return;
        this.stockTypes = res.data;
        this.select_data_status.options = this.stockTypes;
      });
    },
    handlerQuery(res) {
      this.inventoryList = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 选择框回调
    handlerSelect_data(val) {
      if (val && val.length === 2) {
        this.getList(val);
      } else {
        // 刷新列表
        this.getList();
      }
    }, // 用日期查询记录
    handlerChangePage(val) {
      $http.getStockLogs(this.id, {
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          this.inventoryList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页响应
    getList(query) {
      if (!this.id) return;
      const obj = {
        warehouse_id: this.warehouseId,
      };
      if (Array.isArray(query)) {
        // 查询时间段
        obj.created_at_b = query[0]; // 开始时间
        obj.created_at_e = query[1]; // 结束时间
      }
      $http.getStockLogs(this.id, obj)
        .then((res) => {
          this.inventoryList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
          this.select_data_status.goods_id = this.id;
        });
    }, // 出入库记录
    // 重写
  },
};
</script>

<style lang="less" module>
.inventory_detail {
  position: relative;
  margin: 0 0 40px 0;
  .header {
    margin: 30px 0 30px 0;
  }
  .details_h1 {
    text-align: center;
  }
  .pagination {
    position: absolute;
    bottom: -40px;
    right: 0;
  }
}
</style>
