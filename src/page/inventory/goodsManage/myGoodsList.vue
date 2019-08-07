<template>
<div :class="$style.page">
    <div :class="$style.main">
        <div :class="$style.header">
          <el-row>
              <!-- 请选择分类 -->
              <el-col :span="4">
                  <my-select
                      keyName="category_id"
                      placeholder="请选择分类">
                      <el-option
                          v-for="item in typeList"
                          :label="item.name_cn"
                          :value="item.id"
                          :key="item.id">
                      </el-option>
                  </my-select>
              </el-col>
              <!-- 搜索框 -->
              <el-col :offset="13"
                  :span="4">
                  <input-public :select="select_batch_code"
                                @data_cb="handlerInputQuery">
                  </input-public>
              </el-col>
              <!-- 添加货品 -->
              <el-col
                  :span="2"
                  :offset="1">
                  <el-button
                      icon="el-icon-plus"
                      type="text"
                      style="font-size: 1.2rem;"
                      @click="dialogVisible = true"
                      size="large">
                      {{$t('addGoods')}}
                  </el-button>
                  <!-- 弹窗 -->
                  <el-dialog
                      title="添加货品"
                      :visible.sync="dialogVisible"
                      width="30%">
                      <el-row>
                          <el-col :span="4">
                              <el-button
                                  @click="addCommodity"
                                  style="position: relative; top: 40px;"
                                  size="medium">
                                  {{'添加单个货品'}}
                              </el-button>
                          </el-col>
                          <el-col :span="1">
                                  <div :class="$style.line"></div>
                          </el-col>
                          <el-col
                              :span="6"
                              :offset="8">
                              <el-upload
                                  :class="$style.uploaddemo"
                                  :action=goodsapi
                                  :data=uploadData
                                  :on-success="handleSuccess"
                                  :headers="Authorization"
                                  name="file"
                                  :show-file-list="false">
                                  <el-button
                                      size="medium"
                                      style="width: 144px;"
                                      :class="$style.text_modify"
                                      @click="downloadTemplate">
                                      下载模板
                                  </el-button>
                              </el-upload>
                              <el-upload
                                :class="$style.uploaddemo"
                                :action=goodsapi
                                :data=uploadData
                                :on-success="handleSuccess"
                                :headers="Authorization"
                                name="file"
                                :show-file-list="false">
                                <el-button
                                    slot="trigger"
                                    style="width: 144px;"
                                    :class="$style.text_modify"
                                    size="medium">
                                    导入货品表
                                </el-button>
                              </el-upload>
                              <el-upload
                                  :data=uploadData
                                  :class="[$style.uploaddemo, $style.text_modify]"
                                  :action=specapi
                                  :on-success="handleSuccess"
                                  :headers="Authorization"
                                  name="file"
                                  :show-file-list="false">
                                  <el-button
                                      slot="trigger"
                                      style="width: 144px;"
                                      size="medium">
                                      导入货品规格表
                                  </el-button>
                              </el-upload>
                          </el-col>
                      </el-row>
                  </el-dialog>
              </el-col>
          </el-row>
        </div>
        <!-- 货品数据展示列表 -->
        <el-table
            :data="goods_list_data"
            @selection-change="handleSelectionChange"
            border
            style="margin:10px auto 0;">
            <!-- 右箭头 -->
            <el-table-column  type="expand">
                <template
                      slot-scope="props">
                      <el-table   :data="props.row.specs" border>
                        <el-table-column
                            type="index"
                            label="#"
                            header-align="center"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="relevance_code"
                            label="SKU"
                            header-align="center"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="name_cn"
                            :label="$t('specificationChineseName')"
                            header-align="center"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="name_en"
                            v-if="isEnabledLangInput()"
                            :label="$t('specificationEnglishName')"
                            header-align="center"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="gross_weight"
                            :label="$t('grossWeight') + '(g)'"
                            header-align="center"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="purchase_price"
                            label="进货价"
                            header-align="center"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="sale_price"
                            label="销售价"
                            header-align="center"
                            align="center">
                        </el-table-column>
                      </el-table>
                </template>
            </el-table-column>
            <!-- 中文名称 -->
            <el-table-column
                prop="name_cn"
                align="center"
                header-align="center"
                :label="$t('cnName')">
            </el-table-column>
            <!-- 外文名称 -->
            <el-table-column
                prop="name_en" v-if="isEnabledLangInput()"
                align="center"
                header-align="center"
                :label="$t('enName')">
            </el-table-column>
            <!-- 分类 -->
            <el-table-column
                prop="category.name_cn"
                align="center"
                header-align="center"
                :label="$t('category')">
            </el-table-column>
            <!-- 零售价 -->
            <el-table-column
                prop="purchase_price"
                align="center"
                header-align="center"
                label="进货价">
            </el-table-column>
            <!-- 零售价 -->
            <el-table-column
                prop="sale_price"
                align="center"
                header-align="center"
                label="零售价">
            </el-table-column>
            <!-- 最后修改时间 -->
            <el-table-column
                prop="updated_at"
                align="center"
                header-align="center"
                label="最后修改时间" width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.updated_at }}</span>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column  :label="$t('operation')" header-align="center" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top">
                        <el-button  size="mini" icon="el-icon-edit"
                                    @click="editCommodity(scope.row.id, scope.row.warehouse_id, scope.row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button  type="danger" size="mini" icon="el-icon-delete" @click="deleteCommodity(scope.row.id)">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div :class="$style.pagination">
            <button-pagination :pageParams="params"></button-pagination>
        </div>
    </div>
    <!-- 设置分类弹框 -->
    <el-dialog
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <el-select
            v-if="this.selectGoods.length > 0"
            size="middle"
            :class="$style.centerSelection"
            v-model="selectCategory_id">
            <el-option
                v-for="item in typeList"
                :label="item.name_cn"
                :value="item.id"
                :key="item.id">
            </el-option>
        </el-select>
        <span v-else :class="$style.centerText">请先选择货品</span>
        <span
            slot="footer"
            class="dialog-footer">
            <el-button
                v-if = "this.selectGoods.length > 0"
                @click="centerDialogVisible = false">
                取 消
            </el-button>
            <el-button
                type="primary"
                @click="handleSubmit">
                确 定
            </el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import getListData from '@/mixin/list';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import buttonPagination from '@/components/pagination_and_buttons';
