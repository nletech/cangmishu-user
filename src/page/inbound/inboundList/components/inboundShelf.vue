<template>
 <div :class="$style.inboundShelf">
      <el-row :gutter="10">
              <el-col :span="13">
                <span :class="$style.system_title">{{'仓秘书仓储系统'}}</span>
              </el-col>
              <!-- 入库单分类 -->
              <el-col :span="13">
                <span :class="$style.classify_title">入库单分类:</span>
                <span>{{inboundInfo.batch_type.name}}</span>
              </el-col>
              <!-- 二维码 -->
              <el-col :span="4"
                      :offset="3">
                      <img  alt="二维码"
                            v-if="inboundInfo.batch_code_barcode"
                            :src=inboundInfo.batch_code_barcode
                            :class="$style.inboundimg">
                      <span>{{inboundInfo.batch_code}}</span>
              </el-col>
      </el-row>
      <!-- 供应商 -->
      <el-row :gutter="10">
              <el-col :span="13">
                      <span :class="$style.classify_title">供应商:</span>
                      <span class="inbound_info">{{inboundInfo.distributor.name_cn}}</span>
              </el-col>
      </el-row>
      <!-- 创建日期 -->
      <el-row :gutter="10">
              <el-col :span="8">
                      <span :class="$style.classify_title">创建日期:</span>
                      <span class="inbound_info">{{inboundInfo.created_at}}</span>
              </el-col>
              <el-col :span="6"
                      :offset="8">
                      <span :class="$style.classify_title">{{'仓库:'}}&nbsp;&nbsp;&nbsp;{{inboundInfo.warehouse.name_cn}}</span>
              </el-col>
      </el-row>

      <!-- 输入SKU -->
      <el-row :gutter="10"
              :class="$style.sku_input">
              <el-col :span="4">
                      <el-input placeholder="请输入或扫描SKU"
                                v-model="sku_input"
                                size="mini">
                            <i slot="suffix"  class="iconfont"
                                              style="display: inline-block; margin: 8px 0 0 0;">
                                              &#xe60b;
                            </i>
                      </el-input>
              </el-col>
              <el-col :span="2">
                      <el-button  size="mini"
                                  @click="check_sku">
                                  确定
                      </el-button>
              </el-col>
      </el-row>

      <h3>货品列表</h3>
      <!-- 数据表 -->
      <el-table  :data="inboundList"
                  border
                  style="width: 90%"
                  v-loading='tableLoading'>
                  <!-- # -->
                  <el-table-column  type="index"
                                    align="center"
                                    header-align="center"
                                    width="60">
                  </el-table-column>
                  <!-- 中文名称 -->
                  <el-table-column  label="中文名称"
                                    prop="product_name_cn"
                                    align="center"
                                    header-align="center">
                  </el-table-column>
                  <!-- 外部编码 -->
                  <el-table-column  label="SKU"
                                    align="center"
                                    header-align="center"
                                    prop="relevance_code">
                  </el-table-column>
                  <!-- 预/已入库数量(个) -->
                  <el-table-column  label="预/已入库数量(个)"
                                    align="center"
                                    header-align="center"
                                    prop="need_num, total_stockin_num"
                                    width="120">
                                    <template slot-scope="scope">
                                              <span>{{scope.row.need_num}}/{{scope.row.total_stockin_num}}</span>
                                    </template>
                  </el-table-column>
                  <!-- 供应商货号 -->
                  <el-table-column  label="供应商货号"
                                    prop="distributor_code">
                  </el-table-column>
                  <!-- 每箱件数 -->
                  <el-table-column  label="箱子条码"
                                    align="center"
                                    header-align="center"
                                    prop="box_code">
                  </el-table-column>
                  <!-- EAN -->
                  <el-table-column  label="EAN"
                                    align="center"
                                    header-align="center"
                                    prop="ean">
                  </el-table-column>
                  <!-- 实际入库数量 -->
                  <el-table-column  label="实际入库数量"
                                    align="center"
                                    header-align="center"
                                    prop="stockin_num">
                  </el-table-column>
                  <!-- 货位 -->
                  <el-table-column  label="货位"
                                    align="center"
                                    header-align="center"
                                    prop="code">
                  </el-table-column>
                  <!-- 编辑 -->
                  <el-table-column  label="操作"
                                    align="center"
                                    header-align="center">
                                    <template slot-scope="scope">
                                      <el-button @click="handleEdit(scope.row)">编辑</el-button>
                                    </template>
                  </el-table-column>
      </el-table>

      <button-pagination :pageParams="params"></button-pagination>
      <!-- 备注 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <span :class="$style.classify_title">备注:</span>
          <span>{{inboundInfo.remark}}</span>
        </el-col>
      </el-row>
      <!-- 编辑规格信息弹框 -->
      <el-dialog  title="商品详细"
                  :visible.sync="dialogVisible"
                  width="36%">
                  <el-form  ref="form"
                            :model="form"
                            size="small"
                            label-width="120px">
                            <el-form-item label="商品名称">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="SKU">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="预入库数量(个)">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="供应商货号">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="备注">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="箱子条码信息">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="ENA码信息">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="商品保质期至">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="出产批次号">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="最佳食用期">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="入库数量">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="ENA码信息">
                                          <el-input v-model="form.name" style="width: 310px;"></el-input>
                            </el-form-item>
                            <el-form-item label="货位">
                                          <el-select  v-model="form.region"
                                                      style="width: 310px;"
                                                      placeholder="请选择货位">
                                                      <el-option label="区域一" value="shanghai" style="width: 310px;"></el-option>
                                          </el-select>
                            </el-form-item>
                  </el-form>
                  <span slot="footer"
                        class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                  </span>
      </el-dialog>

      <el-row :class="$style.toInbound">
        <el-col :span="10" :offset="10">
          <el-button round plain type="primary" @click="toInbound">确认入库上架</el-button>
        </el-col>
      </el-row>
 </div>
