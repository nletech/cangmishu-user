<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <div :class="$style.stockTaking">
    <div :class="$style.stockTaking_main">
      <div :class="$style.stockTaking_table">
        <el-row type="flex" justify="space-between">
          <el-col :span="8"> </el-col>
          <el-col :span="7">
            <h2 align="center" style="margin:0px;">
              {{ $t('stockTakingList') }}
            </h2>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="12" :offset="4">
                <el-input
                  :disabled="isButtonLoading"
                  size="mini"
                  :placeholder="$t('PleasescanrackorSKUorinboundbatch')"
                  @keyup.enter.native="handlerKeyEnter"
                  v-model="searchContent"
                >
                </el-input>
              </el-col>
              <el-col :span="1" :offset="1">
                <el-button size="mini" :loading="isButtonLoading" @click="handlerCheckStock">
                  {{ $t('selectGoods') }}
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <hr />
        </el-row>
        <el-row> </el-row>
        <el-form>
          <el-form-item>
            <el-table :data="stock_list" border style="width:100%">
              <el-table-column label="#" type="index" header-align="center" align="center">
              </el-table-column>
              <el-table-column
                :label="$t('stocktalkingName')"
                prop="name_cn"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="SKU"
                prop="relevance_code"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :label="$t('Inboundbatchnumber')"
                prop="stock_sku"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :label="$t('Rack ')"
                prop="location_code"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :label="$t('Originalstock')"
                prop="shelf_num_orgin"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column :label="$t('InventoryCount')" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    size="mini"
                    :min="0"
                    :max="10000000"
                    :step="1"
                    v-if="scope.row"
                    v-model="scope.row.num"
                  >
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column :label="$t('operation')" header-align="center" width="180">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('delete')" placement="top">
                    <el-button
                      size="mini"
                      icon="el-icon-delete"
                      :loading="isButtonLoading"
                      @click="handleDelete(scope.row.id)"
                      type="danger"
                      round
                    >
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="$t('remark')">
            <el-input
              :disabled="isButtonLoading"
              type="textarea"
              v-model="remark"
              maxlength="500"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="2" :offset="22">
            <el-button
              :loading="isButtonLoading"
              style="margin-top: 20px;"
              type="primary"
              @click="onSubmit"
            >
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
      <select-spec
        @selected="handlerSelected"
        :warehouseId="this.warehouseId"
        :visible.sync="visibleSpec"
      >
      </select-spec>
      <el-dialog :visible.sync="visible" title="商品列表">
        <el-table :data="res" style="width: 100%" @selection-change="handlerSelectedSearch" border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column :label="$t('stocktalkingName')" prop="name_cn"></el-table-column>
          <el-table-column label="SKU" prop="relevance_code"></el-table-column>
          <el-table-column label="入库批次" prop="stock_sku"></el-table-column>
          <el-table-column label="所在货位" prop="location_code"></el-table-column>
          <el-table-column label="原库存" prop="shelf_num_orgin"></el-table-column>
        </el-table>
        <el-row>
          <el-col :span="2" :offset="22">
            <el-button
              :loading="isButtonLoading"
              style="margin-top: 20px;"
              type="primary"
              @click="handlerDialogSubmit"
            >
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import selectSpec from './selectSpec';

export default {
  name: 'addCheckStock',
  mixins: [mixin],
  components: {
    selectSpec
  },
  data() {
    return {
      res: [],
      visible: false,
      searchContent: '', // 搜索框
      visibleSpec: false, // 开关
      remark: '', // 备注
      row: {},
      row_data: {},
      id: 0,
      typeList: [],
      distributorList: [],
      stock_list: [], // 预提交列表
      stockListId: [],
      selectData: [] // 选择的商品
    };
  },
  methods: {
    handlerDialogSubmit() {
      this.handlerSelected(this.selectData);
      this.visible = false;
    },
    handlerSelectedSearch(val) {
      this.selectData = val;
    },
    handlerKeyEnter() {
      this.visible = true;
      this.onQueryInventory({
        warehouse_id: this.warehouseId,
        code: this.searchContent
      });
    },
    onQueryInventory(query) {
      $http.queryInventory(query).then(res => {
        if (res.status) return;
        this.res = res.data.data;
      });
    },
    onSubmit() {
      if (!this.warehouseId) return;
      if (!this.stock_list.length) return;
      let flag = false;
      for (let i = 0; i < this.stock_list.length; i += 1) {
        if (`${this.stock_list[i].num}` === 'undefined') {
          flag = true;
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '盘点数量必填'
        });
        return;
      }
      const stockArr = [];
      for (let i = 0; i < this.stock_list.length; i += 1) {
        const obj = Object.create(null);
        obj.id = this.stock_list[i].id;
        obj.num = this.stock_list[i].num;
        stockArr.push(obj);
      }
      const data = {
        warehouse_id: this.warehouseId,
        remark: this.remark,
        stock: stockArr
      };
      $http.addCheckStock(data).then(res => {
        if (res.status) return;
        this.$router.replace({
          name: 'stockTaking'
        });
      });
    }, // 提交
    handlerSelected(val) {
      if (!val.length) return;
      for (let i = 0; i < val.length; i += 1) {
        if (!this.stockListId.includes(val[i].id)) {
          this.stockListId.push(val[i].id);
          this.stock_list.push(val[i]);
        }
      }
    }, // 已选择回调
    handlerCheckStock() {
      this.visibleSpec = true;
    },
    checkStockList() {
      if (!this.warehouseId) return;
      $http.checkStockList({ warehouse_id: this.warehouseId }).then(res => {
        // eslint-disable-next-line
        if (res.status) return;
        // console.log(res, 'res');
      });
    },
    handleDelete(id) {
      for (let i = 0; i < this.stock_list.length; i += 1) {
        if (id === this.stock_list[i].id) {
          for (let j = 0; j < this.stockListId.length; j += 1) {
            if (this.stockListId[j] === id) {
              this.stockListId.splice(i, 1);
            }
          }
          this.stock_list.splice(i, 1);
        }
      }
    } // 删除
  }
};
</script>

<style lang="less" module>
.stockTaking {
  margin: @margin;
  .stockTaking_main {
    width: @width;
    margin: 0 auto;
    background-color: white;
  }
  .stockTaking_table {
    margin: 0 0 20px 0;
    padding: 20px;
  }
  .pagination {
    margin: 10px 0 0 0;
    float: right;
  }
}
</style>
