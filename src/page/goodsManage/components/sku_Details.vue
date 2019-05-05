<template>
  <el-dialog
    width="80%"
    @close="close"
    @update:visible="$emit('update:visible', $event)"
    :visible="value">
    <h1 class="details-h1">
      {{SkuList[0] && SkuList[0].sku}} 出入库记录
    </h1>
    <my-group
      v-model="params"
      @submit="getList">
      <el-col :span="7">
        <my-date :begin.sync="params.created_at_b"
          :end.sync="params.created_at_e"></my-date>
      </el-col>
      <el-col :span="6" :offset="11">
        <el-select
        clearable
        size="small"
        @change="typeChange"
        style="width: 100%" v-model="params.type_id">
          <el-option :value="1" label="入库"></el-option>
          <el-option :value="2" label="上架"></el-option>
          <el-option :value="3" label="拣货"></el-option>
          <el-option :value="4" label="出库"></el-option>
          <el-option :value="5" label="盘点"></el-option>
        </el-select>
      </el-col>
    </my-group>
    <el-table :data="SkuList" border style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="类型" prop="type">
      </el-table-column>
      <el-table-column label="操作数量" prop="operation_num">
      </el-table-column>
      <!-- <el-table-column label="上架数量">
        <template slot-scope="scope">
          <span v-if="scope.row.type_id === 2">{{scope.row.operation_num}}</span>
          <span v-else>/</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="sku_total_stockin_num" label="仓库库存">
      </el-table-column>
      <el-table-column prop="sku_total_shelf_num" label="上架库存">
      </el-table-column>
      <el-table-column prop="created_at" label="操作时间">
      </el-table-column>
      <el-table-column prop="order_sn" label="相关单号">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <!-- <el-table-column prop="operator" label="操作人">
      </el-table-column> -->
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>
  </el-dialog>
</template>

<script>
import buttonPagination from '@/components/pagination_and_buttons';
import $http from '@/api';
import getListData from '@/mixin/list';
import MyDate from '@/components/my_date';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';

export default {
  props: {
    value: Boolean,
    skuId: Number,
    warehouseId: String,
    warehouseName: String,
    rowInfo: Object,
  },
  components: {
    buttonPagination,
    MyDate,
    MyInput,
    MySelect,
    MyGroup,
  },
  mixins: [getListData],
  data() {
    return {
      SkuList: [],
      date: [],
      params: {
        type_id: '',
        created_at_b: '',
        created_at_e: '',
      },
    };
  },
  methods: {
    close() {
      this.params.page = 1;
      this.params.type_id = '';
      this.params.created_at_b = '';
      this.params.created_at_e = '';
      this.$emit('input', false);
    },
    typeChange() {
      this.getList();
    },
    // 拉取单个货品出入库记录
    getList() {
      this.SkuList = [];
      if (!this.skuId || !this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      this.params.stock_id = this.skuId;
      console.log(this.date[0]);
      console.log(this.params, 1);
      $http.skuInfo(this.params).then((res) => {
        this.SkuList = res.data.data;
        this.params.data_count = res.data.total;
        // this.warehouse_name = res.data.warehouse.name_cn;
        // this.distributor_name = res.data.distributor.name_cn;
        // this.category_name = res.data.batch_type.name;
      }).catch(() => {});
    },
  },
  watch: {
    // 如果ID发生变化则重新拉取记录
    skuId(val) {
      if (!val) return;
      this.getList();
    },
  },
};
</script>
<style lang="less">
.details-h1 {
  text-align: center;
}
</style>
