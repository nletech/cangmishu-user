<template>
          <div :class="$style.page">
                <div  :class="$style.main">
                      <div  :class="$style.header">
                            <el-row>
                                    <el-col :span="3">
                                            <date-picker-public @select_data="handlerSelect_data"></date-picker-public>
                                    </el-col>
                                    <el-col :span="3"
                                            :offset="6">
                                            <select-public></select-public>
                                    </el-col>
                                    <el-col :span="3"
                                            :offset="1">
                                            <select-public></select-public>
                                    </el-col>
                                    <el-col :span="3"
                                            :offset="1">
                                            <select-public></select-public>
                                    </el-col>
                                    <el-col :span="3"
                                            :offset="1">
                                            <input-public></input-public>
                                    </el-col>
                            </el-row>
                            <el-row>
                                    <el-col :span="2"
                                            :offset="21">
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
                      <div  :class="$style.tab">
                            <el-table  :data="inbound_list_data"
                                       border
                                       style="width:100%">
                                       <el-table-column  type="index"
                                                         label="#">
                                       </el-table-column>
                                       <el-table-column  prop="status_name"
                                                         label="状态">
                                       </el-table-column>
                                       <el-table-column  prop="batch_type.name"
                                                         :label="$t('inboundType')">
                                       </el-table-column>
                                       <el-table-column  prop="batch_code"
                                                         :label="$t('inboundNumber')">
                                       </el-table-column>
                                       <el-table-column  prop="confirmation_number"
                                                         :label="$t('confirmationNumber')">
                                       </el-table-column>
                                       <el-table-column  prop="distributor.name_cn"
                                                         label="供应商">
                                       </el-table-column>
                                       <el-table-column label="预/已入库数量">
                                                        <template slot-scope="scope">
                                                                   {{scope.row.total_num.total_need_num}}/{{scope.row.total_num.total_stockin_num}}
                                                        </template>
                                       </el-table-column>
                                       <el-table-column  prop="created_at"
                                                         label="创建时间">
                                       </el-table-column>
                                       <el-table-column  label="操作"
                                                         width="240">
                                                         <template slot-scope="scope">
                                                                   <el-button size="small"
                                                                              style="margin: 0; padding: 10px;"
                                                                              @click="viewDetails(scope.row)"
                                                                              :loading="$store.state.config.button_loading">
                                                                              查看详情
                                                                   </el-button>
                                                                   <el-button  size="small"
                                                                               style="margin: 0; padding: 10px;"
                                                                               @click="toInbound(scope.row)">
                                                                               入库&上架
                                                                   </el-button>
                                                                   <el-button  size="small"
                                                                               style="margin: 0; padding: 10px;"
                                                                               @click="inboundDelete(scope.row.id)"
                                                                               type="danger">
                                                                               删除
                                                                   </el-button>
                                                        </template>
                                      </el-table-column>
                            </el-table>
                      </div>
                      <div  :class="$style.pagination">
                            <pagination-public  :params="params"
                                                @changePage="handlerChangePage">
                            </pagination-public>
                      </div>
                </div>
                <!-- 入库单详情弹框 -->
                <detail-dialog  :visible.sync="inboundDialogVisible"
                                :id="id">
                </detail-dialog>
          </div>
</template>

<script>
import datePickerPublic from '@/components/date-picker-public';
import paginationPublic from '@/components/pagination-public';
import selectPublic from '@/components/select-public';
import inputPublic from '@/components/input-public';
import $http from '@/api';
import detailDialog from './components/inbound_detail';

export default {
  components: {
    detailDialog,
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
      inbound_info: {},
      id: 0,
      boundList: [],
      statusList: [
        { id: 1, name: '待入库' },
        { id: 2, name: '入库中' },
        { id: 3, name: '入库完成' },
      ],
      typeList: [],
      distributorList: [],
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    warehouseId() {
      this.getData();
    },
  },
  created() {
    this.getData();
    this.getTypeList();
  },
  methods: {
    handlerChangePage(val) {
      $http.getInboundPage({ page: val })
        .then((res) => {
          this.inbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    },
    handlerSelect_data(val) {
      if (val && val.length === 2) {
        this.getData(val);
      } else {
        // 刷新列表
        this.getData();
      }
    },
    getData(query) {
      if (!this.warehouseId) return;
      const obj = {};
      obj.warehouse_id = this.warehouseId; // 仓库 id 必填
      // query有几种形式
      if (Array.isArray(query)) {
        // 查询时间段
        obj.created_at_b = query[0]; // 开始时间
        obj.created_at_e = query[1]; // 结束时间
      }
      $http.getInbounds(obj)
        .then((res) => {
          this.inbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
          this.$set(this.params);
          console.log(this.params, 'this.params');
          // this.params.currentPage = res.data.current_page;
        });
    }, // 获取列表
    // 以上重写
    toInbound(info) {
      // eslint-disable-next-line
      const batch_id = info.id;
      this.$router.push({
        name: 'inboundShelf',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
          batch_id, // 入库单 id
        },
      });
    }, // 入库上架
    getTypeList() {
      if (!this.warehouseId) return;
      const SelcetParams = {
        page: 1,
        page_size: 200,
        warehouse_id: this.warehouseId,
      };
      $http.getBatchType(SelcetParams).then((res) => {
        this.typeList = res.data.data;
      });
      $http.getDistributor().then((res) => {
        this.distributorList = res.data.data;
      });
    }, // 入库单分类和供应商
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
            this.getList();
          });
      }).catch(() => {});
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.page {
  margin: 20px 0 0 0;
  .main {
    width: 90%;
    margin: 0 auto;
    .header {
      margin: 10px 0 10px 0;
      .header_btn {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
      }
    }
  }
}
.table {
  background-color: red;
}
.pagination {
  margin: 10px  0 10px 0;
  float: right;
}
</style>
