<template>
<div class="storeManage">
  <wms-tags>
    <my-group
    v-model="params"
    @submit="onSubmit">
      <el-col :span="5">
        <my-select keyName="category_id" placeholder="请选择分类">
          <el-option
            v-for="item in typeList"
            :label="item.name_cn"
            :value="item.id" :key="item.id">
          </el-option>
        </my-select>
      </el-col>
      <el-col :offset="3" :span="8">
        <my-date :begin.sync="params.updated_at_b"
          :end.sync="params.updated_at_e"></my-date>
      </el-col>
      <el-col :offset="2" :span="6">
        <my-input keyName="keywords"></my-input>
      </el-col>
    </my-group>
    <el-row>
      <el-col :span="2" :offset="15">
        <el-button
        @click="setGoodsType"
        size="medium">
           设置分类
        </el-button>
      </el-col>
      <el-col :span="2" :offset="1">
       <el-button
        @click="addCommodity"
        size="medium">
          {{$t('addGoods')}}
        </el-button>
      </el-col>
      <el-col :span="2" :offset="1">
       <el-button
        @click="importGoods"
        icon="el-icon-plus"
        type="text">
          导入货品Excel
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="goods_list_data"
      @selection-change="handleSelectionChange"
      border
      style="margin:10px auto 0;">
      <el-table-column
        type="selection"
        :selectable="checkSelectable"
        width="55">
      </el-table-column>
      <el-table-column type="expand">
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
              :label="$t('netWeight') + '(g)'">
            </el-table-column>
            <el-table-column
              prop="gross_weight"
              :label="$t('grossWeight') + '(g)'">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="name_cn"
        :label="$t('cnName')">
      </el-table-column>
      <el-table-column
        prop="name_en"
        :label="$t('enName')">
      </el-table-column>
      <el-table-column
        prop="category.name_cn"
        :label="$t('category')">
      </el-table-column>
      <el-table-column
        prop="owner.email"
        label="所属账号">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="最后修改时间">
      </el-table-column>
      <el-table-column
        width="170"
        :label="$t('operation')">
        <template slot-scope="scope">
          <el-button size="mini"
          @click="checkCommodity(scope.row.id, scope.row.warehouse_id)">详情</el-button>
          <el-button size="mini"
          type="danger" v-if="scope.row.owner.email === email"
          @click="editCommodity(scope.row.id, scope.row.warehouse_id)">
          {{$t('edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>
  <el-dialog
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-select v-if = "this.selectGoods.length > 0"
                 size="middle"
                 :class="$style.centerSelection"
                 v-model="selectCategory_id">
            <el-option
              v-for="item in typeList"
              :label="item.name_cn"
              :value="item.id" :key="item.id">
            </el-option>
      </el-select>
      <span v-else :class="$style.centerText">请先选择货品</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-if = "this.selectGoods.length > 0"
                   @click="centerDialogVisible = false">取 消
        </el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
  </el-dialog>
  <el-dialog
    :visible.sync="importVisible"
    title="导入货品Excel"
    width="40%"
    center>
    <div style="text-align:center;">
      <el-upload
        :class="$style.uploaddemo"
        :action=goodsapi
        :data=uploadData
        :on-success="handleSuccess"
        :headers="Authorization"
        name="file"
        :show-file-list="false">
        <el-button slot="trigger" size="medium" type="primary">导入货品表</el-button>
      </el-upload>
      <el-upload
        :class="$style.uploaddemo"
        :action=specapi
        :data=uploadData
        :on-success="handleSuccess"
        :headers="Authorization"
        name="file"
        :show-file-list="false">
        <el-button slot="trigger" size="medium" type="primary">导入货品规格表</el-button>
      </el-upload>
      <el-button size="medium" type="success" @click="downloadTemplate">下载模板</el-button>
    </div>
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
      // email: this.$store.state.token.vip_info && this.$store.state.token.vip_info.email,
      // warehouseId: this.$store.state.config.setWarehouseId,
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
  mounted() {
    this.uploadData.warehouse_id = this.warehouseId;
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId;
    },
    email() {
      return this.$store.state.token.vip_info && this.$store.state.token.vip_info.email;
    },
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    goodsapi() {
      return `${baseApi}product/import`;
    },
    specapi() {
      return `${baseApi}spec/import`;
    },
  },
  watch: {
    warehouseId() {
      this.getList();
      this.getTypeList();
    },
  },
  created() {
    this.getTypeList();
  },
  methods: {
    handleSelectionChange(val) {
      this.selectGoods = [];
      val.forEach((element) => {
        this.selectGoods.push({ id: element.id });
      });
      console.log(this.selectGoods);
    },
    checkSelectable(row) {
      return row.owner.email === this.email;
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
      // if (!this.warehouseId) return;
      if (!this.warehouseId || this.selectGoods.length === 0) {
        this.centerDialogVisible = false;
        return;
      }
      $http.setGoodscategory(
        { category_id: this.selectCategory_id,
          product_ids: this.selectGoods,
          warehouse_id: this.warehouseId },
      ).then((res) => {
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
      $http.categoryList(
        { page: 1, page_size: 100, is_enabled: 1, warehouse_id: this.warehouseId },
      ).then((res) => {
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
        },
      });
    },
    // 查看货品
    checkCommodity(idVal, wID) {
      this.$router.push({
        name: 'goodsEdit',
        query: {
          id: idVal,
          isCheck: true,
          warehouse_id: wID,
        },
      });
    },
    // 获取货品列表
    getList() {
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      $http.goodsList(this.params).then((res) => {
        this.goods_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';
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

