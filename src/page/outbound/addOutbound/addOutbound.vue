<template>
<div class="storeManage">
  <mdoel-form :colValue="20">
    <el-form slot="left" label-width="120px">
      <label class="label"> 基本信息 </label>
      <el-form-item :label="$t('outboundWarehouse')">
        <el-select size="small" v-model="form.warehouse_id" @change="getBatchAndInfo()">
          <el-option
            v-for="item in boundList"
            :label="item.name_cn"
            :value="item.id" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('outboundType')">
        <el-select size="small" v-model="form.order_type">
          <el-option
            v-for="item in orderTypeList"
            :label="item.name"
            :value="item.id" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('outboundNumber')">
        <el-input v-model="form.order_code" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderNumber')">
        <el-input v-model="form.out_sn" size="small"></el-input>
      </el-form-item>
      <el-form-item label="预计发货时间">
        <el-date-picker
          v-model="form.delivery_date"
          type="date"
          placeholder="预计发货时间"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          size="small">
        </el-date-picker>
      </el-form-item>
      <label class="label"> 待出库货品清单 </label>
      <el-button @click="showDialog">{{$t('chooseGoods')}}</el-button>
      <el-form-item>
          <el-table
          :data="goodsList"
          border style="width: 100%;">
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column :label="$t('relevanceCode')" prop="relevance_code">
          </el-table-column>
          <el-table-column :label="$t('cnName')">
            <template slot-scope="scope">
              {{scope.row.name_parent}}({{scope.row.name_cn}})
            </template>
          </el-table-column>
          <el-table-column label="可用库存">
          </el-table-column>
          <el-table-column label="出库数量*(个)" width="150px;">
            <template slot-scope="scope">
              <el-input-number
                size="small"
                v-model="scope.row.num"
                :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="每箱件数">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.pieces_num"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="removeGoods(scope.$index)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
           <el-col :lg="13">
             <div  class="address">
              <label class="label"> 运单信息
                <el-button size="mini"  @click="getLists(0)">选择收件人地址</el-button>
              </label>
              <el-form label-width="80px">
                <el-form-item label="姓名">
                  <el-input size="mini" v-model="receiverInfo.fullname"></el-input>
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input size="mini" v-model="receiverInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="国家">
                  <el-select size="small" style="width: 100%" v-model="receiverInfo.country">
                    <el-option value="nl" label="荷兰"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="运输方式">
                  <el-select size="small" style="width: 100%" v-model="form.delivery_type">
                    <el-option
                      v-for="item in deliveryList"
                      :label="item.name"
                      :value="item.id" :key="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="城市">
                  <el-input size="mini" v-model="receiverInfo.city"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                  <el-input size="mini" v-model="receiverInfo.address"></el-input>
                </el-form-item>
                <el-form-item label="邮编">
                  <el-input size="mini" v-model="receiverInfo.postcode"></el-input>
                </el-form-item>
              </el-form>
             </div>
          </el-col>
          <el-col :lg="11">
            <el-form label-width="80px">
              <div  class="address sender">
                <label class="label"> 发件人地址
                  <el-button size="mini" @click="getLists(1)">选择发件人地址</el-button>
                </label>
                <el-form-item label="姓名">
                  {{senderInfo.fullname}}
                </el-form-item>
                <el-form-item label="联系方式">
                  {{senderInfo.phone}}
                </el-form-item>
                <el-form-item label="地址">
                  {{senderInfo.address}}
                </el-form-item>
                <el-form-item label="邮编">
                  {{senderInfo.postcode}}
                </el-form-item>
                <el-form-item label="邮箱">
                  {{senderInfo.email}}
                </el-form-item>
                <el-form-item label="公司">
                  {{senderInfo.company}}
                </el-form-item>
              </div>
            </el-form>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave()">提交</el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>
  </mdoel-form>

  <!-- 待入库货品清单弹框 -->
    <el-dialog
      :title="$t('chooseGoods')"
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
    <el-dialog
      :title="`选择${addressText}`"
      width="80%"
      :before-close="CloseAddressee"
      :visible.sync="addressDialog">

      <!-- <my-group
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
      </my-group> -->
      <div class="add_button">
        <el-button
        icon="el-icon-plus"
        @click="$router.push({name: addNmae})"
        size="mini">添加{{addressText}}</el-button>
      </div>
      <el-table
      :row-style="{cursor: 'pointer'}"
      :data="address_list_data"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column
        width="55"
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        :label="`${addressText}姓名`"
        prop="fullname">
      </el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('address')">
      </el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('ContactInformations')">
      </el-table-column>
      <el-table-column
        width="240"
        :label="$t('operation')">
        <template slot-scope="scope">
          <label class="el-checkbox">
            <span
              class="el-checkbox__input"
              :class="(scope.row.id ===
              (AddressType ? selectReceiverInfo.id : selectSenderInfo.id))
              && 'is-checked'">
              <span class="el-checkbox__inner"></span>
            </span>
          </label>
        </template>
      </el-table-column>
    </el-table>

      <button-pagination :pageParams="addressParams"></button-pagination>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
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
import getListData from '@/mixin/list';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';

