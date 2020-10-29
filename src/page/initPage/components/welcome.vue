<template>
    <div :class="$style.container">
        <div :class="$style.container_column1">
            <div :class="$style.statistics">
                <h3 :class="$style.statistics_title">{{$t('DataAnalysis')}}:</h3>
                <div :class="$style.statistics_container">
                    <div :class="$style.statistics_container_item">
                        <p>{{$t('warehouseStock')}}</p>
                        <p :class="$style.item_number">
                          <span @click="goToTag('inventoryManage')">{{stock.all_count}}</span>
                        </p>
                        <div :class="$style.item_date">
                          <div :class="$style.item_date_title">
                              <p>{{$t('day')}}:</p>
                              <p>{{$t('month')}}:</p>
                              <p>{{$t('year')}}:</p>
                          </div>
                          <div :class="$style.item_date_number">
                            <p>{{stock.today_count}}</p>
                            <p>{{stock.month_count}}</p>
                            <p>{{stock.year_count}}</p>
                          </div>
                        </div>
                    </div>
                    <div :class="$style.statistics_container_item">
                        <p>{{$t('ProductData')}}:</p>
                        <p :class="$style.item_number">
                          <span @click="goToTag('GoodsManage')">{{product.all_count}}</span>
                        </p>
                        <div :class="$style.item_date">
                          <div :class="$style.item_date_title">
                              <p>{{$t('day')}}:</p>
                              <p>{{$t('month')}}:</p>
                              <p>{{$t('year')}}:</p>
                          </div>
                          <div :class="$style.item_date_number">
                            <p>{{product.today_count}}</p>
                            <p>{{product.month_count}}</p>
                            <p>{{product.year_count}}</p>
                          </div>
                        </div>
                    </div>
                    <div :class="$style.statistics_container_item">
                        <p>{{$t('OutboundData')}}:</p>
                        <p :class="$style.item_number">
                          <span @click="goToTag('outboundList')">{{order.all_count}}</span>
                        </p>
                        <div :class="$style.item_date">
                          <div :class="$style.item_date_title">
                              <p>{{$t('day')}}:</p>
                              <p>{{$t('month')}}:</p>
                              <p>{{$t('year')}}:</p>
                          </div>
                          <div :class="$style.item_date_number">
                            <p>{{order.today_count}}</p>
                            <p>{{order.month_count}}</p>
                            <p>{{order.year_count}}</p>
                          </div>
                        </div>
                    </div>
                </div>
            </div>

            <div :class="$style.todo">
                <h3 :class="$style.title">{{$t('Todo')}}:</h3>
                <div :class="$style.todo_main">
                    <div :class="$style.todo_main_item">
                        <p>{{$t('Warning')}}</p>
                        <p :class="$style.todo_main_item_number"><span @click="goToTag('inventoryManage', { checked: true, })">{{todo.stock_warning}}</span></p>
                    </div>
                    <div :class="$style.todo_main_item">
                        <p>{{$t('UnShelf')}}</p>
                        <p :class="$style.todo_main_item_number"><span @click="goToTag('inboundList', { checked: true, })">{{todo.unshelf}}</span></p>
                    </div>
                    <div :class="$style.todo_main_item">
                        <p>{{$t('UnConfirm')}}</p>
                        <p :class="$style.todo_main_item_number"><span @click="goToTag('outboundList', { checked: true, })">{{todo.unconfirm}}</span></p>
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
                    <p :class="$style.wechatQR_item_title">{{$t('OrderWechatMiniProgramDemo')}}</p>
                    <div :class="$style.wechatQR_item_image">
                        <img width="100%" height="100%" src="../../../assets/img/Wechatcard1.png" alt="">
                    </div>
                    <el-button @click="goToTag('shopsManagement')">{{$t('FreetogetWechatMiniProgram')}}</el-button>
                </div>
                <div :class="$style.wechatQR_item">
                    <p :class="$style.wechatQR_item_title">{{$t('WechatOfficialAccount')}}</p>
                    <div :class="$style.wechatQR_item_image">
                        <img width="100%" height="100%" src="../../../assets/img/WechatIMG1663.jpeg" alt="">
                    </div>
                    <p :class="$style.wechatQR_item_text">{{$t('AnyQuestionletmeknow')}}</p>
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
      a: true,
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
    this.initCharts();
    this.getEchartsData();
  },

  computed: {

    desc() {
      return [`${this.$t('Inboundtimes')}`, `${this.$t('Outboundtimes')}`, `${this.$t('InboundItemnumber')}`, `${this.$t('OutboundItemnumber')}`];
    },

    lang() {
      return this.$i18n.locale;
    },

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
    },

  },
  methods: {
    goToTag(tag, query) {
      // eslint-disable-next-line
      this.$router.push({
        name: tag,
        query,
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
      this.myCharts.setOption({
        legend: {
          data: this.desc,
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
          name: `${this.desc[0]}`,
          type: 'bar',
          data: this.echartsdata.map(item => item.batch_count),
        }, {
          name: `${this.desc[1]}`,
          type: 'bar',
          data: this.echartsdata.map(item => item.order_count),
        }, {
          name: `${this.desc[2]}`,
          type: 'line',
          data: this.echartsdata.map(item => item.batch_product_num),
        }, {
          name: `${this.desc[3]}`,
          type: 'line',
          data: this.echartsdata.map(item => item.order_product_num),
        }],
        color: ['#abc66c', '#97c1ff', '#ff9797', '#6cc67f'],
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
      $http.homeWarehouseData({ warehouse_id: this.warehouseId }).then((res) => {
        if (res.status) return;
        this.$nextTick(() => {
          this.order = res.data.order;
          this.product = res.data.product;
          this.stock = res.data.stock;
          this.todo = res.data.todo;
        });
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
    margin: 0 auto;
    .container_column1 {
      width: 100%;
      display: flex;
      color: #918181;
      .statistics {
        width: 50%;
        margin: 10px;
        padding: 5px;
        border: 1px solid #D8D3F4;
        background-color: @bgc;
        .statistics_title {
          margin: 10px 0 0 40px;
          font-weight: bold;
          color: #000;
        }
        .statistics_container {
          width: 100%;
          display: flex;
          justify-content: space-around;
          .statistics_container_item {
            text-align: center;
            margin: 20px;
            width: 33%;
            height: 130px;
            font-size: 16px;
            &:nth-child(1) {
              border-right: 1px solid #ccc;
            }
            &:nth-child(2) {
              border-right: 1px solid #ccc;
            }
            .item_number {
              margin: 10px auto;
              color: #000;
              font-size: 28px;
              cursor: pointer;
            }
            .item_date {
              display: flex;
              align-items: center;
              .item_date_title {
                width: 50%;
                text-align: right;
              }
              .item_date_number {
                width: 50%;
                text-align: center;
                color: #000;
                font-size: 18px;
              }
            }
            span {
              color: #000;
              margin-left: 20px;
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
          margin: 10px 0 0 40px;
          font-weight: bold;
          color: #000;
        }
        .todo_main {
          width: 100%;
          display: flex;
          justify-content: space-around;
          .todo_main_item {
            text-align: center;
            margin: 20px;
            width: 33%;
            height: 130px;
            font-size: 16px;
            .todo_main_item_number {
              margin: 20px 0 0 0;
              color: #000;
              font-size: 28px;
              cursor: pointer;
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
        border: 1px solid #D8D3F4;
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
          .wechatQR_item_image {
            width: 200px;
            height: 200px;
          }
          .wechatQR_item_text {
            margin: 10px;
          }
        }
      }
    }
  }
</style>
