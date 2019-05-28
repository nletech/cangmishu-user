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
              <el-form-item>
                            <el-row :gutter="10">
                                    <el-col :lg="13">
                                      <div  class="address">
                                            <label  class="label"> 发件信息
                                                    <el-button size="mini"  @click="handle_select(0)">选择发件人地址</el-button>
                                            </label>
                                            <el-form  label-width="80px">
                                                      <el-form-item label="姓名"
                                                                    prop="fullname">
                                                                      {{senderInfo.fullname}}
                                                      </el-form-item>
                                                      <el-form-item label="电话"
                                                                    prop="phone">
                                                                    {{senderInfo.phone}}
                                                      </el-form-item>
                                                      <el-form-item label="地址"
                                                                    prop="address">
                                                                    {{senderInfo.address}}
                                                      </el-form-item>
                                            </el-form>
                                      </div>
                                    </el-col>
                                    <el-col :lg="11">
                                      <div  class="address sender">
                                            <label  class="label"> 收件信息
                                                    <el-button size="mini"  @click="handle_select(1)">选择收件人地址</el-button>
                                            </label>
                                            <el-form  label-width="80px">
                                                      <el-form-item label="姓名"
                                                                    prop="fullname">
                                                                    {{receiverInfo.fullname}}
                                                      </el-form-item>
                                                      <el-form-item label="电话"
                                                                    prop="phone">
                                                                    {{receiverInfo.phone}}
                                                      </el-form-item>
                                                      <el-form-item label="地址"
                                                                    prop="address">
                                                                    {{receiverInfo.address}}
                                                      </el-form-item>
                                            </el-form>
                                      </div>
                                    </el-col>
                            </el-row>
              </el-form-item>
              <label class="label"> 出库清单 </label>
              <!-- 选择货品按钮 -->
              <el-button @click="showDialog">{{$t('chooseGoods')}}</el-button>
              <!-- 出库清单表 -->
              <el-form-item>
                  <el-table :data="goodsList"
                            border
                            style="width: 100%;">
                            <el-table-column  type="index"
                                              label="#">
                            </el-table-column>
                            <el-table-column label="商品名称"
                                            prop="relevanc">
                            </el-table-column>
                            <el-table-column label="SKU">
                                              <template slot-scope="scope">
                                                {{scope.row.name_parent}}({{scope.row.name_cn}})
                                              </template>
                            </el-table-column>
                            <el-table-column label="数量">
                            </el-table-column>
                            <el-table-column label="操作">
                                              <template slot-scope="scope">
                                                        <el-button @click="removeGoods(scope.$index)" size="small">删除</el-button>
                                              </template>
                            </el-table-column>
                </el-table>
              </el-form-item>
              <!-- 备注 -->
              <el-form-item label="备注"
                            prop="remark">
                            <el-input type="textarea"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                      <!-- 运输方式 -->
                      <el-form-item  label="运输方式">
                                    <el-select  size="small"
                                                v-model="form.delivery_type">
                                                <el-option  v-for="item in deliveryList"
                                                            :label="item.name"
                                                            :value="item.id"
                                                            :key="item.id">
                                                </el-option>
                                    </el-select>
                      </el-form-item>
                </el-col>
                <el-col  :span="10"
                        :offset="2">
                      <!-- 运单号 -->
                      <el-form-item label="运单号">
                                    <el-input  placeholder="请输入运单号"
                                              size="small">
                                    </el-input>
                      </el-form-item>
                </el-col>
              </el-row>
              <!-- 提交按钮 -->
              <el-form-item>
                        <el-button type="primary" @click="onSave()">提交</el-button>
              </el-form-item>
    </el-form>
  </mdoel-form>

  <!-- 待入库货品清单弹框 -->
    <el-dialog  :title="$t('chooseGoods')"
                width="80%"
                :visible.sync="goodsDialog"
                :show-close="false"
                :before-close="handleClose">

                <my-group
                  v-model="params"
                  @submit="onSubmit">
                  <el-col :span="4" :class="$style.myselect">
                    <my-select keyName="category_id">
                      <el-option
                        v-for="item in typeList"
                        :label="item.name_cn"
                        :value="item.id" :key="item.id">
                      </el-option>
                    </my-select>
                  </el-col>
                  <el-col :span="4" :offset="16">
                    <my-input keyName="keywords"></my-input>
                  </el-col>
                </my-group>

                <el-table
                  ref="table"
                  border
                  :data="goods"
                  style="width: 100%"
                  :row-style="{cursor: 'pointer'}">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-table
                        :data="props.row.specs"
                        border
                        @row-click="rowClickGoods">
                        <el-table-column
                          width="55">
                          <template slot-scope="scope">
                            <label class="el-checkbox">
                              <span
                                class="el-checkbox__input"
                                :class="scope.row.checked && 'is-checked'">
                                <span class="el-checkbox__inner"></span>
                              </span>
                            </label>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="relevance_code"
                          label="外部编码">
                        </el-table-column>
                        <el-table-column
                          prop="name_cn"
                          label="规格中文名">
                        </el-table-column>
                        <el-table-column
                          prop="name_en"
                          label="规格外文名">
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="货品中文名称"
                    prop="name_cn">
                  </el-table-column>
                  <el-table-column
                    label="货品外文名称"
                    prop="name_en">
                  </el-table-column>
                </el-table>

                <button-pagination :pageParams="params"></button-pagination>

                <span slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="confirmSelected"
                    :loading="$store.state.btn_loading"
                    :disabled="!goodsSelected.length">
                    {{$t('submit')}}
                  </el-button>
                  <el-button @click="handleClose()">{{$t('cancel')}}</el-button>
                </span>

    </el-dialog>
    <!-- 收发件人信息弹窗 -->
    <el-dialog  :title="`选择${addressText}`"
                width="80%"
                :visible.sync="addressDialog">
                <div  class="add_button">
                      <el-button  icon="el-icon-plus"
                                  @click="$router.push({name: addNmae})"
                                  size="mini">
                                  添加{{addressText}}
                      </el-button>
                </div>
                <el-table :row-style="{cursor: 'pointer'}"
                          :data="address_list_data"
                          border
                          highlight-current-row
                          @current-change="handleCurrentChange"
                          style="width: 100%">
                          <el-table-column  type="index"
                                            width="55"
                                            label="#">
                          </el-table-column>
                          <el-table-column  prop="fullname"
                                            :label="`${addressText}姓名`">
                          </el-table-column>
                          <el-table-column  prop="phone"
                                            label="电话">
                          </el-table-column>
                          <el-table-column  prop="address"
                                            label="地址">
                          </el-table-column>
                          <el-table-column  label="操作"
                                            width="240">
                                            <template slot-scope="scope">
                                                      <el-button @click="handle_confirm_btn(scope.row)">确定</el-button>
                                                      <el-button @click="handle_edit_btn(scope.row)">编辑</el-button>
                                            </template>
                          </el-table-column>
                </el-table>

                <!-- <button-pagination :pageParams="addressParams"></button-pagination> -->

                <span slot="footer"
                      class="dialog-footer">
                      <el-button  type="primary"
                                  @click="confirmSelectedAddressee"
                                  :loading="$store.state.btn_loading">
                                  {{$t('submit')}}
                      </el-button>
                      <el-button @click="CloseAddressee()">{{$t('cancel')}}</el-button>
                </span>

    </el-dialog>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
