<template>
  <div :class="$style.no_authentication">
    <el-row style="min-width:1140px;">
      <el-col :span="10">
        <div class="home_left">
          <div class="notice">
            <el-tabs v-model="activeLabel">
              <el-tab-pane label="通知" name="1" type="card" class="message">
                <p v-for="(item, index) in noticeList" :key="index">
                  {{item.notice_time.slice(0, 10)}}
                  {{item.notice_info}}
                </p>
                <span v-if="noticeList.length === 0">暂无通知</span>
              </el-tab-pane>
              <el-tab-pane label="公告" name="2" class="announcement">
                <p>欢迎使用EUT仓储共享平台!</p>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="kuaijie">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="router_card newin">
                   <i class="iconfont">&#xe7aa;</i>
                   <el-button
                    type="text"
                    @click="$router.push({name: 'addInbound'})"
                    icon="el-icon-plus">
                    新建入库单
                  </el-button>
                </div>
              </el-col>
              <!-- <el-col :span="12">
                <div class="router_card newout">
                  <i class="iconfont">&#xe7aa;</i>
                  <el-button
                    type="text"
                    @click="$router.push({name: 'addOutbound'})"
                    @click="handlePanelClick('outboundList')"
                    icon="el-icon-plus">
                    新建出库单
                  </el-button>
                </div>
              </el-col> -->
            <el-col :span="12">
                <div class="router_card">
                  <i class="iconfont" style="color: RGBA(216, 211, 244, 1)">&#xe600;</i>
                  <el-button
                    type="text"
                    @click="$router.push({name: 'outboundList'})"
                    icon="el-icon-tickets">
                    出库单列表
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="router_card">
                  <i class="iconfont" style="color: RGBA(216, 211, 244, 1)">&#xe633;</i>
                  <el-button
                    type="text"
                    @click="$router.push({name: 'inventoryManage'})"
                    icon="el-icon-tickets">
                    库存管理
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="router_card">
                  <i class="iconfont" style="color: RGBA(216, 211, 244, 1)">&#xe671;</i>
                  <el-button
                    type="text"
                    @click="$router.push({name: 'logisticsQuery'})"
                    icon="el-icon-zoom-in">
                    物流查询
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="home_right">
          <header>
            数据栏
            <el-select
              v-model="warehouse_id"
              size="small"
              @change="gethomeWarehouseData" style="float:right;">
              <el-option
                v-for="item in boundList"
                :label="item.name_cn"
                :value="item.id" :key="item.id">
              </el-option>
            </el-select>
          </header>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="data_card">
                <p>今日出库次数</p>
                <p class="card_number">{{homedata.order_count}}</p>
                <p class="colorchange">本月出库次数：{{homedata.month_order_count}}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="data_card">
                <p>今日入库次数</p>
                <p class="card_number">{{homedata.batch_count}}</p>
                <p class="colorchange">本月入库次数：{{homedata.month_batch_count}}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="data_card">
                <p>可用库存数</p>
                <p class="card_number">{{homedata.product_total | num_is_no}}</p>
              </div>
            </el-col>
          </el-row>

          <div style="margin:20px auto;">
            <el-date-picker
              :clearable=false
              size="mini"
              @change="getEchartsData"
              v-model="chart_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="data_box">
            <div id="myCharts" style="width: 100%;height: 400px;"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
   :visible.sync="centerDialogVisible"
   width="30%"
   center>
   <div :class="$style.dialogcentered">
     <p>请选择仓库</p>
    <el-radio-group v-model="selectWarehouse">
      <el-radio-button :class="$style.selectline"
                       v-for="item in warehouseList"
                       :label="item.warehouse.name_cn" :key="item.warehouse.id">
      </el-radio-button>
    </el-radio-group>
   </div>
   <span slot="footer" class="dialog-footer">
     <el-button type="primary" @click="handleConfirm">确 定</el-button>
   </span>
 </el-dialog>
  </div>
</template>

<script>
// import MyGroup from '@/components/my_group';
// import MyDate from '@/components/my_date';
import $http from '@/api';
// import echarts from 'echarts';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/component/grid';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/component/legend');

