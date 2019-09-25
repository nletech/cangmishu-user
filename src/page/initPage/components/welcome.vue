<template>
    <div :class="$style.container">
        <div :class="$style.container_column1">
            <div :class="$style.statistics">
                <h3 :class="$style.statistics_title">统计数据:</h3>
                <div :class="$style.statistics_container">
                    <div :class="$style.statistics_container_item">
                        <p>仓库库存:{{stock.all_count}}</p>
                        <p>今日:{{stock.today_count}}</p>
                        <p>本月:{{stock.month_count}}</p>
                        <p>今年:{{stock.year_count}}</p>
                    </div>
                    <div :class="$style.statistics_container_item">
                        <p>商品数据:{{product.all_count}}</p>
                        <p>今日:{{product.today_count}}</p>
                        <p>本月:{{product.month_count}}</p>
                        <p>今年:{{product.year_count}}</p>
                    </div>
                    <div :class="$style.statistics_container_item">
                        <p>订单数据:{{order.all_count}}</p>
                        <p>今日:{{order.today_count}}</p>
                        <p>本月:{{order.month_count}}</p>
                        <p>今年:{{order.year_count}}</p>
                    </div>
                </div>
            </div>

            <div :class="$style.todo">
                <h3 :class="$style.title">待办事宜:</h3>
                <div :class="$style.todo_main">
                    <div :class="$style.todo_main_item">
                        <p>库存预警</p>
                        <p :class="$style.todo_main_item_number">10</p>
                    </div>
                    <div :class="$style.todo_main_item">
                        <p>待上架</p>
                        <p :class="$style.todo_main_item_number">10</p>
                    </div>
                    <div :class="$style.todo_main_item">
                        <p>待出库</p>
                        <p :class="$style.todo_main_item_number">10</p>
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.container_column2">
            <div :class="$style.chart">
                <el-date-picker
                  :class="$style.chart_date_picker"
                  :clearable=false
                  size="mini"
                  @change="getEchartsData"
                  v-model="chart_time"
                  type="daterange"
                  :range-separator="$t('to')"
                  :start-placeholder="$t('startDate')"
                  :end-placeholder="$t('endDate')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                <div
                    :class="$style.myChart"
                    id="myCharts"
                    style="height:420px">
                </div>
            </div>

            <div :class="$style.wechatQR">
                <div :class="$style.wechatQR_item">
                    <p :class="$style.wechatQR_item_title">订货小程序演示</p>
                    <div>
                        <img width="200px" height="200px" src="../../../assets/img/Wechatcard1.png" alt="">
                    </div>
                    <el-button @click="goToTag('shops')">免费生成我的小程序</el-button>
                </div>
                <div :class="$style.wechatQR_item">
                    <p :class="$style.wechatQR_item_title">官方技术支持公众号</p>
                    <div>
                        <img width="200px" height="200px" src="../../../assets/img/Wechatcard2.png" alt="">
                    </div>
                    <p>有任何问题都可以留言</p>
                </div>
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
  name: 'normal_home',
  mixins: [mixin],
  data() {
    return {
      echartsdata: [],
      myCharts: {},
      chart_time: [],
      homedata: {
        batch_count: 0, // 今日入库次数
        order_count: 0, // 今日出库次数
        month_batch_count: 0, // 本月入库次数
        month_order_count: 0, // 本月出库次数
        product_total: 0, // 可用库存数
      },
      order: {}, // 订单
      product: {}, // 产品
      stock: {}, // 库存
      todo: {}, // 待办事项
    };
  },
  created() {
    this.getWarehouseDate();
  },

  mounted() {
    setTimeout(() => {
      this.initCharts();
      this.getEchartsData();
    }, 100);
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

    getEchartsData() {
      let echartsdate;
      if (this.chart_time.length !== 2) {
        const endtime = new Date();
        const starttime = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
        echartsdate = {
          start_time: this.formatTime(starttime),
          end_time: this.formatTime(endtime),
        };
      } else {
        echartsdate = {
          start_time: this.chart_time[0],
          end_time: this.chart_time[1],
        };
      }
      echartsdate.warehouse_id = this.warehouseId || '';
      $http.echartsData(echartsdate).then((res) => {
        if (res.data.length !== 0) {
          this.echartsdata = res.data.data.reverse();
        } else {
          this.echartsdata = [
            { time: echartsdate.end_time,
              batch_count: 0,
              order_count: 0,
              batch_product_num: 0,
              order_product_num: 0 },
          ];
        }
        this.setCharts();
      });
    },

    setCharts() {
      if (this.echartsdata && this.echartsdata === 0) return;
      if (this.$i18n.locale === 'cn') {
        this.myCharts.setOption({
          legend: {
            data: ['入库次数', '出库次数', '入库货品数', '出库货品数'],
          },
          xAxis: {
            data: this.echartsdata.map(item => item.time),
            splitLine: {
              show: true,
            },
          },
          yAxis: {
            splitLine: {
              show: true,
            },
          },
          series: [{
            name: '入库次数',
            type: 'bar',
            data: this.echartsdata.map(item => item.batch_count),
          }, {
            name: '出库次数',
            type: 'bar',
            data: this.echartsdata.map(item => item.order_count),
          }, {
            name: '入库货品数',
            type: 'line',
            data: this.echartsdata.map(item => item.batch_product_num),
          }, {
            name: '出库货品数',
            type: 'line',
            data: this.echartsdata.map(item => item.order_product_num),
          }],
          color: ['#abc66c', '#97c1ff', '#ff9797', '#6cc67f'],
        });
      } else if (this.$i18n.locale === 'en') {
        this.myCharts.setOption({
          legend: {
            data: ['Inbound times', 'Outbound times', 'Inbound Item number', 'Outbound Item number'],
          },
          xAxis: {
            data: this.echartsdata.map(item => item.time),
            splitLine: {
              show: true,
            },
          },
          yAxis: {
            splitLine: {
              show: true,
            },
          },
          series: [{
            name: 'Inbound times',
            type: 'bar',
            data: this.echartsdata.map(item => item.batch_count),
          }, {
            name: 'Outbound times',
            type: 'bar',
            data: this.echartsdata.map(item => item.order_count),
          }, {
            name: 'Inbound Item number',
            type: 'line',
            data: this.echartsdata.map(item => item.batch_product_num),
          }, {
            name: 'Outbound Item number',
            type: 'line',
            data: this.echartsdata.map(item => item.order_product_num),
          }],
          color: ['#abc66c', '#97c1ff', '#ff9797', '#6cc67f'],
        });
      }
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
      $http.homeWarehouseData({ warehouse_id: this.warehouse_Id }).then((res) => {
        if (res.status) return;
        this.order = res.data.order;
        this.product = res.data.product;
        this.stock = res.data.stock;
        this.todo = res.data.todo;
        console.log(res, 'res');
      });
    },

    initCharts() {
      this.myCharts = echarts.init(document.getElementById('myCharts'));
      window.onresize = this.myCharts.resize;
    },

  },
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

