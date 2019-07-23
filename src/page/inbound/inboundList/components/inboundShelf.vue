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
                                <span class="inbound_info" v-if="inboundInfo.distributor.name_cn">{{inboundInfo.distributor.name_cn}}</span>
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
                                <span :class="$style.classify_title" v-if="inboundInfo.warehouse.name_cn">{{'仓库:'}}&nbsp;&nbsp;&nbsp;{{inboundInfo.warehouse.name_cn}}</span>
                        </el-col>
                </el-row>

                <!-- 输入SKU -->
                <el-row :gutter="10"
                        :class="$style.sku_input">
                        <el-col :span="4">
                                <el-input  placeholder="请输入或扫描SKU"
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
                                              prop="product_name"
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
                            <!-- 箱子条码 -->
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
                            width="60%">
                            <el-row>
                                    <el-col :span="10" :offset="6">
                                            <el-form  ref="form"
                                                      :rules="rules"
                                                      :model="form"
                                                      size="small"
                                                      label-width="120px">
                                                      <el-form-item  label="商品名称">
                                                                    {{form.product_name}}
                                                      </el-form-item>
                                                      <el-form-item  label="SKU">
                                                                    {{form.relevance_code}}
                                                      </el-form-item>
                                                      <el-form-item  label="入库批次号">
                                                                    {{form.sku}}
                                                      </el-form-item>
                                                      <el-form-item  label="预入库数量(个)">
                                                                    {{form.need_num}}
                                                      </el-form-item>
                                                      <el-form-item  label="供应商货号">
                                                                    {{form.distributor_code}}
                                                      </el-form-item>
                                                      <el-form-item  label="备注">
                                                                    {{form.remark}}
                                                      </el-form-item>
                                                      <el-form-item  label="箱子条码信息"
                                                                    prop="box_code">
                                                                    <el-input v-model="form.box_code" style="width: 310px;"></el-input>
                                                      </el-form-item>
                                                      <el-form-item  label="EAN码信息"
                                                                     prop="ean">
                                                                    <el-input v-model="form.ean" style="width: 310px;"></el-input>
                                                      </el-form-item>
                                                      <el-form-item  label="商品保质期至"
                                                                     v-if="form.need_expiration_date"
                                                                     prop="expiration_date">
                                                                     <el-date-picker v-model="form.expiration_date"
                                                                                     style="width: 310px;"
                                                                                     value-format="yyyy-MM-dd"
                                                                                     format="yyyy - MM - dd"
                                                                                     placeholder="选择日期">
                                                                     </el-date-picker>
                                                      </el-form-item>
                                                      <el-form-item  label="出产批次号"
                                                                     v-if="form.need_production_batch_number"
                                                                     prop="production_batch_number">
                                                                     <el-input v-model="form.production_batch_number" style="width: 310px;"></el-input>
                                                      </el-form-item>
                                                      <el-form-item  label="最佳食用期"
                                                                     v-if="form.need_best_before_date"
                                                                     prop="best_before_date">
                                                                     <el-date-picker v-model="form.best_before_date"
                                                                                    style="width: 310px;"
                                                                                    value-format="yyyy-MM-dd"
                                                                                    format="yyyy - MM - dd"
                                                                                    placeholder="选择日期">
                                                                    </el-date-picker>
                                                      </el-form-item>
                                                      <el-form-item  label="实际入库数量"
                                                                    prop="stockin_num">
                                                                    <el-input v-model="form.stockin_num" style="width: 310px;"></el-input>
                                                      </el-form-item>
                                                      <el-form-item  label="货位"
                                                                    prop="code">
                                                                    <el-select  v-model="form.code"
                                                                                style="width: 310px;"
                                                                                placeholder="请选择货位">
                                                                                <el-option  v-for="(item, index) in warehouse_shelfs"
                                                                                            :key="index"
                                                                                            :disabled="!item.is_enabled"
                                                                                            :value="item.code"
                                                                                            style="width: 310px;">
                                                                                            {{item.code}}
                                                                                </el-option>
                                                                    </el-select>
                                                      </el-form-item>
                                            </el-form>
                                    </el-col>
                            </el-row>
                            <span slot="footer"
                                  class="dialog-footer">
                                  <el-button @click="dialogVisible = false">取 消</el-button>
                                  <el-button type="primary" @click="handleEditComfir">提 交</el-button>
                            </span>
                </el-dialog>

                <el-row>
                  <el-col :span="10" :offset="10">
                    <el-button round plain @click="toInbound" :class="$style.toInbound">确认入库上架</el-button>
                  </el-col>
                </el-row>
          </div>
</template>

<script>
/* eslint-disable */
import ModelForm from '@/components/form';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api'
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';
import { OnlyNumber } from '@/lib/validateForm';

