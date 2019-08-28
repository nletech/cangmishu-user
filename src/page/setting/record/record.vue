<template>
    <div  class="addressManagement">
        <div  :class="$style.addressManagement">
            <div  :class="$style.am_main">
                <!-- 标签页 -->
                <el-row>
                    <!-- 点击按键 -->
                    <div :class="$style.am_operation_btn">
                        <span  @click="info_add_btn">
                               <i class="iconfont">&#xe618;</i>
                               {{`${active_add_text}`}}
                        </span>
                    </div>
                    <!-- 标签页 -->
                    <el-tabs
                        v-model="active_tab_item"
                        :class="$style.am_tabs">
                        <el-tab-pane
                            :class="$style.am_tabs_item"
                            v-for="item in tabs"
                            :key="item.id"
                            :label="item.name"
                            :name="item.name">
                            <!-- 对应的标签页内容 -->
                            <el-table
                                :data="info_data"
                                :class="$style.table_main"
                                border>
                                <el-table-column
                                    label="#"
                                    header-align="center"
                                    align="center"
                                    type="index"
                                    width="80">
                                </el-table-column>
                                <el-table-column
                                    label="类型名称"
                                    header-align="center"
                                    align="center"
                                    prop="name">
                                </el-table-column>
                                <el-table-column
                                    label="启用状态"
                                    header-align="center"
                                    align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.is_enabled==1">是</span>
                                        <span v-if="scope.row.is_enabled==0">否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    header-align="center"
                                    width="240">
                                    <template slot-scope="scope">
                                      <el-tooltip content="编辑" placement="top">
                                        <el-button size="mini" icon="el-icon-edit" round
                                                    @click="edit(scope.row)"></el-button>
                                      </el-tooltip>
                                      <el-tooltip content="删除" placement="top">
                                        <el-button  size="mini" icon="el-icon-delete"
                                                    @click="delete_data(scope.row)"
                                                    type="danger" round>
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
                                :total="+total">
                            </el-pagination>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </div>
        </div>
        <!-- 添加收发人信息 -->
        <add-record-info
            :visible.sync = "switchFlag"
            :tabs="tabs"
            :active_tab_item="active_tab_item"
            :active_add_text="active_add_text"
            :row_data="row_data"
            @updata_data="handle_updata_data"
            @updata_data_list="handle_updata_data_list"
            :clear_is_enabled="clear_is_enabled">
        </add-record-info>
    </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import AddRecordInfo from './components/addRecordInfo';

export default {
  name: 'record',
  mixins: [mixin],
  components: {
    AddRecordInfo,
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: '入库单分类',
          btn_text: '添加入库单分类',
        }, {
          id: 2,
          name: '出库单分类',
          btn_text: '添加出库单分类',
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
    active_tab_item() {
      /* eslint-disable */
      let active_tag = this.active_tab_item;
      active_tag === '入库单分类'
        ? this.active_add_text = this.tabs[0].btn_text
        : this.active_add_text = this.tabs[1].btn_text;
      this.active_item_check(active_tag); // 点击不同的标签页显示不同的数据
    }, // 选中不同标签页，显示不同的添加按钮
    warehouseId() {
      this.active_item_check(this.active_tab_item);
    },
  },
  created() {
    this.active_tab_item = this.tabs[0].name; // 默认选中标签页
  },
  methods: {
    handle_updata_data_list(val) {
      this.active_item_check(val);
    }, // 添加之后更新信息
    handle_updata_data(active_item) {
      this.handleCurrentChange(this.current_page);
    }, // 编辑信息之后更新信息
    info_add_btn() {
      this.row_data = {};
      this.clear_is_enabled = 1;
      this.switchFlag = true;
    }, // 添加信息按钮
    active_item_check(item) {
      this.info_data = [];
      if (item === '入库单分类') {
        $http.getBatchType({ warehouse_id: this.warehouseId })
          .then((re) => {
            if (re.status) return;
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
      } else {
        $http.getOrderType({ warehouse_id: this.warehouseId })
          .then((re) => {
            if (re.status) return;
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          });
      }
    }, // 检测选中的标签页
    handleCurrentChange(val) {
      this.current_page = val;
      if (this.active_tab_item === '入库单分类') {
        $http.checkBatchType({
          page: val,
          warehouse_id: this.warehouseId,
        })
          .then((re) => {
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
      } else {
        $http.checkOrderType({
          page: val,
          warehouse_id: this.warehouseId,
        })
          .then((re) => {
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          });
      }
    }, // 分页查询
    edit(info) {
      this.row_data = info;
      this.switchFlag = true;
    },
    delete_data(info) {
      const active_item = this.active_tab_item;
      if (active_item === '入库单分类') {
        $http.delBatchType(info.id)
                  .then(() => {
                    if (status) return;
                    this.$message({
                      type: 'success',
                      message: '操作成功',
                    });
                    this.active_item_check(active_item);
                  })
      } else {
        $http.delOrderType(info.id)
          .then(() => {
            if (status) return;
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.active_item_check(active_item);
          });
      }
    },
  },
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

.addressManagement {
  margin: @margin;
  .am_main {
    width: @width;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      position: absolute;
      top: 80px;
      right: 20px;
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
    .el-tabs__nav-scroll {
      .el-tabs__nav {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        padding: 8px 0 8px 0;
        float: none;
        .el-tabs__item {
          width: 50%;
          text-align: center;
          font-size: 1.2rem;
        }
      }
    }
    .el-tabs {
      .el-tabs__content {
        margin: 50px 0 0 0;
      }
    }
  }
  .el-pagination {
    margin: 20px 0 0 0;
    float: right;
  }
</style>
