<template>
  <div>
    <detail-dialog :visible.sync="inboundDialogVisible" :id.sync="batch_id"> </detail-dialog>
    <model-form :colValue="24">
      <!-- 入库单详情弹框 -->
      <el-form slot="left" :rules="rules" :model="form" label-width="100px" ref="form">
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col>
              <el-button
                @click="handlerDownload()"
                style="float:right"
                icon="el-icon-download"
                size="small"
              >
                下载
              </el-button>
              <el-button
                @click="handlerCancel()"
                style="float:right"
                icon="el-icon-circle-close"
                size="small"
                type="danger"
                v-if="inboundInfo.status !== 3"
              >
                取消订单
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <h2 align="center" style="margin:0px;">
          <div style="float:right">
            <div :class="$style.img">
              <img
                v-if="inboundInfo.batch_code_barcode"
                :src="inboundInfo.batch_code_barcode"
                :class="$style.inboundimg"
              />
            </div>
            <div>
              <span style="font-size:12px;" v-if="inboundInfo">{{ inboundInfo.batch_code }}</span>
            </div>
          </div>
          入库并上架
        </h2>
        <hr style="clear:both" />
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <el-form-item label="创建日期">
              <div>{{ inboundInfo.created_at }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('category')">
              {{ inboundInfo.batch_type.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 供应商 -->
            <el-form-item :label="$t('supplier')">
              {{ inboundInfo.distributor.name_cn }}
            </el-form-item>
          </el-col>
        </el-row>
        <hr />
        <!-- 入库单分类 -->
        <el-card class="box-card">
          <el-row :gutter="10" :class="$style.sku_input">
            <el-col :span="4">
              <el-input
                :placeholder="$t('PleaseenterorscanSKU')"
                @keyup.enter.native="check_sku()"
                v-model="sku_input"
                size="mini"
              >
                <i slot="suffix" class="iconfont" style="display: inline-block; margin: 8px 0 0 0;">
                  &#xe60b;
                </i>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button size="mini" @click="check_sku()">{{ $t('confirm') }}</el-button>
            </el-col>
          </el-row>
          <br />
          <el-table :data="inboundList" border v-loading="tableLoading">
            <el-table-column type="index" align="center" header-align="center" width="60">
            </el-table-column>
            <el-table-column
              :label="$t('cnName')"
              prop="spec.product_name"
              align="center"
              header-align="center"
            >
            </el-table-column>
            <el-table-column label="SKU" align="center" header-align="center" prop="relevance_code">
            </el-table-column>
            <el-table-column label="EAN" align="center" header-align="center" prop="ean">
            </el-table-column>
            <el-table-column
              :label="$t('Estimatednumberofwarehousing')"
              align="center"
              header-align="center"
              prop="need_num"
              width="144"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.need_num }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Actualwarehousingquantity')"
              align="center"
              header-align="center"
              prop="stockin_num"
            >
            </el-table-column>
            <el-table-column :label="$t('Rack')" align="center" header-align="center" prop="code">
            </el-table-column>
            <el-table-column :label="$t('operation')" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)">{{ $t('edit') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <button-pagination :pageParams="params"></button-pagination>
        </el-card>
        <hr />
        <!-- 提交按钮 -->
        <el-row :gutter="24">
          <el-col :span="18">
            <el-form-item :label="$t('remark')">
              <el-input
                v-model="inboundInfo.remark"
                type="textarea"
                rows="6"
                :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
                :maxlength="30"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际总数量:">
              <span style="font-size:18px; font-weight:bold">{{ getSubQty() }}</span>
            </el-form-item>
            <el-divider></el-divider>
            <el-button
              @click="toInbound"
              type="primary"
              :loading="isButtonLoading"
              style="width:100%;margin-bottom:15px;height:50px;"
            >
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </model-form>
    <el-dialog
      v-if="dialogVisible"
      :title="$t('goodsDetial')"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-row>
        <el-col :span="10" :offset="6">
          <el-form ref="form" :rules="rules" :model="form" size="small" label-width="144px">
            <el-form-item :label="$t('goodsName')">
              {{ form.product_name }}
            </el-form-item>
            <el-form-item label="SKU">
              {{ form.relevance_code }}
            </el-form-item>
            <el-form-item :label="$t('Inboundbatchnumber')">
              {{ form.sku }}
            </el-form-item>
            <el-form-item :label="$t('Numberofpreloaded')">
              {{ form.need_num }}
            </el-form-item>
            <el-form-item :label="$t('remark')">
              {{ form.remark }}
            </el-form-item>
            <el-form-item :label="$t('BoxCode')" prop="box_code">
              <el-input v-model="form.box_code" style="width: 310px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('EANCode')" prop="ean">
              <el-input v-model="form.ean" style="width: 310px;"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('ExpiryDate')"
              v-if="form.need_expiration_date"
              prop="expiration_date"
            >
              <el-date-picker
                v-model="form.expiration_date"
                style="width: 310px;"
                value-format="yyyy-MM-dd"
                format="yyyy - MM - dd"
                :placeholder="$t('Pleaseselectdate')"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('ProductionBatch')"
              v-if="form.need_production_batch_number"
              prop="production_batch_number"
            >
              <el-input v-model="form.production_batch_number" style="width: 310px;"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('bestUseTime')"
              v-if="form.need_best_before_date"
              prop="best_before_date"
            >
              <el-date-picker
                v-model="form.best_before_date"
                style="width: 310px;"
                value-format="yyyy-MM-dd"
                format="yyyy - MM - dd"
                :placeholder="$t('Pleaseselectdate')"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('Actualwarehousingquantity')" prop="stockin_num">
              <el-input v-model="form.stockin_num" style="width: 310px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Rack')" prop="code">
              <el-autocomplete
                v-model="form.code"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
              <el-tooltip :content="$t('moreRack')" placement="top">
                <i @click="handlerEmit" class="el-icon-more el-icon--right" :class="$style.spec">
                </i>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="handleEditConfirm">{{ $t('submit') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import ModelForm from '@/components/form';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';
import { OnlyNumber } from '@/lib/validateForm';
import mixin from '@/mixin/form_config';
import detailDialog from './inbound_detail';

export default {
  name: 'inboundShelf',
  mixins: [getListData, mixin],
  data() {
    const check = {
      stockin_num: (rule, value, callback) => {
        if (value < 0 || !OnlyNumber(value)) {
          callback(new Error(this.$t('Pleaseenterapositiveinteger')));
        } else {
          callback();
        }
      }
    };
    return {
      rules: {
        expiration_date: [
          { required: true, message: this.$t('Pleaseselectexpirydate'), trigger: 'blur' }
        ],
        production_batch_number: [
          { required: true, message: this.$t('Pleaseenterproductionbatch'), trigger: 'blur' }
        ],
        best_before_date: [
          { required: true, message: this.$t('Pleaseselectbestbeforedate'), trigger: 'blur' }
        ],
        stockin_num: [{ required: true, validator: check.stockin_num, trigger: 'blur' }],
        ean: [{ required: true, message: this.$t('PleaseenterEAN'), trigger: 'blur' }],
        code: [{ required: true, message: this.$t('Pleaseselectrack'), trigger: 'change' }]
      }, // 验证规则
      warehouse_shelfs: [], // 当前仓库的货位列表
      form: {}, // sku 弹窗表单数据
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
      stock: [
        {
          stock_id: '', // 库存id
          stockin_num: '', // 入库数量
          ean: '', // ean
          expiration_date: '', // 过期时间
          best_before_date: '', // 最佳体验期
          production_batch_number: '', // 生产批次号
          remark: '', // 备注
          code: '', // 货位编码
          box_code: '' // 箱子编码
        }
      ], // 库存信息
      //
      inboundInfo: {
        id: 0,
        batch_type: {
          name: ''
        }, // 中文名称
        batch_code_barcode: '', // 二维码链接
        batch_code: '', // 箱子条吗
        distributor: {
          name_cn: ''
        },
        warehouse: {
          name_cn: ''
        },
        created_at: '',
        remark: '',
        sub_total: 0,
        sub_qty: 0
      }, // 入库单信息
      remark: '', // 备注
      inboundList: [],
      tableLoading: false,
      order_status_list: [],
      warehouse_name: '',
      distributor_name: '',
      category_name: '',
      total_need_num: '',
      inboundDialogVisible: false,
      //
      need_expiration_date: '', // 过期时间标志
      need_best_before_date: '', // 最佳体验期标志
      need_production_batch_number: '', // 生产批次号标志
      timeout: null
    };
  },
  components: {
    buttonPagination,
    ModelForm,
    detailDialog
  },
  watch: {
    warehouseId() {
      this.getData();
    }
  },
  mounted() {
    this.batch_id = this.$route.query.batch_id;
    this.getData();
  },
  methods: {
    handlerCancel() {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteInbound(this.batch_id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success',
            showClose: true
          });
          this.$router.push({
            name: 'inboundList',
            query: {
              warehouse_id: this.warehouseId
            }
          });
        });
      });
    },
    handlerDownload() {
      this.inboundDialogVisible = true;
    },
    handlerEmit() {
      this.$confirm(this.$t('Thiswillleavethecurrentpagewillyoucontinue'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        if (!this.warehouseId) return;
        this.$router.push({
          name: 'areaAndShelf',
          query: {
            warehouse_id: this.warehouseId
          }
        });
      });
    },
    handleEditConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.editFlag) {
            this.form.stockin_num = `${this.form.stockin_num.replace(/\b(0+)/gi, '')}`; // 去除数字前面的零
            for (let i = 0; i < this.inboundList.length; i += 1) {
              if (this.inboundList[i].id === this.form.id) {
                this.inboundList[i].ean = this.form.ean;
                this.inboundList[i].stockin_num = this.form.stockin_num;
                this.inboundList[i].code = this.form.code;
              }
            }
          }
          this.form.editFlag = false; // 标志
          this.dialogVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: this.$t('Pleasecompletetheform')
          });
        }
      });
    },
    get_warehouse_shelf(keywords) {
      const whId = this.warehouseId;
      $http
        .getWarehouseshelf({
          warehouse_id: whId,
          page_size: 200,
          keywords
        })
        .then(res => {
          if (res.status) return;
          this.warehouse_shelfs = res.data.data;
        });
    }, // 获取货位列表(用于编辑)
    querySearchAsync(queryString, cb) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        $http
          .getWarehouseshelf({
            warehouse_id: this.warehouseId,
            page_size: 200,
            keywords: queryString
          })
          .then(res => {
            if (res.status) {
              cb([]);
              return;
            }
            cb(res.data.data.map(item => ({ value: item.code, label: item.code })));
          })
          .catch(() => {
            cb([]);
          });
      }, 1500 * Math.random());
    },
    handleSelect(item) {
      // console.log(item, 'item')
    },
    getSubQty() {
      let totalQty = 0;
      for (let i = 0; i < this.inboundList.length; i += 1) {
          totalQty += parseInt(this.inboundList[i].stockin_num);
      }
      return totalQty;
    },
    check_sku() {
      for (let i = 0; i < this.inboundList.length; i += 1) {
        if (+this.sku_input === +this.inboundList[i].relevance_code) {
          this.handleEdit(this.inboundList[i]);
        }
      }
    }, // 提交输入的SKU
    getData() {
      $http
        .getInboundDetail(this.$route.query.batch_id, { warehouse_id: this.warehouseId })
        .then(res => {
          const data = res.data;
          this.inboundInfo = data;
          this.batch_id = data.id;
          this.inboundList = data.batch_products; //货品(规格)列表
        });
    }, // 获取单个入库单信息
    handleEdit(row) {
      this.dialogVisible = true;
      this.form = row;
      this.form.product_name = row.spec.product_name;
      this.form.editFlag = true;
      // this.get_warehouse_shelf();
    }, // 编辑货品列表
    toInbound() {
      let arr = this.inboundList;
      let isPass = true;
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].ean === '' || arr[i].code === '') {
          isPass = false;
        }
      }
      if (!isPass) {
        this.$message({
          type: 'error',
          message: '请将货品列表填写完整!'
        });
        return;
      } // 填写不完整拦截
      const perStock = []; // 临时处理变量
      for (let i = 0; i < arr.length; i += 1) {
        let obj = new Object();
        obj.stock_id = arr[i].id;
        obj.stockin_num = arr[i].stockin_num;
        obj.ean = arr[i].ean;
        obj.expiration_date = arr[i].expiration_date;
        obj.best_before_date = arr[i].best_before_date;
        obj.production_batch_number = arr[i].production_batch_number;
        obj.remark = arr[i].remark;
        obj.code = arr[i].code;
        obj.box_code = arr[i].box_code;
        perStock.push(obj);
      }
      const perInfo = {
        warehouse_id: this.warehouseId,
        batch_id: this.inboundInfo.id,
        stock: perStock
      };
      $http.toInbound(perInfo).then(res => {
        if (res.status) return;
        this.$message({
          message: this.$t('success'),
          type: 'success',
          showClose: true
        });
        this.$router.push({ name: 'inboundList' });
      });
    }
  }
};
</script>

<style lang="less" module>
.inboundShelf {
  padding: 0 0 0 10px;
  margin: 10px 0 0 0;
  background-color: #ffffff;
  padding: 0 40px 0 40px;
}
</style>