// import getListData from '@/mixin/list';
// import mixin from '@/mixin/form_config';
import $http from '@/api';
// import buttonPagination from '@/components/pagination_and_buttons';
// import MyInput from '@/components/my_input';
// import MySelect from '@/components/my_select';
// import MyGroup from '@/components/my_group';

export default {
  components: {
    MdoelForm,
    // MyInput,
    // MyGroup,
    // MySelect,
    // buttonPagination,
  },
  updated() {
    console.log(this.form.order_type, 'order_type');
  },
  data() {
    return {
      form: {
        warehouse_id: '', // 仓库id
        order_type: '', // 出库单分类
        goods: [], // 出库清单货物列表
        delivery_type: '', // 运输方式
        express_num: '', // 运单号
        remark: '', // 备注
        sender_id: '', // 发件人 id
        receiver_id: '', // 收件人 id
      },
      params: '', // 参数
      order_type: '',
      outboundTypes: [], // 出库单分类
      addressDialog: false, // 收发件人----------弹窗开启标志
      address_list_data: [], // 收发件人信息列表
      addTextFlag: 0, // 文字
      AddressType: 0,
      // 修改
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      boundList: [], // 出库仓库
      orderTypeList: [], // 出库单分类
      countryList: [
        { name: '荷兰', id: 'NL' },
      ],
      deliveryList: [
        { name: 'NLE派送', id: 1 },
        { name: '仓库自提', id: 2 },
        { name: 'PostNL', id: 3 },
      ],
      typeList: [],
      goodsList: [], // 选中货品列表
      goods: [], // 弹出框货品列表
      goodsSelected: [], // 弹出框选中货品
      goodsDialog: false, // 是否显示货品弹出框
      senderInfo: {
        id: '',
        fullname: '',
        address: '',
        phone: '',
      }, // 发件人地址信息
      receiverInfo: {
        id: '',
        fullname: '',
        address: '',
        phone: '',
      }, // 收件人地址信息
      addressParams: {
        page: 0,
        page_size: 10,
        data_count: 0,
      },
      selectReceiverInfo: {},
      selectSenderInfo: {},
    };
  },
  // watch: {
  // },
  computed: {
    addressText() {
      if (!this.AddressType) {
        return '发件人';
      }
      return '收件人';
    },
    addNmae() {
      if (+this.AddressType) {
        return 'addSender';
      }
      return 'addAddressee';
    },
    warehouse_id() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  created() {
    // this.getBoundList();
    // this.getTypeList();
    // this.DefaultAddressInfo();
    this.getOrderTypes(); // 获取出库单分类
  },
  methods: {
    handle_select(tag) {
      this.addressDialog = true;
      if (tag === 0) {
        this.AddressType = 0;
        this.getSenders();
      } // 获取发件人
      if (tag === 1) {
        this.AddressType = 1;
        this.getReceivers();
      } // 获取收件人
      console.log(tag, 'tag');
    },
    handle_confirm_btn(row) {
      // this.AddressType 为 0 信息填入发件人, 否则填入收件人
      if (!this.AddressType) {
        this.senderInfo.address = row.full_address;
        this.senderInfo.phone = row.phone;
        this.senderInfo.fullname = row.fullname;
        this.senderInfo.id = row.id;
      } else {
        this.receiverInfo.address = row.full_address;
        this.receiverInfo.phone = row.phone;
        this.receiverInfo.fullname = row.fullname;
        this.receiverInfo.id = row.id;
      }
      this.addressDialog = false; // 关闭弹窗
      // console.log(row, 'row_c');
    }, // 确定
    handle_edit_btn(row) {
      this.addressDialog = false;
      console.log(row, 'row_e');
    }, // 编辑
    getSenders() {
      $http.getSenderAddress()
        .then((res) => {
          if (res.status) return;
          this.address_list_data = res.data.data;
          // console.log(res, 'getSenders');
        })
        .catch();
    }, // 获取发件人列表
    getReceivers() {
      $http.getReceiverAddress()
        .then((res) => {
          if (res.status) return;
          this.address_list_data = res.data.data;
          // console.log(res, 'getReceivers');
        })
        .catch();
    }, // 获取收件人列表
    getOrderTypes() {
      $http.getOrderType()
        .then((res) => {
          if (res.status) return;
          this.outboundTypes = res.data.data;
          // console.log(res, 'getOrderTypes');
        })
        .catch();
    }, // 获取出库单分类
    confirmSelectedAddressee() {
      // this[!this.AddressType ? 'receiverInfo' : 'senderInfo'] =
      // this[this.AddressType ? 'selectReceiverInfo' : 'selectSenderInfo'];
      // this.CloseAddressee();
    },
    CloseAddressee() {
      // this.addressDialog = false;
      // this.selectReceiverInfo = {};
      // this.selectSenderInfo = {};
      // this.address_list_data = [];
    },
    // 货品分类列表
    getTypeList() {
      // $http.categoryList({ page: 1, page_size: 100 }).then((res) => {
      //   this.typeList = res.data.data;
      // });
    },
    getBatchAndInfo() {
      this.getBatchTypeList();
      // this.boundList.forEach((item) => {
      //   if (item.id === this.form.warehouse_id) {
      //     this.senderInfo = item;
      //   }
      // });
    },
    handleCurrentChange() {
      // this[this.AddressType ? 'selectReceiverInfo' : 'selectSenderInfo'] = row;
    },
    // 拉取出库分类列表
    getBatchTypeList() {
      // this.form.order_type = '';
      // const typeParams = {
      //   page: 1,
      //   page_size: 100,
      //   warehouse_id: this.form.warehouse_id,
      //   is_enabled: 1,
      // };
      // $http.orderType(typeParams).then((res) => {
      //   this.orderTypeList = res.data.data;
      // });
    },
    // 货品弹出框
    showDialog() {
      // this.goodsDialog = true;
      // this.params.page = 1;
      // this.params.keyword = '';
      // this.getList();
    },
    DefaultAddressInfo() {
      // $http.isDefault(1).then((res) => {
      //   if (!res.data.country) return;
      //   this.senderInfo = res.data;
      // });
      // $http.isDefault(0).then((res) => {
      //   if (!res.data.country) return;
      //   this.receiverInfo = res.data;
      // });
    },
    // 拉取货品列表
    getList() {
      // this.goods = [];
      // $http.goodsList(this.params).then((res) => {
      //   this.arr = this.goodsSelected.length ? this.goodsSelected : [...this.goodsList];
      //   this.goodsSelected = this.arr;
      //   this.goods = res.data.data;
      //   this.goods.forEach((item) => {
      //     item.specs.forEach((subitem) => {
      //       subitem.name_parent = item.name_cn;
      //     });
      //   });
      //   this.params.data_count = res.data.total;
      //   for (const row of this.goodsSelected) {
      //     this.goods.forEach((data) => {
      //       if (Number(row.product_id) === Number(data.id)) {
      //         data.specs.forEach((subdata) => {
      //           if (Number(row.id) === Number(subdata.id)) {
      //             // subdata.checked = true;
      //             this.$set(subdata, 'checked', true);
      //           }
      //         });
      //       }
      //     });
      //   }
      // });
    },
    // 货品列表行点击
    rowClickGoods() {
      // this.$set(row, 'checked', !row.checked);
      // if (row.checked) {
      //   // eslint-disable-next-line
      //   this.goodsSelected.some(item => item.id === row.id) || this.goodsSelected.push(row);
      //   return;
      // }
      // this.goodsSelected = this.goodsSelected.filter(item => +item.id !== +row.id);
    },
    // 选择货品弹框确认
    confirmSelected() {
      // this.goodsList = [...this.goodsSelected];
      // this.handleClose();
    },
    // 选择货品弹框关闭
    handleClose() {
      // this.goodsSelected = [];
      // this.goodsDialog = false;
    },
    // 删除已选择货品
    removeGoods() {
      // this.goodsList.splice(index, 1);
    },
    onSave() {
      this.items = [];
      for (const item of this.goodsList) {
        this.items.push({
          relevance_code: item.relevance_code,
          num: item.num,
        });
      }
      $http.outboundAdd({
        ...this.form,
        sender_id: this.senderInfo.id,
        receiver_id: this.receiverInfo.id,
        goods_data: this.items }).then(() => {
        this.successTips();
      });
    },
    onSubmit() {
      console.log('onSubmit');
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

