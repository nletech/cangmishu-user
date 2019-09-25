<template>
    <div class="container">
      <el-row :gutter="20">
              <el-col :span="8">
                <el-card shadow="always" @click.native="goToTag('outboundList')">
                  <p>{{$t('OutBoundToday')}}</p>
                  <p class="card_number">{{homedata.order_count}}</p>
                  <p class="colorchange">{{$t('OutBoundThisMonth')}} : {{homedata.month_order_count}}</p>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="always" @click.native="goToTag('inboundList')">
                  <p>{{$t('InBoundToday')}}</p>
                  <p class="card_number">{{homedata.batch_count}}</p>
                  <p class="colorchange">{{$t('InBoundThisMonth')}}{{homedata.month_batch_count}}</p>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="always" @click.native="goToTag('inventoryManage')">
                  <p>{{$t('StockQty')}}</p>
                  <p class="card_number">{{homedata.product_total | num_is_no}}</p>
                </el-card>
              </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top:20px">
        <el-col :span="8">
          <el-card shadow="hover" @click.native="goToTag('goodsAdd')">
            <i class="el-icon-shopping-bag-2"></i>
            <p>{{$t('goodsAdd')}}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click.native="goToTag('addInbound')">
            <i class="el-icon-sell"></i>
            <p>{{$t('addInbound')}}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click.native="goToTag('addOutbound')">
            <i class="el-icon-sold-out"></i>
            <p>{{$t('addOutbound')}}</p>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top:20px">
        <el-col :span="8">
          <el-card shadow="hover" @click.native="goToTag('inventoryManage')">
            <i class="el-icon-box"></i>
            <p>{{$t('inventoryManage')}}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click.native="goToTag('storeManage')">
            <i class="el-icon-s-home"></i>
            <p>{{$t('storeManage')}}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click.native="goToTag('shops')">
            <i class="el-icon-shopping-cart-1"></i>
            <p>{{$t('shopsManagement')}}</p>
          </el-card>
        </el-col>
      </el-row>

  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  name: 'normal_home',
  mixins: [mixin],
  data() {
    return {
      activeLabel: '',
      homedata: {
        batch_count: 0, // 今日入库次数
        order_count: 0, // 今日出库次数
        month_batch_count: 0, // 本月入库次数
        month_order_count: 0, // 本月出库次数
        product_total: 0, // 可用库存数
      },
    };
  },
  created() {
    this.activeLabel = '1';
    this.gethomeWarehouseData();
  },
  watch: {
    warehouseId() {
      this.gethomeWarehouseData();
    },
  },
  methods: {
    gethomeWarehouseData() {
      $http.homeWarehouseData({ warehouse_id: this.warehouseId }).then((res) => {
        this.homedata = res.data;
      });
    },
    goToTag(tag) {
      this.$router.push({
        name: tag,
      });
    },
  },
};
</script>
<style lang="less" scoped>
@margin: 20px;
@margin-bottom: 20px;
@border: 1px solid #ccc;
@box-shadow: 2px 0px 4px rgba(109,96,186,0.3);
  .container{
    margin: 20px;
    text-align: center;
    line-height: 35px;
    i:before{
      font-size: 40px;
      background-color: RGBA(110, 93, 213, 1);
      color: white;
      display: block;
      padding: 30px;
      border-radius:60px;
    }
  }
  .el-card {
    height: 180px;
    cursor: pointer;
    .card_number {
      font-size: 28px;
      margin: 10px auto;
    }
    .colorchange {
      color: RGBA(110, 93, 213, 1);
    }
    p {
      text-align: center;
    }
  }
</style>
