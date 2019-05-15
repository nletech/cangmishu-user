<template>
<div class="inventoryManage">

  <wms-tags>
    <el-row :gutter="40">
      <el-form label-position="left" label-width="90px">
        <el-col :span="8">
          <el-form-item label="SKU">
            <el-input @keyup.enter="getList" v-model="params.sku" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="货品名称">
            <el-input v-model="params.product_name" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item >
            <el-button size="small"
            type="primary"
            :loading="$store.state.config.button_loading"
            @click="getList">搜索</el-button>
            <el-button
            size="small"
            :loading="$store.state.config.button_loading"
            @click="Reset">重置</el-button>
            <el-button
            icon="el-icon-plus"
            type="text"
            :loading="$store.state.config.button_loading"
            @click="dialogVisible = true">导出库存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      :data="stockList"
      border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
          :data="props.row.stocks"
          border>
            <el-table-column label="SKU" prop="sku">

            </el-table-column>
            <el-table-column label="BBD" prop="best_before_date">

            </el-table-column>
            <el-table-column label="保质期" prop="expiration_date">

            </el-table-column>
            <el-table-column label="生产批次号" prop="production_batch_number">

            </el-table-column>
            <el-table-column label="EAN" prop="ean">

            </el-table-column>
            <el-table-column label="仓库库存" prop="stockin_num">

            </el-table-column>
            <el-table-column label="未上架库存" prop="shelf_num_waiting">

            </el-table-column>
            <el-table-column label="上架库存" prop="shelf_num">

            </el-table-column>
            <el-table-column label="待验货库存" prop="to_be_verify">

            </el-table-column>
            <el-table-column label="盘点次数" prop="edit_count">

            </el-table-column>
            <el-table-column label="位置" prop="location_code">

            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                size="small"
                @click="skuDetails(scope.row.stock_id, props.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        label="货品名称">
        <template slot-scope="scope">
          {{scope.row.product_name}}
        </template>
      </el-table-column>
      <el-table-column
        label="中文规格">
        <template slot-scope="scope">
          {{scope.row.product_name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="relevance_code"
        label="SKU">
      </el-table-column>
      <el-table-column
        prop="stock_in_warehouse"
        label="仓库库存">
      </el-table-column>
      <el-table-column
        label="锁定/可用库存">
        <template slot-scope="scope">
          {{scope.row.reserved_num}} / {{scope.row.available_num}}
        </template>
      </el-table-column>
      <el-table-column
        label="入库次数/数量">
        <template slot-scope="scope">
          {{scope.row.stock_entrance_times}} / {{scope.row.stock_entrance_qty}}
        </template>
      </el-table-column>
      <el-table-column
        prop="stock_out_times"
        label="出库次数/数量">
        <template slot-scope="scope">
          {{scope.row.stock_out_times}} / {{scope.row.stock_out_qty}}
        </template>
      </el-table-column>
      <el-table-column
        prop="feature_name_cn"
        label="特征">
      </el-table-column>
      <el-table-column
        label="出入库记录">
        <template slot-scope="scope">
          <el-button size="mini" @click="viewDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>

  <!-- 出入库详情弹框 -->
    <DetailDialog
      :visible.sync="inventoryDialogVisible"
      :rowInfo="rowInfo"
      :warehouseId="warehouseId"
      :warehouseName="warehouseName"
      :id="id">
    </DetailDialog>

    <SkuDetails
    :skuId="sku_id"
    v-model="skuDetalisSwitch"
    :warehouseId="warehouseId"
    :warehouseName="warehouseName"
    :rowInfo="rowInfo"></SkuDetails>
    <el-dialog
      title="导出商品库存"
      :visible.sync="dialogVisible"
      width="500px">
      <el-checkbox-group v-model="export_data">
        <el-checkbox value="1" label="1">导出货品列表</el-checkbox>
        <el-checkbox value="2" label="2">导出SKU列表</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="exportStock">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import getListData from '@/mixin/list';
import WmsTags from '@/components/wms_tags';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import baseApi from '@/lib/axios/base_api';
import MyGroup from '@/components/my_group';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import DetailDialog from './components/inventory_detail';
import SkuDetails from './components/sku_Details';

export default {
  data() {
    return {
      checked: false,
      boundList: [], // 入库仓库列表
      stockList: [],
      id: 0,
      export_data: [],
      warehouseName: '',
      rowInfo: {},
      is_expiration_date: false, // 低于保质期
      is_warning_stock: false, // 低于库存报警
      dialogVisible: false,
      inventoryDialogVisible: false,
      skuDetalisSwitch: false,
      sku_id: 0,
      params: {
        sku: '',
        relevance_code: '',
        production_batch_number: '',
        product_name: '',
        option: '',
      },
    };
  },
  components: {
    DetailDialog,
    WmsTags,
    MyGroup,
    MySelect,
    MyInput,
    buttonPagination,
    SkuDetails,
  },
  mixins: [getListData],
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    },
    warehouseId() {
      return this.$store.state.config.setWarehouseId.toString();
    },
  },
  watch: {
    warehouseId() {
      this.getList();
    },
  },
  // created() {
  //   this.getLists();
  // },
  methods: {
    skuDetails(id, row) {
      this.skuDetalisSwitch = true;
      this.sku_id = id;
      this.rowInfo = row;
    },
    // 获取仓库列表
    // getLists() {
    //   $http.warehouse({ ...this.params, page_size: 100, from: 1, keywords: '' }).then((res) => {
    //     this.boundList = res.data.data;
    //     if (!res.data.data.length) return;
    //     if (!this.params.warehouse_id) {
    //       this.params.warehouse_id = this.$route.query.warehouse_id || this.boundList[0].id;
    //     }
    //   });
    // },
    // 导出库存
    exportStock() {
      // eslint-disable-next-line
      const exportParams = `&product_name=${this.params.product_name}&production_batch_number=${this.params.production_batch_number}&relevance_code=${this.params.relevance_code}&sku=${this.params.sku}&option=${this.params.option}`;
      if (this.export_data.length === 2) {
        window.open(`${baseApi}stock/export-sku?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
        window.open(`${baseApi}stock/export?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
      } else if (this.export_data[0] === '1') {
        window.open(`${baseApi}stock/export?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
      } else if (this.export_data.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择导出方式',
        });
      } else {
        window.open(`${baseApi}stock/export-sku?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
      }
    },
    // 库存管理列表
    getList() {
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      this.params.is_expiration_date = +this.is_expiration_date;
      this.params.is_warning_stock = +this.is_warning_stock;
      $http.stockList({
        ...this.params,
      }).then((res) => {
        this.stockList = res.data.data;
        this.params.data_count = res.data.total;
      }).catch({});
    },
    // 入库单详情弹框
    viewDetails(row) {
      this.inventoryDialogVisible = true;
      this.id = row.id;
      // this.warehouseId = this.params.warehouse_id;
      // this.boundList.forEach((item) => {
      //   if (item.id === this.warehouseId) {
      //     this.warehouseName = item.name_cn;
      //   }
      // });
      this.rowInfo = row;
    },
    Reset() {
      this.params.sku = '';
      this.params.relevance_code = '';
      this.params.production_batch_number = '';
      this.params.product_name = '';
      this.params.option = '';
      this.getList();
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.mycheck {
  height: 32px;
  line-height: 32px;
}
</style>
