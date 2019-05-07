<template>
<div class="inboundList">
  <wms-tags>
    <my-group
      v-model="params"
      @submit="onSubmit">
      <el-col
       :span="6"
      >
        <el-input
          placeholder="请扫描货位或者SKU"
        >
        <i
          style="color: #000;"
          class="iconfont el-input__icon"
          slot="suffix"
        >
          &#xe623;
        </i>
        </el-input>
      </el-col>
    </my-group>
    <el-table
      :data="inbound_list_data_mock"
      border
      style="width:100%"
    >
      <el-table-column
        header-align="center"
        align="center"
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="goodsName"
        label="货品名（规格）"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sku"
        label="SKU"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="locationInventory"
        label="货位库存"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="notOnShelvesNumber"
        label="未上架数"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="EAN"
        label="EAN码">
      </el-table-column>
      <el-table-column
        header-align="center"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini"
            @click="handleCheck(scope.row)"
            :loading="$store.state.config.button_loading"
          >
            盘点
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>
  <!-- 盘点弹框 -->
  <stock-taking-check
    :showCheck.sync="showCheckSwitch"
  >
  </stock-taking-check>
</div>
</template>

<script>
import buttonPagination from '@/components/pagination_and_buttons';
import getListData from '@/mixin/list';
import $http from '@/api';
import WmsTags from '@/components/wms_tags';
import MyGroup from '@/components/my_group';
import stockTakingCheck from './components/stockTakingCheck'; // 盘点弹框

export default {
  name: 'stockTaking',
  data() {
    return {
      showCheckSwitch: false,
      inbound_list_data_mock: [
        {
          goodsName: '货品名称mock11',
          sku: 'skuMock111',
          locationInventory: '货位库存mock111',
          notOnShelvesNumber: '111111',
          EAN: 'EANmock1111',
        }, {
          goodsName: '货品名称mock22',
          sku: 'skuMock22',
          locationInventory: '货位库存mock22',
          notOnShelvesNumber: '22',
          EAN: 'EANmock22',
        },
      ],
      inbound_list_data: [], // 入库单列表
      inbound_info: {},
      id: 0,
      typeList: [],
      distributorList: [],
    };
  },
  components: {
    WmsTags,
    MyGroup,
    buttonPagination,
    stockTakingCheck,
  },
  mixins: [getListData],
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId;
    },
  },
  watch: {
    warehouseId() {
      this.getList();
    },
  },
  created() {
    // this.getBoundList();
    this.getTypeList();
  },
  methods: {
    handleCheck(rowInfo) {
      console.log(rowInfo, 'rowInfo');
      this.showCheckSwitch = !this.showCheckSwitch;
    },
    getTypeList() {
      if (!this.warehouseId) return;
      const SelcetParams = {
        page: 1,
        page_size: 200,
        warehouse_id: this.warehouseId,
      };
      $http.batchType(SelcetParams).then((res) => {
        this.typeList = res.data.data;
      });
      $http.distributorList(SelcetParams).then((res) => {
        this.distributorList = res.data.data;
      });
    },
    // 获取入库单列表
    getList() {
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      $http.inboundList(this.params).then((res) => {
        this.inbound_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.util {
  text-align: right;
  margin: 20px;
}
.el-col {
  margin-bottom: 20px;
}
</style>