@bgc: #fff;
@margin-bottom: 20px;
@box-shadow: 2px 0px 4px rgba(109,96,186,0.3);
  .container {
    width: @width;
    margin: 10px auto;
    .container_column1 {
      width: 100%;
      display: flex;
      .statistics {
        width: 50%;
        margin: 10px;
        padding: 5px;
        border: 1px solid #D8D3F4;
        background-color: @bgc;
        .statistics_title {
          margin: 0 0 0 40px;
          font-weight: bold;
        }
        .statistics_container {
          width: 100%;
          display: flex;
          justify-content: space-around;
          .statistics_container_item {
            text-align: center;
            margin: 20px;
            width: 33%;
            height: 100px;
            &:nth-child(1) {
              border-right: 1px solid #ccc;
            }
            &:nth-child(2) {
              border-right: 1px solid #ccc;
            }
          }
        }
      }
      .todo {
        width: 50%;
        margin: 10px;
        padding: 5px;
        border: 1px solid #D8D3F4;
        background-color: @bgc;
        .title {
          margin: 0 0 0 40px;
          font-weight: bold;
        }
        .todo_main {
          width: 100%;
          display: flex;
          justify-content: space-around;
          .todo_main_item {
            text-align: center;
            margin: 20px;
            width: 33%;
            height: 100px;
            font-size: 16px;
            .todo_main_item_number {
              margin: 20px 0 0 0;
              font-size: 20px;
            }
            &:nth-child(1) {
              border-right: 1px solid#D8D3F4;
            }
            &:nth-child(2) {
              border-right: 1px solid#D8D3F4;
            }
          }
        }
      }
    }
    .container_column2 {
      width: 100%;
      display: flex;
      position: relative;
      .chart {
        width: 50%;
        margin: 10px;
        padding: 5px;
        background-color: @bgc;
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
      .wechatQR {
        width: 50%;
        height: 470px;
        margin: 10px;
        padding: 5px;
        border: 1px solid #D8D3F4;
        background-color: @bgc;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .wechatQR_item {
          margin: 10px;
          padding: 5px;
          text-align: center;
          .wechatQR_item_title {
            margin: 0 0 20px 0;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
