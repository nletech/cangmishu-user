<template>
  <div class="clearfix">
    <el-card shadow="never" class="oper-btn-card">
      <div class="clearfix">
        <el-form
          class="fl form-no-bottom"
          :inline="true"
          label-position="left"
          label-width="80px"
          @keydown.enter.native="handlerChange"
        >
          <el-form-item>
            <div class="btn-group">
              <el-input
                v-model="keywords"
                clearable
                style="width: 360px"
                placeholder="按单据号,收件人手机号"
                size="small"
              />
              <el-button
                type="primary"
                @click="handlerChange"
                size="small"
                style="margin-left:10px;"
              >
                搜索
              </el-button>
              <el-checkbox
                v-model="notShowCancel"
                true-label="1"
                false-label="0"
                border
                type="text"
                size="small"
                style="margin-left:10px;"
                @change="handlerChange"
              >
                不显示已作废单据
              </el-checkbox>
              <el-button
                type="default"
                @click="isFilterOpen = !isFilterOpen"
                size="small"
                style="margin-left:10px;"
              >
                展开筛选
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="fr">
          <el-button
            size="small"
            type="primary"
            class="fr"
            @click="addSaleList"
            icon="el-icon-plus"
            style="margin-left:10px;"
          >
            {{ $t('addSaleList') }}
          </el-button>
          <el-button size="small" :disabled="isDisabled" @click="handlerExportOrder">
            {{ $t('Export') }}
          </el-button>
        </div>
      </div>
      <search-filter
        v-show="isFilterOpen"
        :search="btnFilterSearch"
        :clear="handlerClearConditions"
      >
        <template>
          <div>
            <el-form ref="form" label-width="80px" class="form-no-bottom" size="mini">
              <el-form-item label="下单日期 :">
                <date-range ref="date" @on-date-change="handlerDateChange" />
              </el-form-item>
              <el-divider />
              <el-form-item class="form-no-bottom" label="出库状态 :">
                <group-radio
                  @on-value-change="handlerChange"
                  v-model="outboundStatus"
                  :options="outboundStatusList"
                />
              </el-form-item>
              <el-divider />
              <el-form-item class="form-no-bottom" label="出库日期 :">
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
              </el-form-item>
            </el-form>
          </div>
        </template>
      </search-filter>
    </el-card>
  </div>
</template>

<script>
import $http from '@/api';
import searchFilter from '@/components/search-filter';
import dateRange from '@/components/date-range';
import groupRadio from '@/components/group-radio';
import baseApi from '@/lib/axios/base_api';

export default {
  name: 'outboundListSearch',
  components: {
    searchFilter,
    dateRange,
    groupRadio
  },
  data() {
    return {
      btnFilterSearch: {},
      isDisabled: false,
      isFilterOpen: false,
      dateValue: {
        beginTime: null,
        endTime: null
      }, // 选定的选择时间
      keywords: '',
      planDateValue: '', // 选定的预计出库时间
      outboundStatus: '', // 选定的销售单状态
      outboundStatusList: [],
      notShowCancel: '1'
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
    },
    api() {
      return this.$store.state.token.token.substring(7);
    },
    currentLang() {
      return localStorage.getItem('lang') || 'cn';
    }
  },
  methods: {
    addSaleList() {
      this.$router.push({
        name: 'addSaleList'
      });
    }, // 添加出库单
    getOutboundTypes() {
      $http.getOutboundTypes().then(res => {
        this.outboundStatusList = res.data;
      });
    },
    handlerDateChange(v) {
      this.dateValue = v;
      this.handlerChange();
    },
    handlerClearConditions() {
      this.outboundStatus = '';
      this.planDateValue = '';
      this.keywords = '';
      this.dateValue = {
        beginTime: null,
        endTime: null
      };
      this.handlerChange();
    },
    handlerChange() {
      const query = {
        warehouse_id: this.warehouseId,
        created_at_b: this.dateValue.beginTime,
        created_at_e: this.dateValue.endTime,
        delivery_date: this.planDateValue,
        status: this.outboundStatus,
        keywords: this.keywords,
        not_show_cancel: this.notShowCancel
      };
      this.$emit('queryParams', query);
    },
    handlerExportOrder() {
      if (!this.warehouseId) return;
      this.isDisabled = true;
      const timer = setTimeout(() => {
        this.isDisabled = false;
        clearTimeout(timer);
      }, 2000);
      window.open(
        `${baseApi.BASE_URL}order/export?api_token=${this.api}&warehouse_id=${this.warehouseId}&${this.tempStr}`
      );
    }
  }
};
</script>
