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
              <p>销售列表</p>
              <p @click="goToTag('saleList')">查看所有订单</p>
            </el-card>
            <el-card class="card-item" shadow="hover">
              <p>收银</p>
              <p>像收银软件一样下单</p>
            </el-card>
            <el-card class="card-item" shadow="hover">
              <p>下单</p>
              <p @click="goToTag('addSaleList')">新增出库订单</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container-echat">
      <div class="title">
        <div>销售分析</div>
        <div>
          时间：<el-radio-group v-model="saleDateRadio" @change="onSaleRadioCahnge" size="small">
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="-1">昨天</el-radio-button>
            <el-radio-button label="30">最近三十天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="total">
        <el-row>
          <el-col :span="6">
            <p>总营业额</p>
            <p class="value red-color">{{ saleTotal.total }}</p>
          </el-col>
          <el-col :span="6">
            <p>实收营业额</p>
            <p class="value">{{ saleTotal.total_pay }}</p>
          </el-col>
          <el-col :span="6">
            <p>应收营业额</p>
            <p class="value">{{ saleTotal.total_wait_pay }}</p>
          </el-col>
          <el-col :span="6">
            <p>订单量</p>
            <p class="value">{{ saleTotal.order_count }}</p>
          </el-col>
        </el-row>
      </div>
      <div class="echart">
        <div class="chart-circle" id="chart-sale-circle"></div>
        <div class="chart-line" id="chart-sale-line"></div>
      </div>
    </div>
    <div class="container-table">
      <el-table :data="tableList" ref="table" border style="width: 100%; margin-top: 10px">
        <el-table-column
          :label="$t('time')"
          prop="days"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('订单量')" prop="order_count" align="center"></el-table-column>
        <el-table-column
          :label="$t('下单商品数量')"
          prop="product_amount"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('出库商品数量')"
          prop="pickup_amount"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('应收金额')" prop="total" align="center"></el-table-column>
        <el-table-column :label="$t('实收金额')" prop="total_pay" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
import 'echarts/lib/component/tooltip';
require('echarts/lib/component/legend');

export default {
  name: 'saleOverview',
  mixins: [mixin],
  data() {
    return {
      statistics: [
        {
          name: '今日新增',
          count: '',
          pathName: 'inventoryManage'
        },
        {
          name: '待处理',
          count: '',
          pathName: 'goodsManage'
        },
        {
          name: '待发货',
          count: '',
          pathName: 'saleList'
        }
      ],
      saleTotal: {},
      saleDateRadio: '1',
      chartSaleCircleConfig: {
        domId: 'chart-sale-circle',
        valueKey: 'sales',
        nameKey: 'source'
      },
      chartSaleLineConfig: {
        domId: 'chart-sale-line',
        xAxisKey: 'days',
        seriesKey: 'sales'
      },
      tableList: []
    };
  },
  created() {
    this.getWarehouseDate();
  },
  mounted() {
    this.getSaleGraphData();
  },
  watch: {
    warehouseId() {
      this.getWarehouseDate();
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
      this.getSaleGraphData();
    },
    getSaleGraphData() {
      $http.getSaleGraphData({ days: this.saleDateRadio }).then(res => {
        this.saleTotal = res.data.total;
        this.initChartCircle(res.data.pie, this.chartSaleCircleConfig);
        this.initChartLine(res.data.daily, this.chartSaleLineConfig);
      });
      $http.getSaleDetailData({ days: this.saleDateRadio }).then(res => {
        this.tableList = res.data;
      });
    },
    circleList(pie, value, name) {
      const legedData = [];
      const circleList = pie.map(i => {
        legedData.push(i[name]);
        return { value: i[value], name: i[name] };
      });
      return { legedData, circleList };
    },
    initChartCircle(pie, chartConfig) {
      const { legedData, circleList } = this.circleList(
        pie,
        chartConfig.valueKey,
        chartConfig.nameKey
      );
      const echarCircle = echarts.init(document.getElementById(chartConfig.domId));
      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        }
      };
      option.legend = {
        orient: 'vertical',
        left: 10,
        data: legedData
      };
      option.series = [
        {
          name: '包裹概览',
          type: 'pie',
          radius: ['50%', '70%'],
          label: {
            formatter: ' {d}% '
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: circleList
        }
      ];
      echarCircle.setOption(option);
      window.onresize = echarCircle.resize;
    },
    initChartLine(data, chartConfig) {
      let xData = [];
      let seriesData1 = [];
      data.forEach(item => {
        xData.push(item[chartConfig.xAxisKey]);
        seriesData1.push(item[chartConfig.seriesKey]);
      });
      const echarLine = echarts.init(document.getElementById(chartConfig.domId));
      const packageOption = {
        color: ['#9969BD'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['营业额']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '营业额',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            barWidth: '10px',
            data: seriesData1
          }
        ]
      };
      echarLine.setOption(packageOption);
      window.onresize = echarLine.resize;
    },
    getWarehouseDate() {
      if (!this.warehouseId) return;
      $http.getSaleTotalData().then(res => {
        this.statistics[0].count = res.data.created;
        this.statistics[1].count = res.data.wait;
        this.statistics[2].count = res.data.wait_ship;
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
    color: #23a13b;
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
    .total {
      p:first-child {
        color: #909399;
      }
      .value {
        font-size: 24px;
      }
    }
    .echart {
      width: 100%;
      display: flex;
      .chart-line {
        width: 55%;
        height: 300px;
      }
      .chart-circle {
        width: 45%;
        height: 300px;
      }
    }
  }
  .container-table {
    width: 100%;
    position: relative;
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
  }
}
</style>
