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
      <el-form slot="left" :rules="rules" :model="form" label-width="150px" ref="form">
        <el-row type="flex" justify="space-between">
          <el-col :span="8"> </el-col>
          <el-col :span="7"
            ><h2 align="center" style="margin:0px;">{{ $t('AddPO') }}</h2></el-col
          >
          <el-col :span="8">
            <el-form-item :label="$t('PONumber')" label-position="right" class="noborder">
              <el-input v-model="form.purchase_code" :disabled="true" prefix-icon="el-icon-tickets">
                <el-button slot="append" @click="getPurchaseCode" icon="el-icon-refresh">
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr />
        <label class="label">{{ $t('Essentialformrmation') }}</label>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('Orderinvoicenumber')" label-position="right" class="noborder">
              <el-input :placeholder="$t('notNecessaryInfo')" v-model="form.order_invoice_number">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('supplier')" label-position="right" prop="distributor_id">
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
        <el-row>
          <el-col :span="8">
            <el-form-item
              :label="$t('orderDate')"
              label-position="right"
              prop="created_date"
              class="noborder"
            >
              <el-date-picker
                v-model="form.created_date"
                value-format="yyyy-MM-dd"
                format="yyyy - MM - dd"
                :placeholder="$t('Pleaseselectdate')"
                type="date"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('goodsorder')" label-position="right">
          <span style="width:300px; padding-top:20px">
            <el-button size="mini" @click="showDialog" type="primary" plain
              >{{ $t('pleaseSelect') }}<i class="el-icon-more el-icon--right"></i>
            </el-button>
            <span class="sub-title">{{ $t('mustEnter') }}</span>
          </span>
        </el-form-item>
        <el-form-item>
          <el-table :data="specList" :empty-text="$t('pleaseSelect')">
            <el-table-column type="index" label="#" fixed> </el-table-column>
            <el-table-column
              :label="$t('cnName')"
              prop="product_name"
              header-align="center"
              align="center"
              width="200px"
              fixed
            >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="SKU"
              prop="relevance_code"
              width="150px"
            >
            </el-table-column>
            <el-table-column
              :label="$t('PurchaseUnit')"
              header-align="center"
              align="center"
              width="180px;"
            >
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.need_num" :min="1">
                </el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('PurcharsePrice')"
              header-align="center"
              align="center"
              min-width="80px"
            >
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.purchase_price"> </el-input>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('operation')"
              header-align="center"
              align="center"
              min-width="60px"
            >
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
        </el-form-item>
        <label class="label"> {{ $t('notNecessaryInfo') }} </label>
        <el-form-item :label="$t('remark')">
          <el-input
            v-model="form.remark"
            type="textarea"
            :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
            :maxlength="30"
          >
          </el-input>
        </el-form-item>
        <el-form-item style="padding-left:100px;">
          <el-button @click="onSave('form')" type="primary" :loading="isButtonLoading">
            {{ $t('submit') }}
          </el-button>
          <el-button @click="$router.go(-1)">{{ $t('cancel') }}</el-button>
        </el-form-item>
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
  name: 'addPurchase',
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
        purchase_code: '',
        order_invoice_number: '',
        distributor_id: '',
        created_date: '',
        remark: '',
        items: []
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
      distributorSelectList: [], // 供应商列表
      rules: {
        purchase_code: [{ required: true, message: this.$t('PleaseEnterNumber'), trigger: 'blur' }],
        distributor_id: [
          { required: true, message: this.$t('Pleseselectsupplier'), trigger: 'change' }
        ],
        created_date: [{ required: true, message: this.$t('Pleaseselectdate'), trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getDistributorList(); // 获取供应商列表
    this.queryAllDistributor(); // 不带分页的所有供应商
    this.getPurchaseCode();
  },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    }
  },
  methods: {
    getPurchaseCode() {
      $http
        .getPurchaseCode({
          warehouse_id: this.warehouseId
        })
        .then(res => {
          this.form.purchase_code = res.data.purchase_code;
        });
    }, // 获取批次号

    handlerDistributorListClose() {
      this.queryAllDistributor();
      // eslint-disable-next-line
      this.distributorSelectList.map(item => {
        if (item.id === this.form.distributor_id) {
          this.form.distributor_id = item.id;
        } else {
          this.form.distributor_id = '';
        }
      });
    }, // 关闭供应商筛选框之后重置选择的供应商

    queryAllDistributor() {
      $http.queryDistributor({ all: 1 }).then(res => {
        this.distributorSelectList = res.data;
      });
    }, // 远程搜索供应商

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

    onSpecSelected(selectedProductList) {
      // 检测新添加商品是否存在于表单吧商品列表，
      // 如果不存在，直接 push 进商品列表，存在则将选择的数量求和。
      for (let i = 0; i < selectedProductList.length; i += 1) {
        let found = false;
        for (let j = 0; j < this.specList.length; j += 1) {
          if (selectedProductList[i].id === this.specList[j].id) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.specList.push(selectedProductList[i]);
        }
      }
    }, // 防止已存在商品列表中的商品被重复选择

    removeGoods(index) {
      this.specList.splice(index, 1);
    }, // 删除已选择货品

    onSave(formName) {
      this.items = [];
      // eslint-disable-next-line
      for (const item of this.specList) {
        this.items.push({
          relevance_code: item.relevance_code,
          need_num: item.need_num,
          purchase_price: item.purchase_price
        });
      } // 入库单提交
      if (!this.items.length) {
        this.$message({
          message: this.$t('purchaseTips1'),
          type: 'error'
        });
        return;
      }
      this.form.items = this.items;
      this.form.warehouse_id = this.warehouseId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          $http.addPurchase(this.form).then(res => {
            if (res.status) return;
            this.$message({
              message: this.$t('success'),
              type: 'success'
            });
            this.$router.replace({
              name: 'purchaseList'
            });
          });
        } else {
          this.$message({
            message: this.$t('inputRequired'),
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
