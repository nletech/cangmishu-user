<template>
  <div class="clearfix">
    <!-- 添加货品 -->
    <el-dialog :title="$t('addGoods')" :visible.sync="dialogVisible" width="30%">
      <el-row>
        <el-col :span="6" :offset="8">
          <el-upload
            :action="goodsapi"
            :data="uploadData"
            :on-success="handleSuccess"
            :headers="Authorization"
            name="file"
            :show-file-list="false"
          >
            <el-button
              size="medium"
              style="width: 180px; margin: 0 0 10px 0;"
              @click="downloadTemplate"
            >
              {{ $t('downloadtemplate') }}
            </el-button>
          </el-upload>
          <el-upload
            :action="goodsapi"
            :data="uploadData"
            :on-success="handleSuccess"
            :headers="Authorization"
            name="file"
            :show-file-list="false"
          >
            <el-button slot="trigger" style="width: 180px;" size="medium">
              {{ $t('importproductlist') }}
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
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
                placeholder="按条码商品名称"
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
                :true-label="1"
                @change="handlerChange"
                v-model="inventorySwitch"
                border
                type="text"
                size="small"
                style="margin-left:10px;"
              >
                {{ $t('Belowstock') }}
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
            @click="goAddPage"
            icon="el-icon-plus"
            style="margin-left:10px;"
          >
            {{ $t('addGoods') }}
          </el-button>
          <el-button size="small" :disabled="isDisabled" @click="handlerImport">
            导入商品
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
              <el-form-item class="form-no-bottom" label="商品分类 :">
                <el-select
                  clearable
                  v-model="category_id"
                  @change="handlerChange"
                  @clear="handlerChange"
                  size="mini"
                  :placeholder="$t('ProductTAG')"
                >
                  <el-option
                    v-for="item in typeList"
                    :label="item.name_cn"
                    :value="item.id"
                    :key="item.id"
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
import searchFilter from '@/components/search-filter';
import dateRange from '@/components/date-range';
import baseApi from '@/lib/axios/base_api';

export default {
  name: 'outboundListSearch',
  components: {
    searchFilter,
    dateRange
  },
  data() {
    return {
      btnFilterSearch: {},
      isFilterOpen: false,
      category_id: '',
      dateValue: {
        beginTime: null,
        endTime: null
      }, // 选定的选择时间
      keywords: '',
      typeList: [], // 分类列表
      dialogVisible: false,
      inventorySwitch: 0 // 低于库存
    };
  },
  created() {
    this.loadData();
    if (this.$route.query.checked) {
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
    loadData() {
      // 货品分类列表
      if (!this.warehouseId) return;
      $http
        .getCategoryManagement({
          warehouse_id: this.warehouseId,
          page_size: 200
        })
        .then(res => {
          this.typeList = res.data.data;
        });
    },
    goAddPage() {
      this.$router.push({
        name: 'goodsAdd'
      });
    }, // 添加
    handlerDateChange(v) {
      this.dateValue = v;
      this.handlerChange();
    },
    handlerClearConditions() {
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
        category_id: this.category_id,
        show_low_stock: this.inventorySwitch,
        keywords: this.keywords
      };
      this.$emit('queryParams', query);
    },
    downloadTemplate() {
      window.open(`${baseApi.BASE_URL}static/goodsList.zip`);
    },
    handlerImport() {
      this.dialogVisible = true;
    }
  }
};
</script>
