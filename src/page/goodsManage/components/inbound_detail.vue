<template>
  <el-dialog
  title="查看入库单"
  width="80%"
  @close="close"
  @update:visible="$emit('update:visible', $event)"
  :visible="visible">
  <el-row :gutter="10">
    <el-col :span="9" :offset="9">
      <h2>({{warehouse_name}})入库单</h2>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="13" style="margin-top:42px;">入库单分类:
      <span class="inbound_info">{{category_name}}</span>
    </el-col>
    <!-- <el-col :span="10">{{category_name}}</el-col> -->
    <el-col :span="4" :offset="3">
      <img
        v-if="inboundInfo.batch_code_barcode"
        :src=inboundInfo.batch_code_barcode
        alt="二维码"
        :class="$style.inboundimg">
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="13">入库单编号:
      <span class="inbound_info">{{inboundInfo.batch_code}}</span>
    </el-col>
    <!-- <el-col :span="10">{{inboundInfo.batch_code}}</el-col> -->
    <el-col :span="4" :offset="5">{{inboundInfo.batch_code}}</el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="13">确认单编号:
      <span class="inbound_info">{{inboundInfo.confirmation_number}}</span>
    </el-col>
    <!-- <el-col :span="10">{{inboundInfo.confirmation_number}}</el-col> -->
  </el-row>
  <el-row :gutter="10">
    <el-col :span="13">入库供应商:
      <span class="inbound_info">{{distributor_name}}</span>
    </el-col>
    <!-- <el-col :span="10">{{distributor_name}}</el-col> -->
  </el-row>
  <el-row :gutter="10">
    <el-col :span="3">备注:
      <span class="inbound_info">{{inboundInfo.remark}}</span>
    </el-col>
    <!-- <el-col :span="10">{{inboundInfo.remark}}</el-col> -->
  </el-row>

  <h3>货品列表</h3>

    <el-table
      :data="inboundList"
      border
      style="width: 100%"
      v-loading='tableLoading'>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="中文名称">
        <template slot-scope="scope" v-if="scope.row.spec">
          {{scope.row.spec.product.name_cn}}({{scope.row.spec.name_cn}})
        </template>
      </el-table-column>
      <el-table-column prop="relevance_code" label="外部编码">
      </el-table-column>
      <el-table-column label="预/已入库数量(个)" width="120">
        <template slot-scope="scope">
          {{scope.row.need_num}}/{{scope.row.total_stockin_num}}
        </template>
      </el-table-column>
      <el-table-column prop="pieces_num" label="每箱件数">
      </el-table-column>
      <el-table-column prop="distributor_code" label="供应商货号">
      </el-table-column>
      <el-table-column prop="sku" label="SKU">
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <div :class="$style.content_box">
            <el-popover
              placement="left-start"
              width="150"
              trigger="hover"
              :content=scope.row.remark>
              <span slot="reference">{{scope.row.remark}}</span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>

    <!-- <pagination :page-params="page_params"></pagination> -->

    <el-row>
      <el-col :span="6" :offset="18">
        <el-row>
          <el-col :span="8">运输方式:</el-col>
          <el-col :span="16">{{inboundInfo.transportation_type_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">运单号:</el-col>
          <el-col :span="16">{{inboundInfo.waybill_number}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">预入库总数:</el-col>
          <el-col :span="16">{{total_need_num}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">操作人:</el-col>
          <el-col :span="16">{{inboundInfo.operator_user}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">预期入库时间:</el-col>
          <el-col :span="16">
            {{inboundInfo.plan_time}}
            <span v-if="inboundInfo.plan_time">&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span>
            {{inboundInfo.over_time}}
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :class="$style.download">
      <el-col :span="10" :offset="10">
        <el-button round plain type="primary" @click="onDownload()">下载入库单</el-button>
      </el-col>
    </el-row>

    <iframe style="display: none;" id="downloadIframe"></iframe>

  </el-dialog>
</template>

<script>
/* eslint-disable */
import $http from '@/api';
import baseApi from '@/lib/axios/base_api'
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  props: {
    visible: Boolean,
    // inboundInfo: Object,
    id: Number,
  },
  data() {
    return {
      inboundInfo: {},
      inboundList: [],
      batch_id: '',
      tableLoading: false,
      order_status_list: [],
      warehouse_name: '',
      distributor_name: '',
      category_name: '',
      total_need_num: '',
    };
  },
  components: {
    buttonPagination,
  },
  mixins: [getListData],
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId;
    },
    api() {
      return this.$store.state.token.token.substring(7) ;
    },
  },
  watch: {
    warehouseId() {
      this.getList();
      // this.getTypeList();
    },
    id: {
      handler(value) {
        this.getList();
      },
      deep: true,
    },
  },
  methods: {
    close() {
      // this.page_params.page = 1;
    },
    getList() {
      if (!this.id || !this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId
      $http.inboundDetail(this.id, this.params).then((res) => {
        this.inboundInfo = res.data;
        this.params.data_count = res.data.product.total;
        this.inboundList = res.data.product.data;
        this.warehouse_name = res.data.warehouse.name_cn;
        this.distributor_name = res.data.distributor.name_cn;
        this.category_name = res.data.batch_type.name;
        this.total_need_num = res.data.total_num.total_need_num;
      });
    },
    onDownload() {
      // const w = window.open();
      $http.inboundDownload(this.id, this.api, this.warehouseId).then((res) => {
        this.$message({
          message: '下载成功!',
          type: 'success',
          showClose: true,
        });
        window.location = `${baseApi}batch/${this.id}/download?api_token=${this.api}`;
        // document.getElementById('downloadIframe').src = `https://dev-wms-api-v2.nle-tech.com/batch/${this.id}/download?api_token=${this.api}`;
      });
    },
  },
};
</script>

<style module>
.content_box{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.download {
  margin-top: 50px;
}
.inboundimg {
  width: 300px;
  height: 60px;
}
</style>

<style lang="less" scoped>
.inbound_info {
  padding-left: 20px;
}
</style>
