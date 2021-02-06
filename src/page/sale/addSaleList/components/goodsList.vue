<template>
  <div :class="$style.goods_list">
    <el-input
      style="width:300px"
      placeholder="请扫码条码或SKU编号"
      size="mini"
      v-model="barcode"
      @keyup.enter.native="onBarcodeSubmit"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- -->
    <el-dialog title="请选择商品规格" :visible.sync="dialogSpecVisible">
      <el-alert title="存在多条记录,请选择一条" type="warning" show-icon></el-alert>
      <el-table :data="barcodeSearchSpecsResult" @row-click="handlePopoverSelectClient">
        <el-table-column
          :label="$t('ProductSpec')"
          prop="product_name"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('PurchasePrice')"
          prop="purchase_price"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('SalePrice')"
          prop="sale_price"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Stock')"
          prop="total_stock_num"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="confirmBarcodeSubmit(scope.row)">确定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 选择货品按钮 -->
    <el-button
      :class="$style.goods_list_btn"
      type="primary"
      plain
      @click="handleShowDialog"
      size="mini"
      icon="el-icon-more"
      style="float:right"
    >
      {{ $t('selectGoods') }}
    </el-button>
    <!-- 货品列表 -->
    <el-table
      :data.sync="specList"
      border
      style="width: 100%;"
      :empty-text="$t('pleaseSelectProductSpec')"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="index" label="#" width="80"> </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t('ProductSpec')">
        <template slot-scope="scope">
          {{ scope.row.product_name }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="SKU" prop="relevance_code">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :label="$t('SalePrice1')"
        prop="sale_price"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.sale_price"
            :precision="2"
            :step="0.1"
            :min="0"
            size="mini"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t('Number')" prop="need_num">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.need_num" :min="1" size="mini"> </el-input-number>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="金额" prop="need_num,sale_price">
        <template slot-scope="scope">
          {{ parseFloat(scope.row.need_num * scope.row.sale_price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip :content="$t('delete')" placement="top">
            <el-button
              size="mini"
              icon="el-icon-delete"
              @click="removeSpec(scope.$index)"
              type="danger"
              round
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选择商品弹窗 -->
    <select-spec
      :visible.sync="dialogShow"
      :warehouseId.sync="warehouseId"
      @selected="onSpecSelected"
      :onlyShowStock="true"
    >
    </select-spec>
  </div>
</template>

<script>
import $http from '@/api';
import selectSpec from '@/components/dialog/selectSpec';
import mixin from '@/mixin/form_config';

export default {
  name: 'specList',
  mixins: [mixin],
  components: {
    selectSpec
  },
  data() {
    return {
      dialogShow: false,
      scanType: 'barcode',
      barcode: '',
      dialogSpecVisible: false,
      specList: [],
      barcodeSearchSpecsResult: []
    };
  },
  methods: {
    confirmBarcodeSubmit(resSpec) {
      let specInfo = {
        id: resSpec.id,
        product_name: resSpec.product_name,
        sale_price: resSpec.sale_price,
        relevance_code: resSpec.relevance_code,
        need_num: 1
      };
      this.onSpecSelected([specInfo]);
      this.dialogSpecVisible = false;
    },
    onBarcodeSubmit() {
      $http
        .getProductsByScan({
          barcode: this.barcode
        })
        .then(res => {
          if (res.data.specs.length === 1) {
            res.data.specs[0].product_name = res.data.name_cn + res.data.specs[0].name_cn;
            this.confirmBarcodeSubmit(res.data.specs[0]);
            console.log('created');
          } else {
            res.data.specs.forEach(item => {
              item.product_name = res.data.name_cn + item.name_cn;
            });
            this.barcodeSearchSpecsResult = res.data.specs;
            this.dialogSpecVisible = true;
          }
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if ((index === 3 || index === 4) && !values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        if (index === 3) {
          sums[index] = Number(sums[index]).toFixed(2);
        } else if (index === 5) {
          let getTotal = 0;
          console.log(getTotal);
          this.specList.forEach(item => {
            getTotal += item.need_num * item.sale_price;
          });
          sums[index] = Number(getTotal).toFixed(2);
          this.$emit('getTotal', { total: getTotal, qty: isNaN(sums[4]) ? 0 : sums[4] });
        }
      });

      return sums;
    },
    onSpecSelected(data) {
      for (let i = 0; i < data.length; i += 1) {
        let found = false;
        if (isNaN(data[i].need_num)) {
          data[i].need_num = 1;
        }
        data[i].sub_total = data[i].need_num * data[i].sale_price;
        for (let j = 0; j < this.specList.length; j += 1) {
          if (data[i].id === this.specList[j].id) {
            found = true;
            break;
          }
        }
        if (!found) {
          this.specList.push(data[i]);
        }
      }
      this.$emit('get_data', this.specList);
    },

    removeSpec(index) {
      this.specList.splice(index, 1);
      this.$emit('get_data', this.specList);
    },

    handleShowDialog() {
      this.dialogShow = true;
    } // 打开选择商品弹窗
  }
};
</script>

<style lang="less" module>
.goods_list {
  .goods_list_btn {
    margin: 0 0 10px 0;
  }
}
</style>
