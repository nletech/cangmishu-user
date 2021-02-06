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
  <div :class="$style.page">
    <div :class="$style.main">
      <div :class="$style.header">
        <el-row>
          <el-col :span="4">
            <input-public :select="select_batch_code" @data_cb="handlerInputQuery"></input-public>
          </el-col>
          <el-col :span="2" :offset="18">
            <el-button size="small" @click="addGoods" icon="el-icon-plus">{{
              $t('AddProduct')
            }}</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        element-loading-text="loading"
        v-loading="isButtonLoading"
        :data="goodsList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column
          type="selection"
          width="40"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('productImage')"
          header-align="center"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <img
              style="width: 40px; height: 40px; margin: 0 2px 0 2px;"
              v-for="(item, index) in scope.row.pics"
              :key="index"
              :src="item"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('ProductName2')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <el-popover transition placement="right" trigger="hover">
              <img
                v-if="scope.row.weapp_qrcode"
                style="width: 150px; height: 150px;"
                :src="scope.row.weapp_qrcode"
              />
              <i slot="reference" class="el-icon-view el-icon--right"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_price"
          :label="$t('sale')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updated_at"
          :label="$t('time')"
          header-align="center"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column :label="$t('PutOn')" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handlerShelfSlef($event, scope.row)"
              :loading="isButtonLoading"
              v-model="scope.row.is_shelf"
              :inactive-value="0"
              :active-value="1"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="200" header-align="center">
          <template slot-scope="scope">
            <el-tooltip :content="$t('edit')" placement="top">
              <el-button
                @click="editGoods(scope.row)"
                :loading="isButtonLoading"
                size="mini"
                icon="el-icon-edit"
                round
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('delete')" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                :loading="isButtonLoading"
                @click="delGoods(scope.row.id)"
                type="danger"
                round
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="8" style="position: relative; top: 8px;">
          <div v-if="this.goodsList.length">
            <span
              style="color: rgb(121, 106, 209);
                        font-weight: bold;
                        font-size: 1.2rem;"
              >{{ $t('Batchoperation') }}</span
            >
            <el-button
              size="mini"
              round
              :disabled="isSelected"
              :loading="isButtonLoading"
              style="display: inline; position: relative; left: 20px; top: 2px;"
              @click="handlerSeleteionAllInShelf"
              >{{ $t('PutOn') }}</el-button
            >
            <el-button
              size="mini"
              round
              :loading="isButtonLoading"
              :disabled="isSelected"
              style="display: inline; position: relative; left: 20px; top: 2px;"
              @click="handlerSeleteionAllOutShelf"
              >{{ $t('PutOff') }}</el-button
            >
            <el-button
              size="mini"
              round
              :disabled="isSelected"
              :loading="isButtonLoading"
              style="display: inline; position: relative; left: 20px; top: 2px;"
              @click="handlerSeleteionAllDelete"
              >{{ $t('delete') }}</el-button
            >
          </div>
        </el-col>
        <el-col :span="2" :offset="14">
          <pagination-public
            :class="$style.pagination"
            :params="params"
            @changePage="handlerChangePage"
          ></pagination-public>
        </el-col>
      </el-row>
    </div>
    <!-- 选择商品弹窗 -->
    <select-spec-dialog
      :visible.sync="dialogSpecShow"
      :warehouseId.sync="warehouseId"
      @selected="onSpecSelected"
    ></select-spec-dialog>
    <edit-goods-in-shop
      :visible.sync="dialogEditShow"
      @edit_finish_callback="edit_finish_callback"
      :row_data="row_data"
    ></edit-goods-in-shop>
  </div>
</template>

<script>
import mixin from '@/mixin/form_config';
import $http from '@/api';
import paginationPublic from '@/components/pagination-public';
import inputPublic from '@/components/input-public';
import selectSpecDialog from './components/selectSpec';
import editGoodsInShop from './components/editGoodsInShop';

