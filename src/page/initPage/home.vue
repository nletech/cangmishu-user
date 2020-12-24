<template>
  <div class="container">
    <div class="container-column-header">
      <div class="statistics">
        <h3 class="statistics-title">{{ $t('DataAnalysis') }}:</h3>
        <el-row class="statistics-container">
          <el-col
            v-for="item in statistics"
            :key="item.name"
            :xs="4"
            :sm="4"
            :md="4"
            :lg="3"
            :xl="3"
            class="statistics-container-item"
          >
            <p>{{ $t(item.name) }}</p>
            <p :class="['item_number', item.color ? item.color : '']">
              <span @click="goToTag(item.pathName)">{{ item.count }}</span>
            </p>
          </el-col>
          <el-col :offset="4" :md="24" :lg="6" :xl="6" class="wechat-qr">
            <div class="wechat-qr-item">
              <div class="wechat-qr-item-image">
                <img width="100%" height="100%" src="../../assets/img/Wechatcard1.png" alt="" />
                <p>仓秘书小程序</p>
                <p class="subtitle">同步数据</p>
              </div>
            </div>
            <div class="wechat-qr-item">
              <div class="wechat-qr-item-image">
                <img width="100%" height="100%" src="../../assets/img/WechatIMG1663.jpeg" alt="" />
                <p>仓秘书公众号</p>
                <p class="subtitle">推送相关报表数据</p>
              </div>
            </div>
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
    <div class="container-echat">
      <div class="title">
        <div>库存分析</div>
        <div>
          时间：<el-radio-group v-model="stockDateRadio" @change="onStockRadioCahnge" size="small">
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="-1">昨天</el-radio-button>
            <el-radio-button label="30">最近三十天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="total">
        <el-row>
          <el-col :span="6">
            <p>总入库</p>
            <p class="value red-color">{{ stockTotal.stock_in_num }}</p>
          </el-col>
          <el-col :span="6">
            <p>总出库</p>
            <p class="value">{{ stockTotal.stock_out_num }}</p>
          </el-col>
          <el-col :span="6">
            <p>缺货</p>
            <p class="value red-color">{{ stockTotal.stock_shortage }}</p>
          </el-col>
        </el-row>
      </div>
      <div class="echart">
        <div class="chart-circle" id="chart-stock-circle"></div>
        <div class="chart-line" id="chart-stock-line"></div>
      </div>
    </div>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

const echarts = require('echarts/lib/echarts');
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/graphic';

export default {
  name: 'home',
  mixins: [mixin],
  data() {
    return {
      statistics: [
        {
          name: 'warehouseStock',
          count: '',
          pathName: 'inventoryManage'
        },
        {
          name: 'ProductData',
          count: '',
          pathName: 'goodsManage'
        },
        {
          name: 'OutboundData',
          count: '',
          pathName: 'saleList'
        },
        {
          name: 'Warning',
          count: '',
          pathName: 'inventoryManage',
          color: 'red-color'
        }
        // {
        //   name: 'UnShelf',
        //   count: '',
        //   pathName: 'inboundList'
        // },
        // {
        //   name: 'UnConfirm',
        //   count: '',
        //   pathName: 'saleList',
        //   color: 'green-color'
        // }
      ],
      saleTotal: {},
      saleDateRadio: '1',
      stockTotal: {},
      stockDateRadio: '1',
      chartSaleCircleConfig: {
        domId: 'chart-sale-circle',
        valueKey: 'sales',
        nameKey: 'source'
      },
      chartStockCircleConfig: {
        domId: 'chart-stock-circle',
        valueKey: 'count',
        nameKey: 'type'
      },
      chartSaleLineConfig: {
        domId: 'chart-sale-line',
        xAxisKey: 'days',
        seriesKey: 'sales'
      },
      chartStockLineConfig: {
        domId: 'chart-stock-line',
        xAxisKey: 'days',
        seriesKey: 'stock_in_num',
        seriesKey2: 'stock_out_num'
      }
    };
  },
  created() {
    this.getWarehouseDate();
  },
  mounted() {
    this.getEchartSaleData();
    this.getEchartStockData();
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    }
  },
  watch: {
    warehouseId() {
      this.getWarehouseDate();
    },
    lang() {}
  },
  methods: {
    goToTag(tag, query) {
      this.$router.push({
        name: tag,
        query
      });
    },
    onSaleRadioCahnge() {
      this.getEchartSaleData();
    },
    onStockRadioCahnge() {
      this.getEchartStockData();
    },
    getEchartSaleData() {
      $http.getHomeSaleData({ days: this.saleDateRadio }).then(res => {
        this.saleTotal = res.data.total;
        this.initChartCircle(res.data.pie, this.chartSaleCircleConfig);
        this.initChartLine(res.data.daily, this.chartSaleLineConfig);
      });
    },
    getEchartStockData() {
      $http.getHomeStockData({ days: this.stockDateRadio }).then(res => {
        this.stockTotal = res.data.total;
        this.initChartCircle(res.data.pie, this.chartStockCircleConfig);
        this.initChartLine(res.data.daily, this.chartStockLineConfig);
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
        color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        }
      };
      option.legend = {
        orient: 'vertical',
        left: 10,
        data: legedData.length ? legedData : ['暂无']
      };
      option.series = [
        {
          name: '百分比',
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
          data: legedData.length ? circleList : [{ value: 0, name: '暂无' }]
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
      const isStock = chartConfig.domId.indexOf('stock') !== -1;
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
    getWarehouseDate() {
      if (!this.warehouseId) return;
      $http.getHomeTotalData().then(res => {
        this.statistics[0].count = res.data.total_stock;
        this.statistics[1].count = res.data.total_product;
        this.statistics[2].count = res.data.total_order;
        this.statistics[3].count = res.data.stock_warning;
        // this.statistics[4].count = res.data.wait_shelf;
        // this.statistics[5].count = res.data.wait_shipment;
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
      .statistics-title {
        margin: 20px 0 20px 20px;
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
}
</style>