export default {
  name: 'inboundShelf',
  data() {
    const check = {
      stockin_num: (rule, value, callback) => {
        if (value <= 0 || !OnlyNumber(value)) {
          callback(new Error('请输入整数'));
        } else {
          callback();
        }
      },
    };
    return {
      rules: {
        expiration_date: [
          {required: true, message: '请选择商品保质期', trigger: 'blur'},
        ],
        production_batch_number: [
          {required: true, message: '请输入出产批次号', trigger: 'blur'},
        ],
        best_before_date: [
          {required: true, message: '请选择最佳食用期', trigger: 'blur'},
        ],
        stockin_num: [
          { required: true, validator: check.stockin_num, trigger: 'blur'},
        ],
        ean: [
          {required: true, message: '请填写EAN', trigger: 'blur'},
        ],
        code: [
          {required: true, message: '请选择货位', trigger: 'change'},
        ],
      }, // 验证规则
      warehouse_shelfs: [], // 当前仓库的货位列表
      form: {},
      dialogVisible: false, // 对话框
      sku_input: '', // sku 输入
      total: 20, // 列表总条数
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
        }, // 中文名称
        batch_code_barcode: '', // 二维码链接
        batch_code: '', // 箱子条吗
        distributor: {
          name_cn: '',
        },
        warehouse: {
          name_cn: '',
        },
        created_at: '',
        remark: '',
      }, // 入库单信息
      remark: '', // 备注
      inboundList: [],
      batch_id: '',
      tableLoading: false,
      order_status_list: [],
      warehouse_name: '',
      distributor_name: '',
      category_name: '',
      total_need_num: '',
      //
      need_expiration_date: '', // 过期时间标志
      need_best_before_date: '', // 最佳体验期标志
      need_production_batch_number: '', // 生产批次号标志
    };
  },
  components: {
    buttonPagination,
    ModelForm,
  },
  mixins: [getListData],
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    warehouseId() {
      this.getData();
    },
    id: {
      handler(value) {
        this.getList();
      },
      deep: true,
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleEditComfir() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.editFlag) {
            this.form.stockin_num = `${this.form.stockin_num.replace(/\b(0+)/gi, "")}`; // 去除数字前面的零
            this.inboundList.push(this.form);
          }
          // console.log(this.form, '编辑后的表单');
          this.form.editFlag = false; // 标志
          this.dialogVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: '请填写完整',
          });
        }
      });
    },
    get_warehouse_shelf() {
      const whId = this.warehouseId;
      $http.getWarehouseshelf({ warehouse_id: whId })
        .then((res) => {
          if (res.status) return;
          this.warehouse_shelfs = res.data.data;
        });
    }, // 获取货位列表(用于编辑)
    check_sku() {
      const skuId = this.sku_input; // 输入的 sku
      const whId = this.warehouseId; // 当前仓库 id
      const batch_id = this.batch_id; // 入库单 id
      if (!skuId) return;
      $http.checkSku(skuId, {
        warehouse_id: whId,
        batch_id: batch_id,
      })
        .then((res) => {
          if (res.status) return;
          const data =  res.data;
          this.dialogVisible = true;
          this.get_warehouse_shelf(); // 获取货位列表
          this.form = data; //货品(规格)列表
        });
    }, // 提交输入的SKU
    getData() {
      $http.getInboundDetail(this.$route.query.batch_id, { warehouse_id: this.warehouseId })
        .then((res) => {
          const data =  res.data;
          this.inboundInfo = data;
          this.batch_id = data.id;
          // this.inboundList = data.batch_products; //货品(规格)列表
        });
    }, // 获取单个入库单信息
    handleEdit(row) {
      this.dialogVisible = true;
      this.form = row;
      this.form.editFlag = true;
      this.get_warehouse_shelf();
    }, // 编辑货品列表
    toInbound() {
      // const arr = this.inboundInfo.batch_products;
      const arr = this.inboundList;
      // console.log(arr, 'arr');
      const perStock = []; // 临时处理变量
      for (let i = 0; i < arr.length; i += 1) {
        let obj  = new Object();
        obj.stock_id = arr[i].id;
        obj.stockin_num = arr[i].stockin_num;
        obj.distributor_code = arr[i].distributor_code;
        obj.ean = arr[i].ean;
        obj.expiration_date = arr[i].expiration_date;
        obj.best_before_date = arr[i].best_before_date;
        obj.production_batch_number = arr[i].production_batch_number;
        obj.remark = arr[i].remark;
        obj.code = arr[i].code;
        obj.box_code = arr[i].box_code;
        perStock.push(obj);
      }
      // console.log(perStock, 'perStock');
      const perInfo = {
        warehouse_id: this.warehouseId,
        batch_id: this.inboundInfo.id,
        stock: perStock,
      }
      $http.toInbound(perInfo).then((res) => {
        if (res.status) return; 
        this.$message({
          message: '操作成功!',
          type: 'success',
          showClose: true,
        });
        this.$router.push({ name: 'inboundList' });
      });
    },
  },
};
</script>

<style lang="less" module>
.inboundShelf {
  margin: 10px 0 10px 0;
  padding: 0 100px 0 40px;
  background-color: white !important;
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
    background-color: #5745c5;
    color: #fff;
  }
  .sku_input {
    margin: 15px 0 0 0;
  }
}
</style>
