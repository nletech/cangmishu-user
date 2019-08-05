<template>
    <div>
        <el-col :span="3">
            <el-date-picker
                v-model="dateValue"
                @change="handlerChange"
                clearable
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
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
                placeholder="预计出库时间"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </el-col>
        <el-col :span="3" :offset="3">
            <el-select
                v-model="outboundStatus"
                clearable
                size="small"
                @change="handlerChange"
                placeholder="请选择状态">
                <el-option
                    v-for="item in this.outboundStatusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="4" :offset="1">
            <el-row>
                <el-col :span="21">
                    <el-input v-model="outboundCode"
                              clearable
                              @change="handlerChange"
                              @clear="handlerChange"
                              size="small"
                              placeholder="请输入出库单号">
                    </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                        <el-button
                            size="small"
                              @click="handlerChange">
                              搜索
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
      outboundStatus: '', // 选定的出库单状态
      outboundStatusList: [
        { id: 0, name: '订单已取消' },
        { id: 1, name: '待拣货' },
        { id: 2, name: '已出库' },
      ],
      outboundCode: '', // 输入的出库单号
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
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
        keywords: this.outboundCode,
      };
      $http.queryOrder(query)
        .then((res) => {
          this.$emit('data_cb', res);
        });
    },
  },
};

</script>
