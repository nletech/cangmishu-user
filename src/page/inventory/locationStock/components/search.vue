<template>
  <div class="clearfix">
    <el-form
      class="fl form-no-bottom"
      :inline="true"
      label-position="left"
      label-width="80px"
      @clear="handlerChange"
      @keydown.enter.native="handlerChange"
    >
      <el-form-item>
        <div class="btn-group">
          <el-input
            v-model="keywords"
            clearable
            style="width: 360px"
            placeholder="按商品条码、规格SKU"
            size="small"
          />
          <el-button type="primary" @click="handlerChange" size="small" style="margin-left:10px;">
            搜索
          </el-button>
          <el-checkbox
            v-model="not_show_zero_stock"
            border
            type="text"
            size="small"
            style="margin-left:10px;"
            @change="handlerChange"
          >
            不显示零货位
          </el-checkbox>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'search',
  components: {},
  data() {
    return {
      btnFilterSearch: {},
      isDisabled: false,
      keywords: '',
      not_show_zero_stock: true,
      dialogVisible: false,
      export_data: []
    };
  },
  created() {
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
    onClosedDialog() {
      this.export_data = [];
    },
    addSaleList() {
      this.$router.push({
        name: 'inventoryOverview'
      });
    }, // 添加
    handlerClearConditions() {
      this.keywords = '';
      this.show_low_stock = 0;
      this.handlerChange();
    },
    handlerChange() {
      const query = {
        keywords: this.keywords,
        not_show_zero_stock: this.not_show_zero_stock ? 1 : 0
      };
      this.$emit('queryParams', query);
    }
  }
};
</script>
