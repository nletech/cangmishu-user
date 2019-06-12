<template>
<div class="storeManage">
  <wms-tags>
          <my-group  v-model="params"
                     @submit="onSubmit">
                    <!-- 请选择分类 -->
                    <el-col :span="5">
                            <my-select  keyName="category_id"
                                        placeholder="请选择分类">
                                        <el-option  v-for="item in typeList"
                                                    :label="item.name_cn"
                                                    :value="item.id"
                                                    :key="item.id">
                                       </el-option>
                            </my-select>
                    </el-col>
                    <!-- 搜索框 -->
                    <el-col  :offset="2"
                             :span="6">
                             <my-input keyName="keywords"></my-input>
                    </el-col>
                    <!-- 添加货品 -->
                    <el-col :span="2"
                            :offset="6">
                            <el-button  v-if="isRole()"
                                        @click="dialogVisible = true"
                                        size="medium">
                                        {{$t('addGoods')}}
                            </el-button>
                            <!-- 弹窗 -->
                            <el-dialog  title="添加货品"
                                        :visible.sync="dialogVisible"
                                        width="30%">
                                        <el-row>
                                                <el-col :span="4">
                                                        <el-button  v-if="isRole()"
                                                                    @click="addCommodity"
                                                                    size="medium">
                                                                    {{'添加单个货品'}}
                                                        </el-button>
                                                </el-col>
                                                <el-col :span="6"
                                                        :offset="8">
                                                        <el-upload
                                                          :class="$style.uploaddemo"
                                                          :action=goodsapi
                                                          :data=uploadData
                                                          :on-success="handleSuccess"
                                                          :headers="Authorization"
                                                          name="file"
                                                          :show-file-list="false"
                                                        >
                                                          <el-button  slot="trigger"
                                                                      size="medium">
                                                                      导入货品表
                                                          </el-button>
                                                        </el-upload>
                                                        <el-button  size="medium"
                                                                    @click="downloadTemplate">
                                                                    下载模板
                                                        </el-button>
                                                        <el-upload  :data=uploadData
                                                                    :class="$style.uploaddemo"
                                                                    :action=specapi
                                                                    :on-success="handleSuccess"
                                                                    :headers="Authorization"
                                                                    name="file"
                                                                    :show-file-list="false">
                                                          <el-button  slot="trigger"
                                                                      size="medium">
                                                                    导入货品规格表
                                                          </el-button>
                                                        </el-upload>
                                                </el-col>
                                        </el-row>
                            </el-dialog>
                    </el-col>
          </my-group>
          <!-- 货品数据展示列表 -->
          <el-table  :data="goods_list_data"
                     @selection-change="handleSelectionChange"
                     border
                     style="margin:10px auto 0;">
                     <!-- 右箭头 -->
                    <el-table-column  type="expand">
                                      <template slot-scope="props">
                                        <el-table :data="props.row.specs" border style="width:80%;">
                                          <el-table-column
                                            prop="relevance_code"
                                            :label="$t('relevanceCode')">
                                          </el-table-column>
                                          <el-table-column
                                            prop="name_cn"
                                            :label="$t('specificationChineseName')">
                                          </el-table-column>
                                          <el-table-column
                                            prop="name_en"
                                            :label="$t('specificationEnglishName')">
                                          </el-table-column>
                                          <el-table-column
                                            prop="net_weight"
                                            :label="$t('netWeight') + '(g)'"
                                          >
                                          </el-table-column>
                                          <el-table-column
                                            prop="gross_weight"
                                            :label="$t('grossWeight') + '(g)'"
                                          >
                                          </el-table-column>
                                        </el-table>
                                      </template>
                    </el-table-column>
                    <!-- 中文名称 -->
                    <el-table-column  prop="name_cn"
                                      align="center"
                                      header-align="center"
                                      :label="$t('cnName')">
                    </el-table-column>
                    <!-- 外文名称 -->
                    <el-table-column  prop="name_en"
                                      align="center"
                                      header-align="center"
                                     :label="$t('enName')">
                    </el-table-column>
                    <!-- 分类 -->
                    <el-table-column  prop="category.name_cn"
                                      align="center"
                                      header-align="center"
                                      :label="$t('category')">
                    </el-table-column>
                    <!-- 最后修改时间 -->
                    <el-table-column  prop="updated_at"
                                      align="center"
                                      header-align="center"
                                      label="最后修改时间">
                                      <template slot-scope="scope">
                                                <i class="el-icon-time"></i>
                                                <span style="margin-left: 10px">{{ scope.row.updated_at }}</span>
                                      </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column  :label="$t('operation')"
                                      header-align="center"
                                      width="170">
                                    <template slot-scope="scope">
                                              <el-button  size="mini"
                                                          type="danger"
                                                          @click="editCommodity(scope.row.id, scope.row.warehouse_id, scope.row)">
                                                          {{$t('edit')}}
                                              </el-button>
                                              <el-button  size="mini"
                                                          @click="deleteCommodity(scope.row.id)">
                                                          删除
                                              </el-button>
                                    </template>
                    </el-table-column>
          </el-table>
          <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>
  <!-- 设置分类弹框 -->
  <el-dialog  :visible.sync="centerDialogVisible"
              width="30%"
              center>
              <el-select  v-if = "this.selectGoods.length > 0"
                          size="middle"
                          :class="$style.centerSelection"
                          v-model="selectCategory_id">
                          <el-option  v-for="item in typeList"
                                      :label="item.name_cn"
                                      :value="item.id"
                                      :key="item.id">
                          </el-option>
              </el-select>
              <span v-else :class="$style.centerText">请先选择货品</span>
              <span  slot="footer"
                     class="dialog-footer">
                     <el-button  v-if = "this.selectGoods.length > 0"
                                 @click="centerDialogVisible = false">
                                 取 消
                     </el-button>
                     <el-button  type="primary"
                                 @click="handleSubmit">
                                 确 定
                     </el-button>
              </span>
  </el-dialog>
