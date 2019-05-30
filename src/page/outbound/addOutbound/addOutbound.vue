<template>
<div class="storeManage">
  <mdoel-form :colValue="20">
    <el-form  slot="left"
              label-width="120px">
              <!-- 出库单类型 -->
              <el-form-item label="出库单分类">
                            <el-select size="small"
                                       v-model="form.order_type">
                                        <el-option  v-for="item in outboundTypes"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                        </el-option>
                            </el-select>
              </el-form-item>
              <!-- 收发件人信息 -->
              <sender-and-receiver @sender-and-receiver="getSenderAndReceiverData"></sender-and-receiver>
              <label class="label"> 出库清单 </label>
              <!-- 出库清单表 -->
              <el-form-item>
                          <!-- 选择商品的列表 -->
                         <goods-list @get_data="handleGoodsData"></goods-list>
              </el-form-item>
              <!-- 备注 -->
              <el-form-item label="备注"
                            prop="remark">
                            <el-input type="textarea"
                                      v-model="form.remark">
                            </el-input>
              </el-form-item>
              <el-row>
                      <el-col :span="10">
                              <!-- 运输方式 -->
                              <el-form-item  label="运输方式"
                                            size="small">
                                            <el-input  v-model="form.delivery_type"
                                                        placeholder="请输入运输方式">
                                            </el-input>
                              </el-form-item>
                      </el-col>
                      <el-col  :span="10"
                               :offset="2">
                                <!-- 运单号 -->
                                <el-form-item label="运单号">
                                              <el-input  placeholder="请输入运单号"
                                                         v-model="form.express_num"
                                                         size="small">
                                              </el-input>
                                </el-form-item>
                      </el-col>
              </el-row>
              <!-- 提交按钮 -->
              <el-form-item>
                        <el-button type="primary" @click="onSubmit()">提交</el-button>
              </el-form-item>
    </el-form>
  </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import SenderAndReceiver from './components/senderAndReceiver';
import GoodsList from './components/goodsList';

export default {
  name: 'addOutbound',
  components: {
    SenderAndReceiver,
    GoodsList,
    MdoelForm,
  },
  data() {
    return {
      form: {
        warehouse_id: '', // 仓库id
        order_type: '', // 出库单分类
        goods_data: [], // 出库清单货物列表
        delivery_type: '', // 运输方式
        express_num: '', // 运单号
        remark: '', // 备注
        sender_id: '', // 发件人 id
        receiver_id: '', // 收件人 id
      },
      outboundTypes: [], // 出库单分类
      AddressType: 0,
      // 收发件人编辑
      formInfo: {}, // 提交的表格
      // 修改
      goodsList: [], // 选中货品列表
      goodsDialog: false, // 是否显示货品弹出框
      temp_goods_list: [], // 用于处理与提交的商品信息
    };
  },
  created() {
    this.getOrderTypes(); // 获取出库单分类
  },
  computed: {
    warehouse_id() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    handleGoodsData(goodsList) {
      this.temp_goods_list = goodsList;
      console.log(goodsList, '传到父组件的GL');
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
      for (let i = 0; i < this.temp_goods_list.length; i += 1) {
        // eslint-disable-next-line
        let obj = new Object();
        obj.relevance_code = this.temp_goods_list[i].specs[0].relevance_code;
        obj.num = this.temp_goods_list[i].number;
        arr.push(obj);
      }
      this.form.goods_data = arr;
      this.form.warehouse_id = this.warehouse_id;
      $http.addOutbound(this.form)
        .then((res) => {
          if (res.status) return;
          console.log(res, 'res');
        })
        .catch();
    },
  },
};
</script>

<style lang="less" module>
</style>
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

