<template>
          <div :class="$style.setOutbound">
               <model-form>
          <el-dialog
            title="查看入库单"
            width="80%"
            @close="close"
            @update:visible="$emit('update:visible', $event)"
            :visible="visible"
          >
          <el-row :gutter="10">
            <el-col :span="9" :offset="9">
              <h2>({{warehouse_name}})入库单</h2>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="13" style="margin-top:42px;">入库单分类:
              <span class="inbound_info">{{category_name}}</span>
            </el-col>
            <el-col :span="4" :offset="3">
              <img
                v-if="inboundInfo.batch_code_barcode"
                :src=inboundInfo.batch_code_barcode
                alt="二维码"
                :class="$style.inboundimg"
              >
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
            <el-col :span="10">备注:
              <span class="inbound_info">{{inboundInfo.remark}}</span>
            </el-col>
            <!-- <el-col :span="10">{{inboundInfo.remark}}</el-col> -->
          </el-row>
          <h3>货品列表</h3>

            <el-table
              :data="inboundList"
              border
              style="width: 100%"
              v-loading='tableLoading'
            >
              <!-- # -->
              <el-table-column
                align="center"
                header-align="center"
                type="index"
                width="60"
              >
              </el-table-column>
              <!-- 中文名称 -->
              <el-table-column
                align="center"
                header-align="center"
                label="中文名称"
              >
                <template slot-scope="scope" v-if="scope.row.spec">
                  {{scope.row.spec.product.name_cn}}({{scope.row.spec.name_cn}})
                </template>
              </el-table-column>
              <!-- 外部编码 -->
              <el-table-column
                align="center"
                header-align="center"
                prop="relevance_code"
                label="外部编码"
              >
              </el-table-column>
              <!-- 预/已入库数量(个) -->
              <el-table-column
                align="center"
                header-align="center"
                label="预/已入库数量(个)"
                width="120"
              >
                <template slot-scope="scope">
                  {{scope.row.need_num}}/{{scope.row.total_stockin_num}}
                </template>
              </el-table-column>
              <!-- 每箱件数 -->
              <el-table-column
                align="center"
                header-align="center"
                prop="pieces_num"
                label="每箱件数"
              >
              </el-table-column>
              <!-- 供应商货号 -->
              <el-table-column
                prop="distributor_code"
                label="供应商货号"
              >
              </el-table-column>
              <!-- SKU -->
              <el-table-column
                align="center"
                header-align="center"
                prop="sku"
                label="SKU"
              >
              </el-table-column>
              <!-- 备注 -->
              <el-table-column
                header-align="center"
                label="备注"
              >
                <template slot-scope="scope">
                  <div :class="$style.content_box">
                    <el-popover
                      placement="left-start"
                      width="150"
                      trigger="hover"
                      :content="scope.row.remark"
                    >
                      <span slot="reference">{{scope.row.remark}}</span>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <button-pagination :pageParams="params"></button-pagination>

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
          </el-dialog>
  </model-form>
  </div>
</template>

<script>
/* eslint-disable */
import $http from '@/api';
import baseApi from '@/lib/axios/base_api'
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';
import ModelForm from '@/components/form';

export default {
  name: 'setOutbound',
  props: {
    visible: Boolean,
    id: Number,
  },
  components: {
    ModelForm,
  },
};
</script>

<style lang="less" module>
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
.inbound_info {
  padding-left: 20px;
}
</style>


