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
              <p>商品管理</p>
              <p @click="goToTag('goodsManage')">查看所有商品</p>
            </el-card>
            <el-card class="card-item" shadow="hover">
              <p>库存管理</p>
              <p @click="goToTag('inventoryManage')">查看所有的库存信息</p>
            </el-card>
            <el-card class="card-item" shadow="hover">
              <p>库存盘点</p>
              <p @click="goToTag('stockTaking')">快速修复库存</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container-echat">
      <div class="title">
        <div>库存分析</div>
        <div>
          时间：<el-radio-group v-model="saleDateRadio" @change="onSaleRadioCahnge" size="small">
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="-1">昨天</el-radio-button>
            <el-radio-button label="30">最近三十天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="echart">
        <div class="chart-circle" id="chart-sale-circle"></div>
        <div class="chart-line" id="chart-sale-line"></div>
      </div>
    </div>
    <div class="container-rank">
      <el-card class="client-order-rank-list" shadow="never">
        <div slot="header" class="clearfix">
          <span> 销售排行榜 </span>
        </div>
        <div v-for="(item, i) in saleRangeList" :key="i" class="client-order-rank-item">
          <div class="index">{{ i + 1 }}</div>
          <div class="count-container">
            <div>{{ item.name }}</div>
            <div class="count">
              <div>
                销量: <span>{{ item.sales }}</span>
              </div>
            </div>
          </div>
          <div>
            <el-image class="image" fit="cover" :src="item.picture"
              ><div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
      </el-card>
      <el-card class="client-order-rank-list" shadow="never">
        <div slot="header" class="clearfix">
          <span> 库存预警列表 </span>
        </div>
        <div v-for="(item, i) in warningRangeList" :key="i" class="client-order-rank-item">
          <div class="index">{{ i + 1 }}</div>
          <div class="count-container">
            <div>{{ item.name }}</div>
            <div class="count">
              <div>
                库存: <span class="green-color">{{ item.stock }}</span>
              </div>
            </div>
          </div>
          <div>
            <el-image class="image" fit="cover" :src="item.pictures">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i></div
            ></el-image>
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
  name: 'inventoryOverview',
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
        valueKey: 'count',
        nameKey: 'type'
      },
      chartSaleLineConfig: {
        domId: 'chart-sale-line',
        xAxisKey: 'days',
        seriesKey: 'stock_in_num',
        seriesKey2: 'stock_out_num'
      },
      saleRangeList: [],
      warningRangeList: []
    };
  },
  created() {
    this.getStocksTotalData();
  },
  mounted() {
    this.getStocksGraphData();
  },
  watch: {
    warehouseId() {
      this.getStocksTotalData();
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
      this.getStocksGraphData();
    },
    getStocksGraphData() {
      $http.getStocksGraphData({ days: this.saleDateRadio }).then(res => {
        this.saleTotal = res.data.total;
        this.initChartCircle(res.data.pie, this.chartSaleCircleConfig);
        this.initChartLine(res.data.daily, this.chartSaleLineConfig);
      });
    },
    circleList(pie, value, name) {
      const legedData = [];
      const circleList = pie.map(i => {
        legedData.push(i.type);
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
        color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
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
      const isStock = chartConfig.domId.indexOf('sale') !== -1;
      const packageOption = {
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
          data: [`${isStock ? '总入库' : '营业额'}`, '总出库']
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
            name: isStock ? '总入库' : '营业额',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            barWidth: '10px',
            data: seriesData1
          }
        ]
      };
      if (isStock) {
        let seriesData2 = [];
        data.forEach(item => {
          seriesData2.push(item[chartConfig.seriesKey2]);
        });
        packageOption.series.push({
          name: '总出库',
          type: 'bar',
          barWidth: '10px',
          z: -12,
          data: seriesData2
        });
      }
      echarLine.setOption(packageOption);
      window.onresize = echarLine.resize;
    },
    getStocksTotalData() {
      if (!this.warehouseId) return;
      $http.getStocksTotalData().then(res => {
        this.statistics[0].count = res.data.stock_count;
        this.statistics[1].count = res.data.stock_lack_count;
        this.statistics[2].count = res.data.product_count;
      });
      $http.getStocksRankData({ days: this.saleDateRadio }).then(res => {
        this.saleRangeList = res.data;
      });
      $http.getStocksWarningData({ days: this.saleDateRadio }).then(res => {
        this.warningRangeList = res.data;
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
        grid-template-columns: 50px 1fr 120px;
        border-bottom: 1px solid #f1f1f1;
        align-items: center;
        padding: 15px 20px;
        &:last-child {
          border-bottom: none;
        }
        .image {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          .el-icon-picture-outline {
            font-size: 40px;
          }
        }
        .count-container {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
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
    }
  }
}
</style>
