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
            <p class="item_number">
              <span @click="goToTag(item.pathName)">{{ item.count }}</span>
            </p>
          </el-col>
          <el-col :md="24" :lg="6" :xl="6" class="wechat-qr">
            <div class="wechat-qr-item">
              <div class="wechat-qr-item-image">
                <img width="100%" height="100%" src="../../assets/img/Wechatcard1.png" alt="" />
                <p>仓秘书小程序</p>
                <p class="subtitle">同步数据</p>
              </div>
              <!-- <el-button @click="goToTag('shopsManagement')">{{
                $t('FreetogetWechatMiniProgram')
              }}</el-button> -->
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
      <div class="chart">
        <el-date-picker
          class="chart_date_picker"
          :clearable="false"
          size="mini"
          @change="getEchartsData"
          v-model="chart_time"
          type="daterange"
          :range-separator="$t('to')"
          :start-placeholder="$t('startDate')"
          :end-placeholder="$t('endDate')"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <div class="myChart" id="myCharts" style="height:420px"></div>
      </div>
    </div>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/component/legend');

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
          pathName: 'GoodsManage'
        },
        {
          name: 'OutboundData',
          count: '',
          pathName: 'outboundList'
        },
        {
          name: 'Warning',
          count: '',
          pathName: 'inventoryManage'
        },
        {
          name: 'UnShelf',
          count: '',
          pathName: 'inboundList'
        },
        {
          name: 'UnConfirm',
          count: '',
          pathName: 'outboundList'
        }
      ],
      echartsdata: [],
      myCharts: {},
      chart_time: [],
      homedata: {
        batch_count: 0, // 今日入库次数
        order_count: 0, // 今日出库次数
        month_batch_count: 0, // 本月入库次数
        month_order_count: 0, // 本月出库次数
        product_total: 0 // 可用库存数
      },
      order: {}, // 订单
      product: {}, // 产品
      stock: {}, // 库存
      todo: {} // 待办事项
    };
  },
  created() {
    this.getWarehouseDate();
  },
  mounted() {
    this.initCharts();
    this.getEchartsData();
  },
  computed: {
    desc() {
      return [
        `${this.$t('Inboundtimes')}`,
        `${this.$t('Outboundtimes')}`,
        `${this.$t('InboundItemnumber')}`,
        `${this.$t('OutboundItemnumber')}`
      ];
    },
    lang() {
      return this.$i18n.locale;
    }
  },
  watch: {
    warehouseId() {
      this.getWarehouseDate();
      this.initCharts();
      this.getEchartsData();
    },
    lang() {
      this.initCharts();
      this.getEchartsData();
    }
  },
  methods: {
    goToTag(tag, query) {
      this.$router.push({
        name: tag,
        query
      });
    },
    getEchartsData() {
      let echartsdate;
      if (this.chart_time.length !== 2) {
        const endtime = new Date();
        const starttime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        echartsdate = {
          start_time: this.formatTime(starttime),
          end_time: this.formatTime(endtime)
        };
      } else {
        echartsdate = {
          start_time: this.chart_time[0],
          end_time: this.chart_time[1]
        };
      }
      echartsdate.warehouse_id = this.warehouseId || '';
      $http.echartsData(echartsdate).then(res => {
        if (res.data.length !== 0) {
          this.echartsdata = res.data.data.reverse();
        } else {
          this.echartsdata = [
            {
              time: echartsdate.end_time,
              batch_count: 0,
              order_count: 0,
              batch_product_num: 0,
              order_product_num: 0
            }
          ];
        }
        this.setCharts();
      });
    },
    setCharts() {
      if (this.echartsdata && this.echartsdata === 0) return;
      this.myCharts.setOption({
        legend: {
          data: this.desc
        },
        xAxis: {
          data: this.echartsdata.map(item => item.time),
          splitLine: {
            show: true
          }
        },
        yAxis: {
          splitLine: {
            show: true
          }
        },
        series: [
          {
            name: `${this.desc[0]}`,
            type: 'bar',
            data: this.echartsdata.map(item => item.batch_count)
          },
          {
            name: `${this.desc[1]}`,
            type: 'bar',
            data: this.echartsdata.map(item => item.order_count)
          },
          {
            name: `${this.desc[2]}`,
            type: 'line',
            data: this.echartsdata.map(item => item.batch_product_num)
          },
          {
            name: `${this.desc[3]}`,
            type: 'line',
            data: this.echartsdata.map(item => item.order_product_num)
          }
        ],
        color: ['#abc66c', '#97c1ff', '#ff9797', '#6cc67f']
      });
    },
    // 处理时间
    formatTime(time) {
      let month = time.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      let date = time.getDate();
      if (date >= 1 && date <= 9) {
        date = `0${date}`;
      }
      return `${time.getFullYear()}-${month}-${date}`;
    },
    getWarehouseDate() {
      if (!this.warehouseId) return;
      $http.homeWarehouseData({ warehouse_id: this.warehouseId }).then(res => {
        if (res.status) return;
        this.order = res.data.order;
        this.product = res.data.product;
        this.stock = res.data.stock;
        this.todo = res.data.todo;
        this.statistics[0].count = this.stock.all_count;
        this.statistics[1].count = this.product.all_count;
        this.statistics[2].count = this.order.all_count;
        this.statistics[3].count = this.todo.stock_warning;
        this.statistics[4].count = this.todo.unshelf;
        this.statistics[5].count = this.todo.unconfirm;
      });
    },
    initCharts() {
      this.myCharts = echarts.init(document.getElementById('myCharts'));
      window.onresize = this.myCharts.resize;
    }
  }
};
</script>

<style lang="less">
.container {
  @bgc: #fff;
  .container-column-header {
    width: 100%;
    background-color: @bgc;
    .statistics {
      width: 100%;
      overflow: hidden;
      .statistics-title {
        margin: 40px 0 20px 40px;
        font-weight: bold;
        color: #000;
        font-size: 26px;
      }
      .statistics-container {
        .statistics-container-item {
          border-right: 1px solid;
          text-align: center;
          p:first-child {
            color: #524f4f;
          }
          p:last-child {
            font-weight: bold;
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
            color: #ccc;
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
    display: flex;
    position: relative;
    .chart {
      width: 50%;
      background-color: @bgc;
      border: 1px solid #d8d3f4;
      .chart_date_picker {
        position: absolute;
        top: 20px;
        left: 15px;
      }
      .myChart {
        margin: 40px 0 0 0;
        width: 100%;
      }
    }
  }
}
</style>
