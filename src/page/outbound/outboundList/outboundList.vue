<template>
<div class="storeManage">

  <wms-tags>
    <my-group  v-model="params"
               @submit="onSubmit">
               <el-col :span="4">
                        <my-date  :begin.sync="params.created_at_b"
                                  :end.sync="params.created_at_e">
                        </my-date>
               </el-col>
               <el-col  :span="3"
                        :offset="4">
                        <el-date-picker  v-model="params.delivery_date"
                                         type="date"
                                         size="small"
                                         value-format="yyyy-MM-dd"
                                         @change="onSubmit"
                                         placeholder="选择预计出库日期">
                        </el-date-picker>
               </el-col>
               <el-col  :span="4"
                        :offset="2">
                        <my-select  keyName="status"
                                    placeholder="请选择出库单状态">
                                    <el-option  v-for="item in typeList"
                                                :label="item.name"
                                                :value="item.id" :key="item.id">
                                    </el-option>
                        </my-select>
               </el-col>
               <el-col  :span="5"
                        :offset="2">
                        <my-input keyName="keywords"></my-input>
               </el-col>
               <!-- 添加出库单 -->
               <el-col  :span="2"
                        :offset="20">
                        <el-button  type="text"
                                    @click="addoutbound"
                                    icon="el-icon-plus">
                                    {{$t('addOutbound')}}
                        </el-button>
               </el-col>
    </my-group>
    <el-table  :data="outbound_list_data"
               border
               style="width:100%;">
               <el-table-column  label="#"
                                type="index">
               </el-table-column>
               <el-table-column  label="状态"
                                prop="status_name">
               </el-table-column>
               <el-table-column  label="出库单号"
                                prop="order_code">
               </el-table-column>
               <el-table-column  label="运单号"
                                prop="order_code">
               </el-table-column>
               <el-table-column  label="出库单类型"
                                prop="order_type.name">
               </el-table-column>
               <el-table-column  label="出库数量"
                                prop="sum">
               </el-table-column>
               <el-table-column  label="创建时间"
                                prop="created_at">
               </el-table-column>
               <el-table-column  label="预计出库日期"
                                prop="delivery_date">
               </el-table-column>
               <el-table-column  label="操作"
                                width="200">
                                <template slot-scope="scope">
                                          <el-button  size="mini"
                                                      @click="viewDetails(scope.row)">
                                                      查看详情
                                          </el-button>
                                          <el-button  size="mini"
                                                      v-if="(scope.row.status == 2 )
                                                      || (scope.row.status ==  3 )
                                                      ||(scope.row.status == 4)"
                                                      @click="synchronousOrder(scope.row)">
                                                      同步订单
                                          </el-button>
                                </template>
               </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>

  <!-- 入库单详情弹框 -->
    <DetailDialog  :visible.sync="outboundDialogVisible"
                   :id="id">
    </DetailDialog>

</div>
</template>

<script>
import { Message } from 'element-ui';
import buttonPagination from '@/components/pagination_and_buttons';
import getListData from '@/mixin/list';
import WmsTags from '@/components/wms_tags';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import MyDate from '@/components/my_date';
import $http from '@/api';
import DetailDialog from './components/outbound_detail';

export default {
  data() {
    return {
      outbound_list_data: [], // 出库单列表
      boundList: [],
      id: 0,
      outboundDialogVisible: false, // 出库单详情弹框
      params: {
        delivery_date: '',
      },
      typeList: [
        { id: 0, name: '订单被取消' },
        { id: 1, name: '待拣货' },
        { id: 2, name: '拣货中' },
        { id: 3, name: '已拣货' },
        { id: 4, name: '待出库' },
        { id: 5, name: '配送中' },
        { id: 6, name: '已收货' },
      ],
    };
  },
  components: {
    DetailDialog,
    WmsTags,
    MyInput,
    MyGroup,
    MyDate,
    MySelect,
    buttonPagination,
  },
  mixins: [getListData],
  // created() {
  //   this.getBoundList();
  // },
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
  },
  methods: {
    // 添加出库单
    addoutbound() {
      this.$router.push({
        name: 'addOutbound',
      });
    },
    // 获取仓库列表
    // getBoundList() {
    //   if (!this.warehouseId) return;
    //   const warehouseParams = {
    //     page: 1,
    //     page_size: 100,
    //     from: 1,
    //     warehouse_id: this.warehouseId,
    //   };
    //   $http.warehouse(warehouseParams).then((res) => {
    //     this.boundList = res.data.data;
    //   });
    // },
    // 获取出库单列表
    getList() {
      // if (this.params.warehouse_id) {
      //   this.params.warehouse_id = 1;
      // }
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      $http.outboundList(this.params).then((res) => {
        this.outbound_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    // 出库单详情弹框
    viewDetails(row) {
      this.outboundDialogVisible = true;
      this.id = row.id;
    },
    // 同步订单
    synchronousOrder(row) {
      $http.synchronousOrder({
        out_sns: [row.out_sn],
        warehouse_id: row.warehouse_id,
      }).then((res) => {
        Message.success(res.msg);
      }).catch((res) => {
        Message.error(res.msg);
      });
    },
  },
};
</script>

<style lang="less" module>
.util {
  text-align: right;
  margin: 20px;
}
</style>
