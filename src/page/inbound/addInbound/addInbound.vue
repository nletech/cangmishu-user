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
  <div class="storeManage">
    <mdoel-form :colValue="24">
      <el-form slot="left" :rules="rules" :model="form" label-width="100px" ref="form">
        <h2 align="center" style="margin:0px;">
          {{ $t('addInbound') }}
        </h2>
        <hr />
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <el-form-item
              :label="$t('Numbers')"
              label-position="right"
              prop="confirmation_number"
              class="noborder"
            >
              <el-input
                v-model="form.confirmation_number"
                prefix-icon="el-icon-tickets"
                style="width:250px;"
              >
                <el-button slot="append" @click="getBatchCode" icon="el-icon-refresh"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('category')" label-position="right" prop="type_id">
              <el-select v-model="form.type_id">
                <el-option
                  v-for="item in batchTypeList"
                  :label="item.name"
                  :disabled="item.is_enabled === 0"
                  :value="item.id"
                  :key="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 供应商 -->
            <el-form-item
              :label="$t('supplier')"
              label-position="right"
              prop="distributor_id"
              style="float:right"
            >
              <el-select v-model="form.distributor_id" :placeholder="$t('Pleseselectsupplier')">
                <el-option
                  v-for="item in distributorSelectList"
                  :label="item.name_cn"
                  :value="item.id"
                  :key="item.id"
                >
                </el-option>
              </el-select>
              <el-button @click="onDistributor" icon="el-icon-more"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <hr />
        <!-- 入库单分类 -->
        <!-- 选择商品的列表 -->
        <el-card class="box-card">
          <el-row>
            <el-col>
              <el-input
                style="width:300px"
                placeholder="请扫码条码或SKU编号"
                size="mini"
                v-model="barcode"
                @keyup.enter.native="onBarcodeSubmit"
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <!-- 多项弹窗 -->
              <el-dialog title="请选择商品规格" :visible.sync="dialogSpecVisible">
                <el-alert title="存在多条记录,请选择一条" type="warning" show-icon></el-alert>
                <el-table :data="barcodeSearchSpecsResult" @row-click="handlePopoverSelectClient">
                  <el-table-column
                    :label="$t('ProductSpec')"
                    prop="product_name"
                    header-align="center"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('PurchasePrice')"
                    prop="purchase_price"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('SalePrice')"
                    prop="sale_price"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('Stock')"
                    prop="total_stock_num"
                    align="center"
                  ></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="confirmBarcodeSubmit(scope.row)"
                        >确定</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-button size="mini" @click="showDialog" type="primary" style="float:right" plain
                >{{ $t('pleaseSelect') }}<i class="el-icon-more el-icon--right"></i>
              </el-button>
              <div style="clear:both; height:10px;"></div>
              <el-table
                :data="specList"
                :empty-text="$t('pleaseSelect')"
                border
                show-summary
                :summary-method="getSummaries"
              >
                <el-table-column type="index" label="#" fixed width="100"> </el-table-column>
                <el-table-column
                  :label="$t('specName')"
                  prop="product_name"
                  width="200px"
                  fixed
                ></el-table-column>
                <el-table-column label="SKU" prop="relevance_code" width="150px"></el-table-column>
                <el-table-column :label="$t('inboundNumbers')" width="180px;">
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.need_num" :min="1">
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('PurcharsePrice')" min-width="80px">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.purchase_price"> </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="金额" width="120px" align="center">
                  <template slot-scope="scope">
                    {{ parseFloat(scope.row.purchase_price * scope.row.need_num).toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('remark')">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.remark"></el-input>
                  </template>
                </el-table-column>
                <el-table-column min-width="60px">
                  <template slot-scope="scope">
                    <el-tooltip :content="$t('delete')" placement="top">
                      <el-button
                        size="mini"
                        icon="el-icon-delete"
                        @click="removeGoods(scope.$index)"
                        type="danger"
                        round
                      >
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-card>
        <hr />
        <!-- 提交按钮 -->
        <el-row :gutter="24">
          <el-col :span="18">
            <el-form-item :label="$t('planInboundTime')">
              <el-date-picker
                v-model="startDate"
                type="date"
                :placeholder="$t('startDate')"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('remark')">
              <el-input
                v-model="form.remark"
                type="textarea"
                rows="6"
                :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
                :maxlength="30"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品数量:">
              <span style="font-size:18px; font-weight:bold">{{ form.sub_qty }}</span>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="总金额:">
              <span style="color:red; font-size:18px; font-weight:bold">{{
                form.sub_total.toFixed(2)
              }}</span>
            </el-form-item>
            <el-button
              @click="onSave('form')"
              type="primary"
              :loading="isButtonLoading"
              style="width:100%;margin-bottom:15px;height:50px;"
            >
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </mdoel-form>
    <!-- 选择商品弹窗 -->
    <select-spec-dialog
      :visible.sync="dialogSpecShow"
      :warehouseId.sync="warehouseId"
      @selected="onSpecSelected"
    >
    </select-spec-dialog>
    <!-- 供应商管理弹窗 -->
    <el-dialog
      :title="$t('distributorManagement')"
      :visible.sync="distributorListShow"
      @close="handlerDistributorListClose"
      width="80%"
    >
      <div class="distributor_main">
        <div :class="$style.distributorUtil">
          <el-button @click="addDistributor" size="large">
            {{ $t('add') }}
          </el-button>
        </div>
        <el-table :data="distributorList" border style="width: 100%">
          <el-table-column type="index" width="60" header-align="center" align="center">
          </el-table-column>
          <el-table-column
            prop="name_cn"
            :label="$t('distributorName')"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column :label="$t('operation')" width="200" header-align="center">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button @click="distributorEdit(scope.row)" size="small">
                {{ $t('edit') }}
              </el-button>
              <!-- 删除 -->
              <el-button @click="distributorDelete(scope.row.id)" type="danger" size="small" plain>
                {{ $t('delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin: 10px 0 0 0; float: right;"
          @current-change="distributorchange"
          :current-page="distributor.page"
          :page-size="distributor.size"
          layout="total, prev, pager, next, jumper"
          :total="+distributor.total"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 新增供应商弹窗 -->
    <el-dialog :visible.sync="distributorEditShow" @close="cancelDistributor" width="40%">
      <el-row :gutter="20" :class="$style.distributorEdit">
        <el-col :span="5">{{ $t('supplier') }}</el-col>
        <el-col :span="10">
          <el-input v-model="distributorInfo.name_cn"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDistributor">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="onDistributorSave">
          {{ $t('submit') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MdoelForm from '@/components/form';
import getListData from '@/mixin/list';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import selectSpecDialog from '@/components/dialog/selectSpec';

export default {
  components: {
    MdoelForm,
    selectSpecDialog
  },
  mixins: [getListData, mixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      form: {
        warehouse_id: '',
        type_id: '',
        batch_code: '',
        confirmation_number: '',
        distributor_id: '',
        remarks: '',
        transportation_type: '',
        waybill_number: '',
        sub_qty: 0,
        sub_total: 0
      },
      startDate: '',
      startTime: '',
      endTime: '',
      endDate: '',
      batchTypeList: [], // 入库单分类
      specList: [], // 选中货品列表
      dialogSpecShow: false, // 待入库货品弹出框
      distributorList: [], // 供应商列表
      distributorListShow: false, // 供应商列表对话框
      distributorEditShow: false, // 供应商编辑对话框
      isDistributorEdit: false, // 供应商编辑还是新增
      distributorInfo: {},
      distributorParams: {},
      // 以下重写
      distributor: {
        page: 0
      },
      dialogSpecVisible: false,
      barcode: '',
      distributorSelectList: [], // 供应商列表
      rules: {
        confirmation_number: [
          { required: true, message: this.$t('PleaseEnterNumber'), trigger: 'blur' }
        ],
        type_id: [{ required: true, message: this.$t('selectCart'), trigger: 'change' }],
        distributor_id: [
          { required: true, message: this.$t('Pleseselectsupplier'), trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.getBatchTypeList(); // 获取入库单分类
    this.getDistributorList(); // 获取供应商列表
    this.queryAllDistributor(); // 不带分页的所有供应商
    this.getBatchCode();
  },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index === 3 && !values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        if (index === 5) {
          let getTotal = 0;
          let getQty = 0;
          console.log(getTotal);
          this.specList.forEach(item => {
            getQty += item.need_num;
            getTotal += item.need_num * item.purchase_price;
          });
          sums[index] = Number(getTotal).toFixed(2);
          this.form.sub_qty = getQty;
          this.form.sub_total = getTotal;
        }
      });

      return sums;
    },
    confirmBarcodeSubmit(resSpec) {
      let specInfo = {
        id: resSpec.id,
        product_name: resSpec.product_name,
        purchase_price: resSpec.purchase_price,
        relevance_code: resSpec.relevance_code,
        need_num: 1
      };
      this.onSpecSelected([specInfo]);
      this.dialogSpecVisible = false;
    },
    onBarcodeSubmit() {
      $http
        .getProductsByScan({
          barcode: this.barcode
        })
        .then(res => {
          if (res.data.specs.length === 1) {
            res.data.specs[0].product_name = res.data.name_cn + res.data.specs[0].name_cn;
            this.confirmBarcodeSubmit(res.data.specs[0]);
            console.log('created');
          } else {
            res.data.specs.forEach(item => {
              item.product_name = res.data.name_cn + item.name_cn;
            });
            this.barcodeSearchSpecsResult = res.data.specs;
            this.dialogSpecVisible = true;
          }
        });
    },
    handlerDistributorListClose() {
      this.queryAllDistributor();
      for (let i = 0; i < this.distributorSelectList.length; i += 1) {
        if (this.distributorSelectList[i].id === this.form.distributor_id) {
          this.form.distributor_id = this.distributorSelectList[i].id;
        }
      }
    },

    getBatchCode() {
      $http
        .getBatchCode({
          warehouse_id: this.warehouseId
        })
        .then(res => {
          this.form.confirmation_number = res.data.batch_code;
        });
    }, // 获取批次号

    queryAllDistributor() {
      $http.queryDistributor({ all: 1 }).then(res => {
        this.distributorSelectList = res.data;
      });
    }, // 远程搜索供应商

    getBatchTypeList() {
      if (!this.warehouseId) return;
      this.form.type_id = '';
      const typeParams = {
        page: 1,
        page_size: 100,
        warehouse_id: this.warehouseId,
        is_enabled: 1
      };
      $http.getBatchType(typeParams).then(res => {
        this.batchTypeList = res.data.data;
      });
    }, // 拉取入库分类列表

    getDistributorList() {
      $http.getDistributor().then(res => {
        this.distributorList = res.data.data;
        this.distributor.total = res.data.total;
        this.distributor.page = res.data.current_page;
        this.distributor.size = res.data.per_page;
      });
    }, // 供应商列表

    handleSelectionChange(val) {
      this.goodsSelected = val;
    }, // 处理选择商品弹框的选择事件

    distributorchange(val) {
      $http.checkDistributor({ page: val }).then(res => {
        this.distributorList = res.data.data;
        this.distributor.total = res.data.total;
        this.distributor.page = res.data.current_page;
        this.distributor.size = res.data.per_page;
      });
    }, // 供应商分页

    showDialog() {
      this.dialogSpecShow = true;
    }, // 待入库货品弹出框

    onSpecSelected(data) {
      for (let i = 0; i < data.length; i += 1) {
        let found = false;
        if (isNaN(data[i].need_num)) {
          data[i].need_num = 1;
        }
        for (let j = 0; j < this.specList.length; j += 1) {
          if (data[i].id === this.specList[j].id) {
            found = true;
            break;
          }
        }
        if (!found) {
          this.specList.push(data[i]);
        }
      }
    },

    removeGoods(index) {
      this.specList.splice(index, 1);
    }, // 删除已选择货品

    onSave(formName) {
      this.items = [];
      // eslint-disable-next-line
      for (const item of this.specList) {
        this.items.push({
          spec_id: item.id,
          relevance_code: item.relevance_code,
          need_num: item.need_num,
          purchase_price: item.purchase_price,
          distributor_code: item.distributor_code,
          remark: item.remark || ''
        });
      } // 入库单提交
      this.form.product_stock = this.items;
      if (this.startDate && this.startTime && this.endDate && this.endTime) {
        this.form.plan_time = `${this.startDate} ${this.startTime}:00`;
        this.form.over_time = `${this.endDate} ${this.endTime}:00`;
        const timeDiff = Date.parse(this.form.over_time) - Date.parse(this.form.plan_time);
        if (timeDiff < 0) {
          this.$notify({
            message: this.$t('StartAndEndTime'),
            type: 'warning'
          });
          return;
        }
      }
      this.form.warehouse_id = this.warehouseId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.specList.length === 0) {
            this.$message({
              type: 'error',
              message: this.$t('productionListRequire')
            });
            return;
          }
          $http.addInbound(this.form).then(() => {
            this.$router.push({
              name: 'inboundList'
            });
            this.$message({
              message: this.$t('success'),
              type: 'success'
            });
          });
        } else {
          this.$message({
            message: this.$t('requireTips'),
            type: 'warning'
          });
          return false;
        }
      });
    },

    onDistributor() {
      this.distributorListShow = true;
      this.getDistributorList();
    }, // 供应商管理弹出框

    distributorDelete(id) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteDistributor(id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.distributorchange(this.distributor.page);
        });
      });
    }, // 删除供应商

    onDistributorSave() {
      this.distributorParams = {
        name_cn: this.distributorInfo.name_cn,
        name_en: this.distributorInfo.name_en
      };
      if (this.isDistributorEdit) {
        $http.editDistributor(this.distributorInfo.id, this.distributorParams).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.distributorchange(this.distributor.page); // 刷新弹窗的供应商列表
          this.distributorEditShow = false;
        });
      } else {
        $http.addDistributor(this.distributorParams).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.distributorchange(this.distributor.page); // 刷新弹窗的供应商列表
          this.queryAllDistributor(); // 刷新搜索框的供应商列表
          this.distributorEditShow = false;
        });
      }
    }, // 保存供应商

    addDistributor() {
      this.distributorEditShow = true;
      this.isDistributorEdit = false;
    }, // 新增供应商弹出框

    distributorEdit(row) {
      this.distributorEditShow = true;
      this.isDistributorEdit = true;
      this.distributorInfo = Object.assign({}, row);
    }, // 编辑供应商弹出框

    cancelDistributor() {
      this.distributorEditShow = false;
      this.distributorInfo.name_en = '';
      this.distributorInfo.name_cn = '';
    } // 取消新增供应商
  }
};
</script>

<style lang="less" module>
.label {
  font-size: 18px;
}
.distributorUtil {
  text-align: right;
  margin-bottom: 20px;
}
.distributorEdit {
  margin-bottom: 20px;
}
.myselect {
  line-height: 40px;
  height: 40px;
}
.header {
  margin: 0 0 10px 0;
}
.noborder .el-input__inner {
  border-radius: 0px;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  background-color: red;
}
</style>
<style lang="less" scoped>
.distributor_main {
  margin: 20px 0 40px 0;
}
</style>
