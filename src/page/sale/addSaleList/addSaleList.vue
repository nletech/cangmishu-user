<template>
  <div class="storeManage">
    <mdoel-form :colValue="24">
      <el-form slot="left" label-width="120px" ref="form" label-position="left">
        <h2 align="center" style="margin:0px;">
          {{ $t('OrderItems') }}
        </h2>
        <hr />
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <el-form-item label="客户" label-width="50px">
              <!-- 收件人输入框 -->
              <receiver-input @receiver-input-callback="getReceiverData"></receiver-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('OutboundTag')" label-width="50px">
              <el-select v-model="form.order_type" :placeholder="$t('ProductTAG')">
                <el-option
                  v-for="item in outboundTypes"
                  :key="item.id"
                  :disabled="!item.is_enabled"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库日期" label-width="100px">
              <el-date-picker
                v-model="form.delivery_date"
                type="date"
                placeholder="选择出库日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出库清单表 -->
        <hr />
        <!-- 选择商品的列表 -->
        <el-card class="box-card">
          <goods-list
            @get_data="handleGoodsData"
            :warehouseId="warehouseId"
            :specList.sync="selectedSpec"
            @getTotal="handleTotal"
          ></goods-list>
        </el-card>
        <!-- 备注 -->
        <hr />
        <!-- 提交按钮 -->
        <el-row :gutter="24">
          <el-col :span="18">
            <el-form-item style="text-align:right">
              商品总量:
              <span style="font-size:18px; font-weight:bold">{{ form.sub_qty }}</span>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item style="text-align:right;">
              总金额:
              <span style="color:red; font-size:18px; font-weight:bold">{{
                form.sub_total.toFixed(2)
              }}</span>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item :label="$t('remark')" style="margin: 20px auto;" prop="remark">
              <el-input
                type="textarea"
                :maxlength="30"
                rows="5"
                :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
                v-model="form.remark"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="border-left:1px solid rgba(247,247,247,1)">
            <el-form-item :label="$t('Payment')">
              <el-select v-model="form.pay_type" placeholder="请选择">
                <el-option
                  v-for="item in paymentType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item :label="$t('Paid')">
              <el-input value="number" v-model="form.sub_pay" maxlength="15"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item :label="$t('PayStatus')">
              <el-select v-model="form.pay_status" placeholder="请选择">
                <el-option
                  v-for="item in paymentStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-button
              :loading="isButtonLoading"
              type="primary"
              @click="onSubmit()"
              style="width:100%;margin-bottom:15px;height:50px;"
            >
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </mdoel-form>
  </div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import GoodsList from './components/goodsList';
import ReceiverInput from './components/receiverInput';
export default {
  name: 'addSaleList',
  components: {
    GoodsList,
    MdoelForm,
    ReceiverInput
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        warehouse_id: 0, // 仓库id
        order_type: '', // 出库单分类
        goods_data: [], // 出库清单货物列表
        remark: '', // 备注
        delivery_date: this.$moment(new Date()).format('YYYY-MM-DD'),
        sender_id: 0, // 发件人 id
        receiver_id: 0, // 收件人 id
        pay_type: '',
        pay_status: 0,
        sub_pay: 0,
        sub_total: 0,
        sub_qty: 0
      },
      outboundTypes: [], // 出库单分类
      AddressType: 0, // 修改
      goodsList: [], // 选中货品列表
      selectedSpec: [], // 用于处理与提交的商品信息
      warehouse_id: 0,
      loading: false,
      clientSearchResult: [], //客户搜索结果
      paymentStatus: [],
      paymentType: [],
      clientKeyword: '' //搜索客户信息
    };
  },
  created() {
    this.getPayStatus();
    this.getPayTypes();
    this.getOrderTypes(); // 获取出库单分类
  },
  methods: {
    handleTotal(v) {
      this.form.sub_total = v.total;
      this.form.sub_qty = v.qty;
    },
    handleGoodsData(goodsList) {
      this.selectedSpec = goodsList;
    },

    getReceiverData(person) {
      this.form.receiver_id = person.receiverId;
    },

    getPayStatus() {
      $http.payStatus().then(res => {
        this.paymentStatus = res.data;
      });
    }, // 支付状态

    getPayTypes() {
      $http.payTypes().then(res => {
        this.paymentType = res.data;
      });
    }, // 支付类型

    getOrderTypes() {
      $http
        .getOrderType({ warehouse_id: this.warehouseId })
        .then(res => {
          if (res.status) return;
          this.outboundTypes = res.data.data;
        })
        .catch();
    }, // 获取出库单分类
    onCancel() {
      this.$router.push({
        name: 'saleList'
      });
    },
    onSubmit() {
      const arr = [];
      for (let i = 0; i < this.selectedSpec.length; i += 1) {
        // eslint-disable-next-line
        let needNum = 0;
        if (this.selectedSpec[i].need_num) {
          needNum = parseInt(this.selectedSpec[i].need_num, 10);
        }
        if (needNum <= 0) {
          this.$message({
            message: `${this.selectedSpec[i].product_name}数量不能为空`,
            type: 'warning'
          });
          return;
        }
        if (this.selectedSpec[i].sale_price <= 0) {
          this.$message({
            message: `${this.selectedSpec[i].product_name}价格不能为空`,
            type: 'warning'
          });
          return;
        }
        const obj = {};
        obj.relevance_code = this.selectedSpec[i].relevance_code;
        obj.num = needNum;
        obj.sale_price = this.selectedSpec[i].sale_price;
        arr.push(obj);
      }
      // 以下是验证表单
      // eslint-disable-next-line
      if (+arr.length === 0) {
        this.$message({
          message: this.$t('PleaseAddOutboundOrder'),
          type: 'warning'
        });
        return;
      } // 拦截商品未填写
      if (this.form.receiver_id === 0) {
        this.$message({
          message: '请选择收件人',
          type: 'warning'
        });
        return;
      } // 拦截商品未填写
      if (this.form.order_type === '') {
        this.$message({
          message: '请选择分类',
          type: 'warning'
        });
        return;
      } // 拦截商品未填写
      // eslint-disable-next-line
      this.form.goods_data = arr;
      this.form.warehouse_id = this.warehouseId;
      $http.addSaleList(this.form).then(res => {
        if (res.status) return;
        this.$message({
          message: this.$t('addSuccess'),
          type: 'success'
        });
        this.$router.push({
          name: 'saleList'
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.address {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  min-height: 280px;
}
.add_button {
  width: 100%;
  margin: 0px 0 10px 0;
  text-align: right;
}
</style>
