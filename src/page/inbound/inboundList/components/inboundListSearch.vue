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
                placeholder="按单据号"
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
            @click="gotoAddPage"
            icon="el-icon-plus"
            style="margin-left:10px;"
          >
            新增入库单
          </el-button>
          <el-button
            size="small"
            type="primary"
            class="fr"
            @click="$router.push({ name: 'inventoryImport' })"
            icon="el-icon-plus"
            style="margin-left:10px;"
          >
            导入
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
              <el-form-item label="创建日期 :">
                <date-range ref="date" @on-date-change="handlerDateChange" />
              </el-form-item>
              <el-divider />
              <el-form-item class="form-no-bottom" label="入库分类 :">
                <group-radio
                  @on-value-change="handlerChange"
                  v-model="inboundTypeValue"
                  :options="inboundTypeList"
                />
              </el-form-item>
              <el-divider />
              <el-form-item class="form-no-bottom" label="入库状态 :">
                <group-radio
                  @on-value-change="handlerChange"
                  v-model="inboundStatus"
                  :options="inboundStatusList"
                />
              </el-form-item>
              <el-divider />
              <el-form-item class="form-no-bottom" label="供应商 :">
                <el-select
                  v-model="distributorValue"
                  clearable
                  size="small"
                  @change="handlerChange"
                  :placeholder="$t('supplier')"
                >
                  <el-option
                    v-for="item in this.distributorList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
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
import mixin from '@/mixin/form_config';
import searchFilter from '@/components/search-filter';
import dateRange from '@/components/date-range';
import groupRadio from '@/components/group-radio';

export default {
  name: 'inboundListSearch',
  components: {
    searchFilter,
    dateRange,
    groupRadio
  },
  mixins: [mixin],
  data() {
    return {
      btnFilterSearch: {},
      isFilterOpen: false,
      dateValue: {
        beginTime: null,
        endTime: null
      }, // 选定的选择时间
      inboundTypeValue: '',
      inboundTypeList: [],
      inboundStatus: '',
      distributorValue: '',
      distributorList: [],
      keywords: ''
    };
  },
  created() {
    this.getTypeList();
    this.getDistributors();
    if (this.$route.query.checked) {
      this.inboundStatus = 1; // 待入库
      this.handlerChange();
    }
  },

  computed: {
    inboundStatusList() {
      return [
        { id: 1, name: this.$t('DRK') },
        { id: 3, name: this.$t('RKWC') }
      ];
    },

    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    }
  },
  methods: {
    gotoAddPage() {
      this.$router.push({
        name: 'addInbound'
      });
    }, // 添加
    getTypeList() {
      if (!this.warehouseId) return;
      $http.getBatchType({ warehouse_id: this.warehouseId }).then(res => {
        this.inboundTypeList = res.data.data;
      });
    }, // 入库单分类
    getDistributors() {
      $http.queryDistributor({ all: 1 }).then(res => {
        this.distributorList = res.data;
      });
    },
    handlerDateChange(v) {
      this.dateValue = v;
      this.handlerChange();
    },
    handlerClearConditions() {
      this.distributorValue = '';
      this.inboundTypeValue = '';
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
        distributor_id: this.distributorValue,
        status: this.inboundStatus,
        type_id: this.inboundTypeValue,
        keywords: this.keywords
      };
      this.$emit('queryParams', query);
    }
  }
};
</script>
