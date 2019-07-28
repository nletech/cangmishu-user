<template>
<div class="storeManage">
  <mdoel-form :colValue="24">
    <el-form  slot="left" label-width="120px" ref="form" label-position="left">
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
            <!-- 供应商 -->
            分类
            <el-select  v-model="form.order_type" size="mini" placeholder="请选择分类">
                <el-option  v-for="item in outboundTypes"
                          :key="item.id"
                          :disabled="!item.is_enabled"
                          :label="item.name"
                          :value="item.id">
              </el-option>
            </el-select>
        </el-col>
        <el-col :span="8"><h2 align="center" style="margin:0px;">商品销售清单</h2></el-col>
        <el-col :span="8">
        </el-col>
    </el-row>
    <hr/>
    <label class="label" style="float:left; width:80px;">出库清单 </label>
    <!-- 出库清单表 -->
    <!-- 选择商品的列表 -->
    <goods-list @get_data="handleGoodsData"  :warehouseId="warehouseId" :specList.sync="selectedSpec"></goods-list>
    <label class="label"> 收发件人信息 </label>
    <!-- 收发件人信息 -->
    <sender-and-receiver @sender-and-receiver="getSenderAndReceiverData"></sender-and-receiver>
    <!-- 备注 -->
    <el-form-item label="备注"
                  prop="remark">
                  <el-input type="textarea"
                            :maxlength="30"
                            placeholder="最多不超过30个字"
                            v-model="form.remark">
                  </el-input>
    </el-form-item>
    <el-row>
            <el-col :span="10">
                    <!-- 运输方式 -->
                    <el-form-item  label="运输方式"
                                  size="small">
                        <el-input  v-model="form.delivery_type"
                                   :maxlength="13"
                                   placeholder="请输入运输方式">
                        </el-input>
                    </el-form-item>
            </el-col>
            <el-col  :span="10"
                     :offset="2">
                      <!-- 运单号 -->
                      <el-form-item label="运单号">
                            <el-input  placeholder="请输入运单号"
                                       :maxlength="13"
                                       v-model="form.express_num"
                                       size="small">
                            </el-input>
                      </el-form-item>
            </el-col>
    </el-row>
    <!-- 提交按钮 -->
    <el-form-item>
      <el-row>
              <el-col :span="2" :offset="10">
              <el-button :loading="$store.state.config.button_loading"
                        type="primary"
                        @click="onSubmit()">
                        提交
              </el-button>
              </el-col>
      </el-row>
    </el-form-item>
    </el-form>
  </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import SenderAndReceiver from './components/senderAndReceiver';
import GoodsList from './components/goodsList';

export default {
  name: 'addOutbound',
  components: {
    SenderAndReceiver,
    GoodsList,
    MdoelForm,
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        warehouse_id: 0, // 仓库id
        order_type: '', // 出库单分类
        goods_data: [], // 出库清单货物列表
        delivery_type: '', // 运输方式
        express_num: '', // 运单号
        remark: '', // 备注
        sender_id: 0, // 发件人 id
        receiver_id: 0, // 收件人 id
      },
      outboundTypes: [], // 出库单分类
      AddressType: 0,
      // 收发件人编辑
      formInfo: {}, // 提交的表格
      // 修改
      goodsList: [], // 选中货品列表
      selectedSpec: [], // 用于处理与提交的商品信息
      warehouse_id: 0,
    };
  },
  created() {
    this.getOrderTypes(); // 获取出库单分类
  },
  methods: {
    handleGoodsData(goodsList) {
      this.selectedSpec = goodsList;
    },
    getSenderAndReceiverData(person) {
      if (person.senderId) {
        this.form.sender_id = person.senderId;
      } else if (person.receiverId) {
        this.form.receiver_id = person.receiverId;
      }
    },
    getOrderTypes() {
      $http.getOrderType()
        .then((res) => {
          if (res.status) return;
          this.outboundTypes = res.data.data;
          // console.log(res, 'getOrderTypes');
        })
        .catch();
    }, // 获取出库单分类
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
            type: 'warning',
          });
          return;
        }
        if (this.selectedSpec[i].sale_price <= 0) {
          this.$message({
            message: `${this.selectedSpec[i].product_name}价格不能为空`,
            type: 'warning',
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
      if (arr.length === 0) {
        this.$message({
          message: '出库清单不能为空',
          type: 'warning',
        });
        return;
      } // 拦截商品未填写
      if (this.form.receiver_id === 0) {
        this.$message({
          message: '请选择收件人',
          type: 'warning',
        });
        return;
      } // 拦截商品未填写
      if (this.form.sender_id === 0) {
        this.$message({
          message: '请选择发件人',
          type: 'warning',
        });
        return;
      } // 拦截商品未填写
      if (this.form.order_type === '') {
        this.$message({
          message: '请选择分类',
          type: 'warning',
        });
        return;
      } // 拦截商品未填写
      // eslint-disable-next-line
      this.form.goods_data = arr;
      this.form.warehouse_id = this.warehouseId;
      // console.log(this.form, 'this.formthis.form');
      $http.addOutbound(this.form)
        .then((res) => {
          if (res.status) return;
          this.$message({
            message: '添加成功',
            type: 'success',
          });
          this.$router.push({
            name: 'outboundList',
          });
        });
    },
  },
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

