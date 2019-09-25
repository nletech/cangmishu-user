<template>
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
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </el-col>
        <el-col :span="2" :offset="5">
            <el-select
                v-model="inboundTypeValue"
                clearable
                @change="handlerChange"
                size="small"
                :placeholder="$t('InboundListType')">
                <el-option  v-for="item in this.inboundTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="2" :offset="1">
            <el-select
                v-model="inboundStatus"
                clearable
                size="small"
                @change="handlerChange"
                :placeholder="$t('inboundstatus')">
                <el-option
                    v-for="item in this.inboundStatusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="2" :offset="1">
            <el-select
                v-model="distributorValue"
                clearable
                size="small"
                @change="handlerChange"
                :placeholder="$t('supplier')">
                <el-option
                    v-for="item in this.distributorList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="4" :offset="1">
            <el-input
                size="small"
                :placeholder="$t('PleaseEnterNumber')"
                v-model="codeValue"
                @change="handlerChange"
                @clear="handlerChange">
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="handlerChange">
                    </el-button>
            </el-input>
        </el-col>
    </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  name: 'inboundListSearch',
  mixins: [mixin],
  data() {
    return {
      dateValue: [], // 选择时间
      inboundTypeValue: '',
      inboundTypeList: [],
      inboundStatus: '',
      distributorValue: '',
      distributorList: [],
      codeValue: '',
    };
  },
  created() {
    this.getTypeList();
    this.getDistributors();
  },
  computed: {
    inboundStatusList() {
      return [
        { id: 1, name: this.$t('DRK') },
        { id: 3, name: this.$t('RKWC') },
      ];
    },

    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    getTypeList() {
      if (!this.warehouseId) return;
      $http.getBatchType({ warehouse_id: this.warehouseId })
        .then((res) => {
          this.inboundTypeList = res.data.data;
        });
    }, // 入库单分类
    getDistributors() {
      $http.queryDistributor({ all: 1 }).then((res) => {
        this.distributorList = res.data;
      });
    },
    handlerClear() {
      $http.getInbounds({
        warehouse_id: this.warehouseId,
      })
        .then((res) => {
          this.$emit('data_cb', res);
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
        distributor_id: this.distributorValue,
        status: this.inboundStatus,
        type_id: this.inboundTypeValue,
        keywords: this.codeValue,
      };
      $http.getInbounds(query)
        .then((res) => {
          this.$emit('data_cb', res);
        });
    },
  },
};

</script>
