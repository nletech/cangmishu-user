<template>
  <div class="clearfix">
    <el-drawer title="导入商品" :visible.sync="dialogVisible" direction="rtl">
      <div style="padding:20px;">
        <el-steps :active="importStep">
          <el-step title="下载模板"></el-step>
          <el-step title="上传文件"></el-step>
          <el-step title="导入完成"></el-step>
        </el-steps>
        <div v-if="importStep == 1">
          <el-card shadow="hover" style="line-height:35px;margin-top:20px;">
            <b>通用模板</b><br />
            适用绝大多数行业 <br />
            <el-button
              size="mini"
              type="text"
              round
              icon="el-icon-download"
              @click="downloadTemplate"
            >
              {{ $t('downloadtemplate') }}
            </el-button>
          </el-card>
          <br />
          <br />
          <br />
          <br />
          <br />
          <div style="clear:both; float:right">
            <el-button
              size="mini"
              type="primary"
              style="width: 180px; margin: 0 0 10px 0;"
              @click="uploadNext()"
            >
              下一步
            </el-button>
          </div>
          <br />
          <div style="clear:both;"></div>
          <div style="font-size:12px; clear:both; text-align:right;">
            单个模板最多支持录入500条商品数据，超过请填写多个模板分次上传
          </div>
        </div>
        <el-row v-if="importStep == 2">
          <div style="padding:10px; margin-top:20px;">
            <el-upload
              class="upload-demo"
              drag
              :action="goodsapi"
              :data="uploadData"
              :on-success="handleSuccess"
              :headers="Authorization"
              name="file"
              :show-file-list="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">点击或将文件拖拽到这里上传<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过500kb</div>
            </el-upload>
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style="clear:both;">
              <el-button
                size="mini"
                style="width: 180px; margin: 0 0 10px 0;"
                @click="uploadPrev()"
              >
                上一步
              </el-button>
            </div>
          </div>
        </el-row>
      </div>
    </el-drawer>

    <!-- 添加货品 -->
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
      uploadData: {},
      importStep: 1,
      btnFilterSearch: {},
      isFilterOpen: false,
      isDisabled: false,
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
  mounted() {
    this.uploadData.warehouse_id = this.warehouseId;
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
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return this.$store.state.token.token.substring(7);
    },
    currentLang() {
      return localStorage.getItem('lang') || 'cn';
    },
    goodsapi() {
      return `${baseApi.BASE_URL}products/import`;
    }, // 导入商品
    specapi() {
      return `${baseApi.BASE_URL}specs/import`;
    } // 商品规格导入
  },
  methods: {
    uploadPrev() {
      this.importStep = 1;
    },
    uploadNext() {
      this.importStep = 2;
    },
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
    },
    handleSuccess(res) {
      if (res.status === 0) {
        this.$message({
          message: '导入成功',
          type: 'success'
        });
        this.dialogVisible = false;
        this.getList(this.query);
      } else if (res.msg) {
        this.$notify({
          message: res.msg,
          type: 'warning'
        });
      }
    } // 上传截图回调
  }
};
</script>
