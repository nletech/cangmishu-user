<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <div>
    <el-col :span="3">
      <el-date-picker
        v-model="dateValue"
        @change="handlerChange"
        clearable
        type="daterange"
        :start-placeholder="$t('startDate')"
        :end-placeholder="$t('endDate')"
        size="small"
        value-format="yyyy-MM-dd"
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
    </el-col>
    <el-col :span="2" :offset="5">
      <el-date-picker
        v-model="planDateValue"
        @change="handlerChange"
        type="date"
        size="small"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :placeholder="$t('planOutboundTime')"
      >
      </el-date-picker>
    </el-col>
    <el-col :span="3" :offset="4">
      <el-select
        v-model="outboundStatus"
        clearable
        size="small"
        @change="handlerChange"
        :placeholder="$t('selectStatus')"
      >
        <el-option
          v-for="item in this.outboundStatusList"
          :key="item.value"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4" :offset="2">
      <el-row>
        <el-col :span="21">
          <el-input
            v-model="outboundCode"
            clearable
            @change="handlerChange"
            @clear="handlerChange"
            size="small"
            :placeholder="$t('pleaseEnterOutboundNO')"
          >
          </el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button size="small" @click="handlerChange">
            {{ $t('Search') }}
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
import $http from '@/api';

export default {
  name: 'outboundListSearch',
  data() {
    return {
      dateValue: [], // 选定的选择时间
      planDateValue: '', // 选定的预计出库时间
      outboundStatus: '', // 选定的销售单状态
      outboundStatusList: [
        // { id: 0, name: '订单已取消' },
        // { id: 1, name: '待拣货' },
        // { id: 4, name: '待发货' },
        // { id: 5, name: '配送中' },
        // { id: 7, name: '已收货' },
      ],
      outboundCode: '' // 输入的销售单号
    };
  },
  created() {
    this.getOutboundTypes();
    if (this.$route.query.checked) {
      this.outboundStatus = 1; // 待入库
      this.handlerChange();
    }
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    }
  },
  methods: {
    getOutboundTypes() {
      $http.getOutboundTypes().then(res => {
        this.outboundStatusList = res.data;
      });
    },
    handlerChange() {
      // eslint-disable-next-line
      let data = [];
      if (Array.isArray(this.dateValue) && this.dateValue.length === 2) {
        data[0] = this.dateValue[0];
        data[1] = this.dateValue[1];
      } else if (!this.dateValue) {
        data = ['', ''];
      }
      const query = {
        warehouse_id: this.warehouseId,
        created_at_b: data[0],
        created_at_e: data[1],
        delivery_date: this.planDateValue,
        status: this.outboundStatus,
        keywords: this.outboundCode
      };
      $http.queryOrder(query).then(res => {
        this.$emit('data_cb', res);
        this.$emit('queryParams', query);
      });
    }
  }
};
</script>