</template>

<script>
/* eslint-disable */
import $http from '@/api';
import baseApi from '@/lib/axios/base_api'
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  props: {
    visible: Boolean,
    id: Number,
  },
  data() {
    return {
      form: {},
      dialogVisible: false, // 对话框
      sku_input: '', // sku 输入
      //
      batch_id: '', // 入库单 id
      warehouse_id: '', // 仓库 id
      batch_code_barcode: '', // 入库单二维码
      batch_type_name: '', // 入库单分类名称
      batch_type_id: '', // 入库单分类 id
      created_at: '', // 创建日期
      distributor_name: '', // 供应商名称
      warehouse_name: '', // 仓库名称
      stock:[{
        stock_id: '', // 库存id
        stockin_num: '', // 入库数量
        distributor_code: '', // 供货商编号
        ean: '', // ean
        expiration_date: '', // 过期时间
        best_before_date: '', // 最佳体验期
        production_batch_number: '', // 生产批次号
        remark: '', // 备注
        code: '', // 货位编码
        box_code: '', // 箱子编码
      }],// 库存信息
      //
      inboundInfo: {
        batch_type: {
          name: '',
        },
        batch_code_barcode: '',
        batch_code: '',
        distributor: {
          name_cn: '',
        },
        warehouse: {
          name_cn: '',
        },
        created_at: '',
        remark: '',
      },
      inboundList: [],
      batch_id: '',
      tableLoading: false,
      order_status_list: [],
      warehouse_name: '',
      distributor_name: '',
      category_name: '',
      total_need_num: '',
    };
  },
  components: {
    buttonPagination,
  },
  mixins: [getListData],
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    warehouseId() {
      this.getList();
      // this.getTypeList();
    },
    id: {
      handler(value) {
        this.getList();
      },
      deep: true,
    },
    // 监听sku输入
  },
  created() {
    this.getData();
  },
  methods: {
    check_sku() {
      const skuId = +this.sku_input;
      const whId = this.warehouseId;
      $http.checkSku(skuId, { warehouse_id: whId })
        .then((res) => {
          if (res.status) return;
          console.log(res, 'checkSk res');
        })
        .catch(() => {});
    }, // 提交输入的SKU
    getData() {
      $http.getInboundDetail(this.$route.query.batch_id, { warehouse_id: this.warehouseId })
        .then((res) => {
          console.log(res, 'getInboundDetail');
          const data =  res.data;
          this.inboundInfo = data;
          this.inboundList = data.batch_products; //货品列表
          // this.inboundData = data.stocks;
          // this.inbound_list_data = res.data.data;
          // this.params.data_count = res.data.total;
        });
    }, // 获取单个入库单信息
    handleEdit(row) {
      this.dialogVisible = true;
    }, // 编辑
    // getList() {
    //   if (!this.id || !this.warehouseId) return;
    //   this.params.warehouse_id = this.warehouseId
    //   $http.inboundDetail(this.id, this.params)
    //     .then((res) => {
    //       this.inboundInfo = res.data;
    //       this.inboundInfo.operator_user = res.data.operator_user.nickname;
    //       this.params.data_count = res.data.product.total;
    //       this.inboundList = res.data.product.data;
    //       this.warehouse_name = res.data.warehouse.name_cn;
    //       this.distributor_name = res.data.distributor.name_cn;
    //       this.category_name = res.data.batch_type.name;
    //       this.total_need_num = res.data.total_num.total_need_num;
    //     });
    // },
    toInbound() {
      // $http.inboundDownload(this.id, this.api, this.warehouseId).then((res) => {
      //   console.log(res, 'res');
      //   this.$message({
      //     message: '下载成功!',
      //     type: 'success',
      //     showClose: true,
      //   });
      // });
    },
  },
};
</script>

<style lang="less" module>
.inboundShelf {
  margin: 10px 0 10px 0;
  padding: 0 100px 0 40px;
  // background-color: red !important;
  .system_title {
    font-size: 1.5rem;
    display: inline-block;
    margin: 40px 0 40px 0;
    font-weight: bold;
  }
  .classify_title {
    display: inline-block;
    margin: 10px 0 5px 0;
    font-size: 1.15rem;
    font-weight: bold;
  }
  .toInbound {
    margin: 20px 0 0 0;
  }
  .sku_input {
    margin: 15px 0 0 0;
  }
}
</style>