export default {
  name: 'normal_home',
  data() {
    return {
      activeLabel: '',
      warehouse_id: '',
      noticeList: [],
      boundList: [],
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
      centerDialogVisible: false,
      noWarehouse: true,
      selectWarehouse: '',
      routeValue: '',
    };
  },
  created() {
    this.activeLabel = '1';
    this.getNoticeList();
    this.getBoundList();
  },
  computed: {
    warehouseList() {
      return this.$store.state.warehouseList;
    },
  },
  mounted() {
    setTimeout(() => {
      this.initCharts();
      this.getEchartsData();
    }, 100);
  },
  methods: {
    handlePanelClick(val) {
      if (this.$store.state.config.warehouseList.length > 1
          && !this.$store.state.config.setWarehouseId) {
        this.centerDialogVisible = true;
        this.routeValue = val;
      } else {
        this.$router.push({ name: val });
      }
    },
    handleConfirm() {
      this.centerDialogVisible = false;
      this.warehouseList.forEach((element) => {
        if (element.warehouse.name_cn === this.selectWarehouse) {
          this.$store.commit('config/setWarehouseId', element.warehouse.id);
          sessionStorage.setItem('WAREHOUSEID', element.warehouse.id);
          sessionStorage.setItem('WAREHOUSENAME', element.warehouse.name_cn);
          $http.toggleWarehouse(element.warehouse.id).then(() => {
          });
        }
      });
      this.$router.push({ name: this.routeValue });
    },
    // 初始化图表
    initCharts() {
      this.myCharts = echarts.init(document.getElementById('myCharts'));
      window.onresize = this.myCharts.resize;
    },
    // 获取通知列表
    getNoticeList() {
      $http.noticeList().then((res) => {
        this.noticeList = res.data;
      });
    },
    // 获取仓库列表
    getBoundList() {
      const warehouseParams = {
        page: 1,
        page_size: 100,
        from: 1,
      };
      $http.warehouse(warehouseParams).then((res) => {
        this.boundList = res.data.data;
        if (!res.data.data.length) return;
        if (!this.warehouse_id) {
          this.warehouse_id = this.boundList[0].id;
        }
        this.gethomeWarehouseData();
      });
    },
    // getTimeEcharts() {
    //   const choosedate = {
    //     start_time: this.chart_time[0],
    //     end_time: this.chart_time[1],
    //   };
    //   $http.echartsData(choosedate).then((res) => {
    //     this.echartsdata = res.data.data.reverse();
    //     this.setCharts();
    //   });
    // },
    // 首页仓库数据
    gethomeWarehouseData() {
      $http.homeWarehouseData({ warehouse_id: this.warehouse_id }).then((res) => {
        this.homedata = res.data;
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
    // 首页图表数据
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
      echartsdate.warehouse_id = this.warehouse_id || '';
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
    // 注入图表配置
    setCharts() {
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
    },
  },
};
</script>

<style module lang="less">
@import '../../../less/public_variable.less';
.selectcentered {
  width: 200px;
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
}
.dialogcentered {
  margin: auto;
  text-align: center;
  font-size: 20px;
}
.selectline {
  display: block!important;
  margin-top: 20px;
  span {
    display: inline-block;
    width: 200px;
    border-left: 1px solid #ccc;
    border-radius: 4px;
  }
}
</style>
<style lang="less" scoped>
@margin: 20px;
@margin-bottom: 20px;
@border: 1px solid #ccc;
@box-shadow: 2px 0px 4px rgba(109,96,186,0.3);
// .no_authentication {
//   min-width: 1140px;
// }
.home_left {
  margin: @margin;
}
.home_right {
  background-color: white;
  margin: 20px 20px 20px 0;
  padding: 20px;
  height: 650px;
  border:  @border;
  box-shadow: @box-shadow;
  header {
    font-size: 24px;
    padding-bottom: 20px;
    margin-bottom: @margin-bottom;
    border-bottom: @border;
  }
  .data_card {
    border: @border;
    box-shadow: @box-shadow;
    height: 130px;
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
}
.notice {
  background-color: white;
  box-shadow: @box-shadow;
  padding: 10px 20px;
  height: 250px;
  overflow-y:auto;
  margin-bottom: @margin-bottom;
  border: @border;
  .announcement p{
    text-align: center;
  }
  .message p {
    border-bottom: @border;
  }
}
.kuaijie {
  .router_card {
    height: 100px;
    min-width: 200px;
    margin: 10px 0;
    background-color: white;
    box-shadow: @box-shadow;
    border: @border;
    i{
      float: left;
      font-size: 40px;
      color: #fff;
      margin: 30px 20px;
    }
    .el-button {
      float: right;
      margin: 34px 20px 0 0;
    }
  }
  .newin {
    background-color: #D8D3F4;
  }
  .newout {
    background-color: #D4E4FF;
  }
  .el-button {
    margin-bottom: @margin-bottom;
  }
}
</style>