import inputPublic from '@/components/input-public';
import mixin from '@/mixin/form_config';

export default {
  data() {
    return {
      goods_list_data: [], // 货品库列表
      typeList: [], // 分类列表
      selectGoods: [], // 选择商品
      centerDialogVisible: false,
      importVisible: false,
      importgoods: '',
      selectCategory_id: '',
      uploadData: {},
      dialogVisible: false,
      select_batch_code: {
        placeholder: '货品名或SKU',
        flag: 3,
      },
    };
  },
  components: {
    MyInput,
    MyGroup,
    MySelect,
    buttonPagination,
    inputPublic,
  },
  mixins: [getListData, mixin],
  filters: {
    is_warning_filter(val) {
      // eslint-disable-next-line
      switch (+val) {
        case 1:
          return '是';
        case 0:
          return '否';
      }
    },
  },
  created() {
    this.getTypeList();
  },
  mounted() {
    this.uploadData.warehouse_id = this.warehouseId;
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    goodsapi() {
      return `${baseApi}/products/import`;
    }, // 导入商品
    specapi() {
      return `${baseApi}/specs/import`;
    }, // 商品规格导入
  },
  watch: {
    warehouseId() {
      this.getList();
      this.getTypeList();
    },
    typeList() {
      this.getList();
    },
  },
  methods: {
    handlerInputQuery(res) {
      this.goods_list_data = res.data.data;
      this.params.data_count = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    handleSelectionChange(val) {
      this.selectGoods = [];
      val.forEach((element) => {
        this.selectGoods.push({ id: element.id });
      });
    },
    downloadTemplate() {
      window.open('/static/goodsList.zip');
    },
    // 上传截图回调
    handleSuccess(res) {
      if (res.status === 0) {
        this.$message({
          message: res.msg,
          type: 'success',
        });
        if (res.data[0].error[0]) {
          this.$message({
            message: res.data[0].error[0],
            type: 'warning',
          });
        }
        this.getList();
      } else if (res.msg) {
        this.$notify({
          message: res.msg,
          type: 'warning',
        });
      }
    },
    handleSubmit() {
      if (!this.warehouseId || this.selectGoods.length === 0) {
        this.centerDialogVisible = false;
        return;
      }
      $http.setGoodscategory(
        { category_id: this.selectCategory_id,
          product_ids: this.selectGoods,
          warehouse_id: this.warehouseId,
        },
      )
        .then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.centerDialogVisible = false;
          this.getList();
        });
    },
    setGoodsType() {
      this.centerDialogVisible = true;
    },
    importGoods() {
      this.importVisible = true;
    },
    // 货品分类列表
    getTypeList() {
      if (!this.warehouseId) return;
      $http.getCategoryManagement()
        .then((res) => {
          this.typeList = res.data.data;
        });
    },
    // 添加货品
    addCommodity() {
      this.$router.push({
        name: 'goodsAdd',
        query: {
          warehouse_id: this.warehouseId,
        },
      });
    },
    // 编辑货品
    editCommodity(idVal, wID) {
      this.$router.push({
        name: 'goodsEdit',
        query: {
          id: idVal,
          warehouse_id: wID,
          isCheck: true,
        },
      });
    },
    // 查看货品
    deleteCommodity(id) {
      this.$confirm('此操作将永久删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          $http.deleteProducts(id)
            .then((res) => {
              if (res.status) return;
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.getList();
            });
        });
    },
    getList() {
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      $http.getProducts(this.params)
        .then((res) => {
          if (res.status) return;
          this.goods_list_data = res.data.data;
          this.params.data_count = res.data.total;
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.page {
  margin: @margin;
  .main {
    width: @width;
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
        vertical-align: middle;
      }
    }
  }
}

.centerSelection {
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
}
.centerText {
  width: 100%;
  display: inline-block;
  font-size: 20px;
  text-align: center;
}
.uploaddemo {
  display: inline-block;
  text-align: center;
}
.text_modify {
  margin: 0 0 10px 0;
}
.line {
  position: relative;
  left: 100px;
  width: 2px;
  height: 120px;
  border-right: 1px solid #ccc;
}
</style>

