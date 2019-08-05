<template>
    <div :class="$style.page">
        <div :class="$style.main">
            <div  :class="$style.header">
                  <el-row>
                      <!-- <inbound-list-search @data_cb="handlerCallBackData"></inbound-list-search> -->
                      <el-col :span="2" :offset="1">
                          <el-button  type="text"
                                      :class="$style.header_btn"
                                      size="small"
                                      @click="addInbound"
                                      icon="el-icon-plus">
                                      {{$t('addInbound')}}
                          </el-button>
                      </el-col>
                  </el-row>
            </div>
            <el-table  :data="inbound_list_data" border>
                <el-table-column label="#" type="index" width="40" header-align="center" align="center" ></el-table-column>
                <el-table-column  prop="confirmation_number" label="单据编号" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="batch_type.name" label="类型" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="status_name" label="状态" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="distributor.name_cn" label="供应商" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="total_num.total_need_num" label="预计数量" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="total_num.total_stockin_num" label="实际数量" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="created_at" label="创建时间" width="155" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  label="操作" width="200" header-align="center">
                      <template slot-scope="scope">
                        <el-tooltip content="查看详情" placement="top">
                          <el-button  size="mini" icon="el-icon-view" round
                                      @click="viewDetails(scope.row)"
                                      :loading="isButtonLoading()">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip content="入库 &amp;上架" placement="top">
                          <el-button  size="mini" type="primary" icon="el-icon-sell" @click="toInbound(scope.row)" round></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                          <el-button
                              size="mini" icon="el-icon-delete"
                              v-if="scope.row.status !== 3"
                              @click="inboundDelete(scope.row.id)"
                              type="danger" round>
                          </el-button>
                        </el-tooltip>
                    </template>
              </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="2" :offset="22">
                    <pagination-public  :class="$style.pagination"
                                        :params="params"
                                        @changePage="handlerChangePage">
                    </pagination-public>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import datePickerPublic from '@/components/date-picker-public';
import paginationPublic from '@/components/pagination-public';
import selectPublic from '@/components/select-public';
import inputPublic from '@/components/input-public';
import mixin from '@/mixin/form_config';
import $http from '@/api';

export default {
  name: 'storeGoods',
  mixins: [mixin],
  components: {
    datePickerPublic,
    selectPublic,
    inputPublic,
    paginationPublic,
  },
  data() {
    return {
      params: {}, // 分页数据
      inbound_list_data: [], // 入库单列表
      inboundDialogVisible: false, // 入库单详情弹框
    };
  },
  created() {
    //
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    warehouseId() {
      // this.getData();
    },
  },
  methods: {
    handlerQuery(res) {
      this.inbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 选择框回调
    handlerInputQuery(res) {
      this.inbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    handlerChangePage(val) {
      $http.getInboundPage({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          this.inbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    },
    getData() {
    }, // 获取列表
    // 添加入库单
    addInbound() {
      this.$router.push({
        name: 'addInbound',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
        },
      });
    },
    // 入库单详情弹框
    viewDetails(row) {
      this.inboundDialogVisible = true;
      this.id = row.id;
    },
    // 删除入库单
    inboundDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.deleteInbound(id)
          .then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true,
            });
            this.getData();
          });
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.page {
  margin: @margin;
  .main {
    width: @width;
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
      }
    }
  }
}
.pagination {
  margin: 10px 0 0 0;
  float: right;
}
</style>