export default {
  name: 'storeGoods',
  mixins: [mixin],
  components: {
    inputPublic,
    paginationPublic,
    selectSpecDialog,
    editGoodsInShop
  },
  data() {
    return {
      selectionList: [], // 批量选择
      shopName_cn: '',
      select_batch_code: {
        placeholder: 'ProductName2',
        flag: 1,
        shopId: this.isShopsOperation()
      },
      row_data: {},
      dialogEditShow: false,
      dialogSpecShow: false,
      params: { total: 1 }, // 分页数据
      goodsList: [] // 货品列表
    };
  },
  created() {
    this.getGoodsInShop();
  },
  computed: {
    isSelected() {
      return !this.selectionList.length;
    } // 是否已选择
  },
  methods: {
    handlerShelfSlef(val, row) {
      this.handlerShelf(this.isShopsOperation(), row.id, val);
    }, // 单个商品上下架
    handlerSeleteionAllInShelf() {
      this.handlerShelf(this.isShopsOperation(), this.selectionList, 1);
    }, // 批量上架
    handlerSeleteionAllOutShelf() {
      this.handlerShelf(this.isShopsOperation(), this.selectionList, 0);
    }, // 批量下架
    handlerSeleteionAllDelete() {
      this.delGoods(this.selectionList.toString());
    }, // 批量删除
    /*
     * @params shopId   { Number  }  店铺 id
     *         id       { Number  }  商品 id
     *         isShelf  { Number }  是否上下架 上架：1, 下架：0
     */
    handlerShelf(shopId, id, isShelf) {
      // eslint-disable-next-line
      let ArrayId = [];
      if (Array.isArray(id)) {
        // 如果是数组则合并
        ArrayId = id;
      } else {
        ArrayId.push(id);
      }
      $http
        .shelvesStatus(shopId, {
          is_shelf: isShelf,
          id: ArrayId
        })
        .then(res => {
          if (res.status) return;
          this.getGoodsInShop({ page: this.params.currentPage });
        });
    }, // 上下架单独方法
    handleSelectionChange(val) {
      this.selectionList = [];
      val.forEach(e => {
        this.selectionList.push(e.id);
      });
    },
    delGoods(id) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteGoodsInShop(this.$route.query.shopId, id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success',
            showClose: true
          });
          this.getGoodsInShop({ page: this.params.currentPage });
        });
      });
    },
    handlerInputQuery(res) {
      this.goodsList = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    edit_finish_callback(val) {
      if (!val) return;
      this.getGoodsInShop({ page: this.params.currentPage });
    },
    isShopsOperation() {
      return +this.$route.query.shopId;
    }, // 店铺 id
    onSpecSelected(data) {
      // eslint-disable-next-line
      let productsTemp = [];
      for (let i = 0; i < data.length; i += 1) {
        productsTemp.push(data[i].id);
      } // 预处理数据
      // eslint-disable-next-line
      let perData = {
        warehouse_id: this.$route.query.warehouse_id,
        products: productsTemp
      };
      $http.addGoodsToShop(this.$route.query.shopId, perData).then(res => {
        if (res.status) return;
        this.getGoodsInShop();
      });
    },
    handlerChangePage(val) {
      this.getGoodsInShop({ page: val });
    },
    getGoodsInShop(query) {
      const queryDate = {};
      if (query && query.page) {
        queryDate.page = query.page;
      }
      $http.goodsInShop(this.$route.query.shopId, queryDate).then(res => {
        this.goodsList = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    }, // 获取列表
    addGoods() {
      this.dialogSpecShow = true;
    },
    editGoods(row) {
      this.dialogEditShow = true;
      this.row_data = row;
    }
  }
};
</script>

<style lang="less" module>
.page {
  margin: @margin;
  .main {
    width: @width;
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
      }
    }
  }
}
.pagination {
  margin: 10px 0 0 0;
  float: right;
}
</style>
