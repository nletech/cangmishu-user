<template>
  <div class="container">
    <div class="container-column-header">
      <div class="statistics">
        <h3 class="statistics-title">{{ $t('DataAnalysis') }}:</h3>
        <el-row class="statistics-container" type="flex" justify="space-between">
          <el-col
            v-for="item in statistics"
            :key="item.name"
            :span="4"
            class="statistics-container-item"
          >
            <p>{{ $t(item.name) }}</p>
            <p :class="['item_number', item.color ? item.color : '']">
              <span>{{ item.count }}</span>
            </p>
          </el-col>
          <el-col :span="12" class="card-list">
            <el-card class="card-item" shadow="hover">
              <p>地址管理</p>
              <p @click="goToTag('addressManagement')">查看地址</p>
            </el-card>
            <!-- <el-card class="card-item" shadow="hover">
              <p>发件人管理</p>
              <p>像收银软件一样下单</p>
            </el-card> -->
            <el-card class="card-item" shadow="hover">
              <p>供应商管理</p>
              <p @click="goToTag('supplierManagement')">查看供应商</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container-echat">
      <div class="title">
        <div>系统会员统计</div>
        <div>
          时间：<el-radio-group
            v-model="customersDataRadio"
            @change="onSaleRadioCahnge"
            size="small"
          >
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="-1">昨天</el-radio-button>
            <el-radio-button label="30">最近三十天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="echart">
        <div class="chart-line" id="chart-line"></div>
      </div>
    </div>
    <div class="container-rank">
      <el-card class="client-order-rank-list" shadow="never">
        <div slot="header" class="clearfix">
          <span> 会员下单排行榜 </span>
        </div>
        <div v-for="(item, i) in clientOrderRangList" :key="i" class="client-order-rank-item">
          <div>{{ i + 1 }}</div>
          <div>
            <el-avatar :size="60" :src="item.avatar"> </el-avatar>
          </div>
          <div class="count-container">
            <div>{{ item.name }}</div>
            <div class="count">
              <div>
                总订单量: <span>{{ item.order_count }}</span>
              </div>
              <div>
                月订单量: <span>{{ item.current_month_order_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="client-order-rank-list" shadow="never">
        <div slot="header" class="clearfix">
          <span> 供应商销量排行榜 </span>
        </div>
        <div v-for="(item, i) in supplierRangList" :key="i" class="client-order-rank-item supplier">
          <div>{{ i + 1 }}</div>
          <div class="count-container">
            <div>{{ item.distributor_name }}</div>
            <div class="count">
              <div>
                总订单量: <span class="green-color">{{ item.count }}</span>
              </div>
              <div>
                月订单量: <span class="green-color">{{ item.current_month_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/component/legend');

export default {
  name: 'saleOverview',
  mixins: [mixin],
  data() {
    return {
      statistics: [
        {
          name: '收件人总数',
          count: '',
          pathName: 'inventoryManage'
        },
        {
          name: '发件人总数',
          count: '',
          pathName: 'goodsManage'
        },
        {
          name: '供应商总数',
          count: '',
          pathName: 'saleList'
        },
        {
          name: '系统会员',
          count: '',
          pathName: 'saleList'
        }
      ],
      customersDataRadio: '1',
      chartConfig: {
        domId: 'chart-line',
        xAxisKey: 'days',
        seriesKey: 'counts'
      },
      clientOrderRangList: [],
      supplierRangList: []
    };
  },
  created() {
    this.getCustomersTotalData();
  },
  mounted() {
    this.getCustomersData();
  },
  watch: {
    warehouseId() {
      this.getCustomersTotalData();
    }
  },
  methods: {
    goToTag(tag, query) {
      this.$router.push({
        name: tag,
        query
      });
    },
    onSaleRadioCahnge() {
      this.getCustomersData();
    },
    getCustomersData() {
      $http.getCustomersData({ days: this.customersDataRadio }).then(res => {
        this.initChartLine(res.data, this.chartConfig);
      });
    },
    initChartLine(data, chartConfig) {
      const echarLine = echarts.init(document.getElementById(chartConfig.domId));
      const packageOption = {
        backgroundColor: '#ffffff',
        color: ['#cee5fe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      };
      let xData = [];
      let seriesData1 = [];
      data.forEach(item => {
        xData.push(item[chartConfig.xAxisKey]);
        seriesData1.push(item[chartConfig.seriesKey]);
      });
      packageOption.xAxis = [
        {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ];
      packageOption.yAxis = [
        {
          type: 'value'
        }
      ];
      packageOption.series = [
        {
          name: chartConfig.seriesKey,
          type: 'bar',
          barWidth: '10px',
          data: seriesData1
        }
      ];
      echarLine.setOption(packageOption);
      window.onresize = echarLine.resize;
    },
    getCustomersTotalData() {
      if (!this.warehouseId) return;
      $http.getCustomersTotalData().then(res => {
        this.statistics[0].count = res.data.receiver_count;
        this.statistics[1].count = res.data.sender_count;
        this.statistics[2].count = res.data.supplier_count;
        this.statistics[3].count = res.data.member_count;
      });
      $http.getCustomersOrderRankData({ days: this.customersDataRadio }).then(res => {
        this.clientOrderRangList = res.data;
      });
      $http.getCustomersSupplierRankData({ days: this.customersDataRadio }).then(res => {
        this.supplierRangList = res.data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  @bgc: #fff;
  .red-color {
    color: #e1685a;
  }
  .green-color {
    color: #23a13b !important;
  }
  .container-column-header {
    width: 100%;
    background-color: @bgc;
    .statistics {
      width: 100%;
      overflow: hidden;
      padding: 20px;
      .statistics-title {
        margin: 0 0 20px 0;
        font-weight: bold;
        color: #000;
        font-size: 26px;
      }
      .statistics-container {
        .statistics-container-item {
          border-right: 1px solid #f1f1f1;
          text-align: center;
          p:first-child {
            color: #909399;
          }
          p:last-child {
            font-size: 24px;
          }
        }
        .card-list {
          display: flex;
          justify-content: flex-end;
          .card-item {
            margin: 0 10px;
            border-radius: 2px;
            .el-card__body {
              padding: 10px 20px;
            }
            p:first-child {
              font-size: 24px;
              margin: 10px;
            }
            p:last-child {
              margin: 10px;
              font-size: 14px;
              color: #909399;
              cursor: pointer;
            }
          }
        }
      }
    }
    .wechat-qr {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .wechat-qr-item {
        margin: 0 10px 10px 10px;
        text-align: center;
        .wechat-qr-item-image {
          width: 120px;
          p {
            margin: 0;
          }
          .subtitle {
            font-size: 12px;
            color: #949494;
          }
        }
        .wechatQR_item_text {
          margin: 10px;
        }
      }
    }
  }
  .container-echat {
    width: 100%;
    position: relative;
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 20px;
      div:last-child {
        display: flex;
        align-items: center;
      }
    }
    .echart {
      width: 100%;
      display: flex;
      .chart-line {
        width: 100%;
        height: 300px;
      }
    }
  }
  .container-rank {
    width: 100%;
    position: relative;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    .client-order-rank-list {
      /deep/ .el-card__body {
        padding: 0;
      }
      .client-order-rank-item {
        display: grid;
        grid-template-columns: 50px 120px 1fr;
        border-bottom: 1px solid #f1f1f1;
        height: 94px;
        &:last-child {
          border-bottom: none;
        }
        align-items: center;
        padding: 15px 20px;
        .count-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          .count {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #909399;
            span {
              color: #e1685a;
            }
          }
        }
      }
      .supplier {
        grid-template-columns: 50px 1fr;
      }
    }
  }
}
</style>
