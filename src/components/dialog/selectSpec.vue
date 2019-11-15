<template>
    <div :class="$style.select_goods">
        <!-- 选择商品弹窗 -->
        <el-dialog
            :title="$t('selectGoods')"
            width="80%"
            min-width="1000px"
            :visible.sync="visible"
            :before-close="handleClose">
            <el-row :gutter="20" style="line-height:30px;">
              <el-col :span="5">{{$t('PleaseSelectCategory')}}</el-col>
              <el-col :span="19">
                  <!-- 搜索框 -->
                  <el-row type="flex">
                    <el-col  :span="16">
                        <el-input
                            clearable
                            v-model="keywords"
                            @clear="hanlderClearKeywords"
                            :placeholder="$t('PleaseEnterAKeyword')">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            <i slot="append" @click="handlerSearchKeyWords">{{$t('Search')}}</i>
                        </el-input>
                    </el-col>
                    <!-- 添加商品 -->
                    <el-col :span="4" :offset="4" >
                        <div style="float:right">
                        <el-button
                          :loading="isButtonLoading()"
                          @click="goToAddGoodPage"
                          icon="el-icon-document-add">
                          {{$t('AddProduct')}}
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
            <hr/>
            <el-row :gutter="20">
              <el-col :span="5" >
                  <span
                      style="cursor: pointer;"
                      @click="handlerAllCatergroy">
                      {{$t('AllCartory')}}
                  </span>
                  <el-tree
                    :props="{label:'name_cn'}"
                    :data="categoryListData"
                    default-expand-all
                    @node-click="onCategoryChange"
                    :expand-on-click-node="false">
                  </el-tree>
              </el-col>
              <el-col :span="19"  style="border-left:1px solid #ccc">
                  <!-- 数据表 -->
                  <el-table
                      element-loading-text="loading"
                      v-loading="isButtonLoading()"
                      :data="specList"
                      ref="table"
                      border
                      @selection-change="specRowChange"
                      style="width: 100%; margin-top:10px;">
                      <el-table-column type="selection" width="60" header-align="center" align="center"></el-table-column>
                      <el-table-column type="index" :label="$t('NO')" width="60" header-align="center" align="center"></el-table-column>
                      <el-table-column type="index" :label="$t('Number')" width="160" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-input-number size="mini" :min="1" :step="1" v-model="scope.row.need_num"></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column  :label="$t('ProductSpec')" prop="product_name" header-align="center" align="center"></el-table-column>
                      <el-table-column  :label="$t('PurchasePrice')" prop="purchase_price" align="center"></el-table-column>
                      <el-table-column  :label="$t('SalePrice')"  prop="sale_price" align="center"></el-table-column>
                      <el-table-column  :label="$t('Stock')" prop="total_stock_num" align="center"></el-table-column>
                  </el-table>
                  <button-pagination :pageParams="params" @changePage="handleCurrentChange"></button-pagination>
              </el-col>
            </el-row>
            <hr/>
            <el-row :gutter="20">
              <el-col :span="5">
                {{$t('productionType')}}{{specSelected.length}}
              </el-col>
              <el-col :span="19" class="dialog-footer">
                <div style="float:right">
                  <el-button
                      type="primary"
                      @click="confirmSelected"
                      :loading="isButtonLoading()"
                      :disabled="!this.specSelected.length">
                      {{$t('submit')}}
                  </el-button>
                  <el-button
                      @click="handleClose()"
                      :loading="isButtonLoading()">
                      {{$t('cancel')}}
                  </el-button>
                </div>
              </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import inputPublic from '@/components/input-public';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import buttonLoading from '@/mixin/buttonLoading';

export default {
  name: 'selectSpec',
  mixins: [buttonLoading],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onlyShowStock: {
      type: Boolean,
      default: false,
    },
    warehouseId: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  components: {
    buttonPagination,
    inputPublic,
  },
  data() {
    return {
      params: {
        page: 1,
        page_size: 10,
        data_count: 0,
      },
      specList: [], // 弹出框货品列表
      specSelected: [], // 弹出框选中货品
      categoryListData: [], // 商品分类列表
      categoryId: 0,
      keywords: '',
    };
  },
  created() {
    this.loadCategoryList(); // 货品分类
    this.loadSpecDataList(); // 货品分类
  },
  watch: {
    keywords() {
      const timer = setTimeout(() => {
        if (this.keywords === '') {
          this.hanlderClearKeywords();
          return;
        }
        this.loadSpecDataList();
        clearTimeout(timer);
      }, 300);
    },
  },
  methods: {
    handlerSearchKeyWords() {
      //
    },
    handlerAllCatergroy() {
      this.categoryId = 0;
      this.keywords = '';
      this.loadSpecDataList();
    },
    hanlderClearKeywords() {
      // 这里没有清除其他的复合查询参数
      this.loadSpecDataList(); // 规格
    },
    // 分页
    handleCurrentChange(pageId) {
      this.params.page = pageId;
      this.loadSpecDataList();
    },
    confirmSelected() {
      this.$emit('selected', this.specSelected); // 回传给父组件
      this.handleClose();
    },
    onCategoryChange(item) {
      this.categoryId = item.id;
      this.loadSpecDataList();
    },
    loadCategoryList() {
      if (!this.warehouseId) return;
      $http.getCategoryManagement({
        warehouse_id: this.warehouseId,
        page_size: 200,
      })
        .then((res) => {
          this.categoryListData = res.data.data;
        });
    }, // 加载所有分类
    loadSpecDataList() {
      if (!this.warehouseId) return;
      this.specList = [];
      const queryModel = Object.assign({ warehouse_id: this.warehouseId }, { ...this.params }); // 合并查询参数
      // 获取商品列表(商品是规格)
      if (this.categoryId > 0) {
        queryModel.category_id = this.categoryId;
      }
      if (this.keywords !== '') {
        queryModel.keywords = this.keywords.trim();
      }
      $http.querySpecs(queryModel)
        .then((res) => {
          this.specList = res.data.data;
          this.params.data_count = res.data.total;
        });
    }, // 获取商品列表
    onInputQuery(res) {
      this.specList = res.data.data;
      this.params.data_count = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // input搜索回调
    goToAddGoodPage() {
      this.$confirm(this.$t('addGoodsTips')).then(() => {
        this.$router.push({
          name: 'goodsAdd',
          query: { warehouse_id: this.warehouseId },
        });
      });
    },
    // 待入库货品弹出框
    specRowChange(items) {
      this.specSelected = [];
      for (const item of items) {
        this.specSelected.push(item);
      }
    },
    handleClose() {
      this.specSelected = [];
      this.$refs.table.clearSelection();
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="less" module>

.select_goods {
  .select_goods_btn {
    margin: 0 0 10px 0;
  }
  .pagination {
    margin: 10px 0 10px 0;
    float: right;
  }
  .submit_btn {
    margin: 10px 0 0 0;
  }
}
</style>

