<template>
    <el-dialog
        width="80%"
        @update:visible="$emit('update:visible', $event)"
        :visible="visible">
        <div  :class="$style.main">
            <h1  :class="$style.details_h1">
                {{rowInfo.sku}}出入库记录
            </h1>
            <el-row  :class="$style.header">
                    <el-col :span="6">
                            <date-picker-public @select_data="handlerSelect_data">
                            </date-picker-public>
                    </el-col>
                    <el-col  :span="4" :offset="14">
                            <select-public  :select="select_data_status"
                                            @data_cb="handlerQuery">
                            </select-public>
                    </el-col>
            </el-row>
            <el-table
                :data="SkuList"
                border
                style="width: 100%">
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column label="类型" prop="type">
                        </el-table-column>
                        <el-table-column label="操作数量" prop="operation_num">
                        </el-table-column>
                        <el-table-column prop="sku_total_stock_num" label="仓库库存">
                        </el-table-column>
                        <el-table-column prop="created_at" label="操作时间">
                        </el-table-column>
                        <el-table-column prop="order_sn" label="相关单号">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                        </el-table-column>
            </el-table>
            <pagination-public
                :params="params"
                :class="$style.pagination"
                @changePage="handlerChangePage">
            </pagination-public>
        </div>
    </el-dialog>
</template>

<script>
import selectPublic from '@/components/select-public';
import datePickerPublic from '@/components/date-picker-public';
import paginationPublic from '@/components/pagination-public';
import buttonPagination from '@/components/pagination_and_buttons';
import $http from '@/api';
import MyGroup from '@/components/my_group';

export default {
  props: {
    visible: Boolean,
    stock_id: Number,
    warehouseId: Number,
    warehouseName: String,
    rowInfo: Object,
  },
  components: {
    buttonPagination,
    MyGroup,
    selectPublic,
    datePickerPublic,
    paginationPublic,
  },
  data() {
    return {
      params: {}, // 分页数据
      select_data_status: {
        placeholder: '类型',
        options: [],
        cb_flag: 5,
        stock_id: '',
      },
      SkuList: [],
      date: [],
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.getDatas();
        this.getStockTypes();
      }
    },
  },
  methods: {
    getStockTypes() {
      $http.stocktypes().then((res) => {
        if (res.status) return;
        this.select_data_status.options = res.data;
      });
    },
    handlerSelect_data(val) {
      if (val && val.length === 2) {
        this.getDatas(val);
      } else {
        this.getDatas(); // 刷新列表
      }
    },
    handlerChangePage(val) {
      $http.getStocks({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          this.stockList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页响应
    handlerQuery(res) {
      this.SkuList = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 选择框回调
    getDatas(query) {
      this.SkuList = [];
      const obj = {};
      obj.warehouse_id = this.warehouseId; // 仓库 id 必填
      // query有几种形式
      if (Array.isArray(query)) {
        // 查询时间段
        obj.created_at_b = query[0]; // 开始时间
        obj.created_at_e = query[1]; // 结束时间
      }
      if (!this.stock_id || !this.warehouseId) return;
      $http.queryGoodsRecord(this.stock_id, obj)
        .then((res) => {
          this.SkuList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
          this.select_data_status.stock_id = this.stock_id;
        });
    }, // 拉取单个货品出入库记录
  },
};
</script>
<style lang="less" module>
.main {
  position: relative;
  margin: 0 0 40px 0;
  .details_h1 {
    text-align: center;
  }
  .header {
    margin: 30px 0 30px 0;
  }
  .pagination {
    position: absolute;
    bottom: -40px;
    right: 0;
  }
}
</style>
