<template>
    <div :class="$style.select_goods">
        <!-- 选择商品弹窗 -->
        <el-dialog
            title="选择商品"
            width="80%"
            min-width="1000px"
            :visible.sync="visible"
            :before-close="handleClose">
            <el-row :gutter="20" style="line-height:30px;">
              <el-col :span="5">请选择货品分类</el-col>
              <el-col :span="19">
                  <!-- 搜索框 -->
                  <el-row type="flex">
                    <el-col  :span="16">
                        <el-input placeholder="请输入关键词">
                            <el-button type="primary" icon="el-icon-search">搜索</el-button>
                        </el-input>
                    </el-col>
                    <!-- 添加商品 -->
                    <el-col :span="4" :offset="4" >
                      <div style="float:right">
                      <el-button @click="goToAddGoodPage" icon="el-icon-document-add"> 添加商品 </el-button>
                      </div>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
            <hr/>
            <el-row :gutter="20">
              <el-col :span="5" >
                  <el-tree
                    :props="{label:'name_cn'}"
                    :data="categoryListData"
                    default-expand-all
                    @node-click="onCategoryChange"
                    :expand-on-click-node="false"></el-tree>
              </el-col>
              <el-col :span="19"  style="border-left:1px solid #ccc">
                  <!-- 数据表 -->
                  <el-table
                      :data="specList"
                      ref="table"
                      border
                      @selection-change="specRowChange" style="width: 100%; margin-top:10px;">
                      <el-table-column type="selection" width="60" header-align="center" align="center"></el-table-column>
                      <el-table-column type="index" label="序号" width="60" header-align="center" align="center"></el-table-column>
                      <el-table-column type="index" label="数量" v-if="!isShopsOperation" width="160" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-input-number size="mini" :min="1" v-model="scope.row.need_num"></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column  label="商品名称及规格" prop="product_name" header-align="center" align="center"></el-table-column>
                      <el-table-column  label="参考进货价（元）" v-if="!isShopsOperation" prop="purchase_price" align="center"></el-table-column>
                      <el-table-column  label="参考销售价（元）" v-if="!isShopsOperation" prop="sale_price" align="center"></el-table-column>
                      <el-table-column  label="当前库存" prop="stockin_num" align="center"></el-table-column>
                  </el-table>
                  <button-pagination :pageParams="params" @changePage="handleCurrentChange"></button-pagination>
              </el-col>
            </el-row>
            <hr/>
            <el-row :gutter="20">
              <el-col :span="5">
                已添加{{specSelected.length}}种商品
              </el-col>
              <el-col :span="19" class="dialog-footer">
                <div style="float:right">
                  <el-button
                      type="primary"
                      @click="confirmSelected"
                      :loading="$store.state.btn_loading"
                      :disabled="!this.specSelected.length">
                      提交
                  </el-button>
                  <el-button @click="handleClose()">取消</el-button>
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

export default {
  name: 'selectSpec',
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
    isShopsOperation: {
      type: Number,
      default: 0,
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
    };
  },
  created() {
    this.loadCategoryList(); // 货品分类
    this.loadSpecDataList(); // 货品分类
  },
  methods: {
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
      $http.getCategoryManagement()
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
      this.$confirm('添加商品将会离开当前界面,确定?').then(() => {
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