</div>
</template>

<script>
import getListData from '@/mixin/list';
import WmsTags from '@/components/wms_tags';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import MyDate from '@/components/my_date';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import buttonPagination from '@/components/pagination_and_buttons';

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
    };
  },
  components: {
    WmsTags,
    MyInput,
    MyGroup,
    MyDate,
    MySelect,
    buttonPagination,
  },
  mixins: [getListData],
  created() {
    this.getTypeList();
  },
  mounted() {
    this.uploadData.warehouse_id = this.warehouseId;
  },
  computed: {
    warehouseId() {
      // 修复设置仓库问题
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
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
    addCommodity1() {
      console.log('添加货品');
    },
    isRole() {
      if (localStorage.getItem('role') && +localStorage.getItem('role') === 4) {
        return false;
      }
      return true;
    },
    handleSelectionChange(val) {
      // console.log(val);
      this.selectGoods = [];
      val.forEach((element) => {
        this.selectGoods.push({ id: element.id });
      });
    },
    // 选中设置
    checkSelectable(row) {
      //
      console.log(row, 'checkSelectable');
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
          console.log('上传有点问题:', res.data[0]);
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
      // if (!this.warehouseId) return;
      if (!this.warehouseId || this.selectGoods.length === 0) {
        this.centerDialogVisible = false;
        return;
      }
      $http.setGoodscategory(
        { category_id: this.selectCategory_id,
          product_ids: this.selectGoods,
          warehouse_id: this.warehouseId },
      )
        .then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
          });
          this.centerDialogVisible = false;
          this.getList();
        })
        .catch(() => {
          console.log('setGoodscategory');
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
        })
        .catch(() => {
          console.log('categoryList');
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
      $http.deleteProducts(id)
        .then((res) => {
          if (res.status) return;
          this.getList();
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
        })
        .catch((err) => {
          console.log(err);
          console.log('获取货品列表出错');
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
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
</style>

