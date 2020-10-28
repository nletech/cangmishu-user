<template>
  <div class="addressManagement">
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <div :class="$style.am_operation_btn">
          <span @click="infoAddBtn">
            <i class="iconfont">&#xe618;</i>
            添加入库单分类
          </span>
        </div>
        <el-table
          element-loading-text="loading"
          v-loading="isButtonLoading"
          :data="info_data"
          :class="$style.table_main"
          border
        >
          <el-table-column
            label="#"
            header-align="center"
            align="center"
            type="index"
            width="80"
          >
          </el-table-column>
          <el-table-column
            :label="$t('Type')"
            header-align="center"
            align="center"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            :label="$t('AreaStatus')"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.is_enabled == 1">是</span>
              <span v-if="scope.row.is_enabled == 0">否</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('operation')"
            header-align="center"
            width="240"
          >
            <template slot-scope="scope">
              <el-tooltip :content="$t('edit')" placement="top">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  round
                  @click="edit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('delete')" placement="top">
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteItem(scope.row.id)"
                  type="danger"
                  round
                >
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :class="$style.pagination"
          v-show="+total"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="+total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 添加收发人信息 -->
    <add-record-info
      :visible.sync="switchFlag"
      :tabs="tabs"
      :active_tab_item="tabs[0].name"
      :active_add_text="tabs[0].btn_text"
      :row_data="row_data"
      @updata_data="handleUpdataData"
      @updata_data_list="handleUpdataDataList"
      :clear_is_enabled="clear_is_enabled"
    >
    </add-record-info>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import AddRecordInfo from '@/components/addRecordInfo';

export default {
  name: 'saleCategory',
  mixins: [mixin],
  components: {
    AddRecordInfo,
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          title: 'ReceiptCategoryName',
          name: '入库单分类',
          btn_text: 'addBatchType',
        }, {
          id: 2,
          title: 'DeliveryListcategoryname',
          name: '出库单分类',
          btn_text: 'addOrderType',
        },
      ],
      clear_is_enabled: 0,
      row_data: {}, // 行数据
      active_tab_item: '', // 默认选择的标签页 (主要判断标志)
      active_add_text: '', // 默认添加按钮文字
      switchFlag: false,
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1, // 当前页(编辑的时候)
    };
  },
  watch: {
    warehouseId() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    handleUpdataDataList() {
      this.getList();
    }, // 添加之后更新信息
    handleUpdataData() {
      this.handleCurrentChange(this.current_page);
    }, // 编辑信息之后更新信息
    infoAddBtn() {
      this.row_data = {};
      this.clear_is_enabled = 1;
      this.switchFlag = true;
    }, // 添加信息按钮
    getList() {
      this.info_data = [];
      $http.getBatchType({ warehouse_id: this.warehouseId })
        .then((re) => {
          if (re.status) return;
          this.info_data = re.data.data;
          this.total = re.data.total;
          this.current_page = re.data.current_page;
        });
    },
    handleCurrentChange(val) {
      this.current_page = val;
      $http.checkBatchType({
        page: val,
        warehouse_id: this.warehouseId,
      })
        .then((re) => {
          this.info_data = re.data.data;
          this.total = re.data.total;
          this.current_page = re.data.current_page;
        });
    }, // 分页查询
    edit(info) {
      this.row_data = info;
      this.switchFlag = true;
    },
    deleteItem(id) {
      $http.delBatchType(id)
        .then(() => {
          if (status) return;
          this.$message({
            type: 'success',
            message: this.$t('success'),
          });
          this.getList();
        });
    },
  },
};
</script>
<style lang="less" module>
@import "../../../less/public_variable.less";

.addressManagement {
  margin: @margin;
  .am_main {
    width: @width;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      float: right;
      margin: 20px;
      z-index: 3;
      border: none;
      font-size: 1.2rem;
      color: @ThemeColor;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.addressManagement {
  .el-pagination {
    margin: 20px 0 0 0;
    float: right;
  }
}
</style>