export default {
  components: {
    MdoelForm,
    MyInput,
    MyGroup,
    MySelect,
    buttonPagination,
  },
  mixins: [getListData, mixin],
  data() {
    return {
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
      addressDialog: false,
      form: {
        warehouse_id: '',
        order_type: '',
        order_code: '',
        out_sn: '',
      },
      senderInfo: {
        country: '',
        province: '',
        city: '',
        address: '',
        postcode: '',
        fullname: '',
        phone: '',
        email: '',
        company: '',
      },
      receiverInfo: {
        country: '',
        province: '',
        city: '',
        address: '',
        postcode: '',
        fullname: '',
        phone: '',
        email: '',
        company: '',
      },
      addressParams: {
        page: 0,
        page_size: 10,
        data_count: 0,
      },
      selectReceiverInfo: {},
      selectSenderInfo: {},
      address_list_data: [],
      AddressType: 0,
    };
  },
  created() {
    this.getBoundList();
    this.getTypeList();
    this.DefaultAddressInfo();
  },
  computed: {
    addressText() {
      if (!this.AddressType) {
        return '收件人';
      }
      return '发件人';
    },
    addNmae() {
      if (+this.AddressType) {
        return 'addSender';
      }
      return 'addAddressee';
    },
  },
  methods: {
    // 获取仓库列表
    getBoundList() {
      const warehouseParams = {
        page: 1,
        page_size: 100,
        from: 1,
      };
      $http.warehouse(warehouseParams).then((res) => {
        this.boundList = res.data.data;
      });
    },
    confirmSelectedAddressee() {
      this[!this.AddressType ? 'receiverInfo' : 'senderInfo'] =
      this[this.AddressType ? 'selectReceiverInfo' : 'selectSenderInfo'];
      this.CloseAddressee();
    },
    CloseAddressee() {
      this.addressDialog = false;
      this.selectReceiverInfo = {};
      this.selectSenderInfo = {};
      this.address_list_data = [];
    },
    // 货品分类列表
    getTypeList() {
      $http.categoryList({ page: 1, page_size: 100 }).then((res) => {
        this.typeList = res.data.data;
      });
    },
    getBatchAndInfo() {
      this.getBatchTypeList();
      // this.boundList.forEach((item) => {
      //   if (item.id === this.form.warehouse_id) {
      //     this.senderInfo = item;
      //   }
      // });
    },
    getLists(ids) {
      this.addressDialog = true;
      this.AddressType = ids;
      $http.senderList(this.params, ids).then((res) => {
        res.data.data.forEach((item) => {
          if (item.is_default) {
            this[this.AddressType ? 'selectReceiverInfo' : 'selectSenderInfo'] = item;
          }
        });
        this.address_list_data = res.data.data;
        this.addressParams.data_count = res.data.total;
      });
    },
    handleCurrentChange(row) {
      this[this.AddressType ? 'selectReceiverInfo' : 'selectSenderInfo'] = row;
    },
    // 拉取出库分类列表
    getBatchTypeList() {
      this.form.order_type = '';
      const typeParams = {
        page: 1,
        page_size: 100,
        warehouse_id: this.form.warehouse_id,
        is_enabled: 1,
      };
      $http.orderType(typeParams).then((res) => {
        this.orderTypeList = res.data.data;
      });
    },
    // 货品弹出框
    showDialog() {
      this.goodsDialog = true;
      this.params.page = 1;
      this.params.keyword = '';
      this.getList();
    },
    DefaultAddressInfo() {
      $http.isDefault(1).then((res) => {
        if (!res.data.country) return;
        this.senderInfo = res.data;
      });
      $http.isDefault(0).then((res) => {
        if (!res.data.country) return;
        this.receiverInfo = res.data;
      });
    },
    // 拉取货品列表
    getList() {
      this.goods = [];
      $http.goodsList(this.params).then((res) => {
        this.arr = this.goodsSelected.length ? this.goodsSelected : [...this.goodsList];
        this.goodsSelected = this.arr;
        this.goods = res.data.data;
        this.goods.forEach((item) => {
          item.specs.forEach((subitem) => {
            subitem.name_parent = item.name_cn;
          });
        });
        this.params.data_count = res.data.total;
        for (const row of this.goodsSelected) {
          this.goods.forEach((data) => {
            if (Number(row.product_id) === Number(data.id)) {
              data.specs.forEach((subdata) => {
                if (Number(row.id) === Number(subdata.id)) {
                  // subdata.checked = true;
                  this.$set(subdata, 'checked', true);
                }
              });
            }
          });
        }
      });
    },
    // 货品列表行点击
    rowClickGoods(row) {
      this.$set(row, 'checked', !row.checked);
      if (row.checked) {
        // eslint-disable-next-line
        this.goodsSelected.some(item => item.id === row.id) || this.goodsSelected.push(row);
        return;
      }
      this.goodsSelected = this.goodsSelected.filter(item => +item.id !== +row.id);
    },
    // 选择货品弹框确认
    confirmSelected() {
      this.goodsList = [...this.goodsSelected];
      this.handleClose();
    },
    // 选择货品弹框关闭
    handleClose() {
      this.goodsSelected = [];
      this.goodsDialog = false;
    },
    // 删除已选择货品
    removeGoods(index) {
      this.goodsList.splice(index, 1);
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
  min-height: 350px;
}
.add_button {
  width: 100%;
  margin: 0px 0 10px 0;
  text-align: right;
}
</style>

