<template>
    <div :class="$style.page">
        <div :class="$style.main">
            <div  :class="$style.header">
                  <el-row>
                      <!-- <inbound-list-search @data_cb="handlerCallBackData"></inbound-list-search> -->
                      <el-col :span="2" :offset="22">
                          <el-button  type="text"
                                      :class="$style.header_btn"
                                      size="small"
                                      @click="addGoods"
                                       icon="el-icon-plus">
                                      {{'添加商品'}}
                          </el-button>
                      </el-col>
                  </el-row>
            </div>
            <el-table  :data="goodsList" border>
                <el-table-column type="selection" width="40" header-align="center" align="center" ></el-table-column>
                <el-table-column  prop="img" label="商品图片" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="name" label="商品名称" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="status_name" label="上架" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="cost" label="进价(元)" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="sale" label="售价(元)" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="time" label="时间" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  label="操作" width="200" header-align="center">
                      <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top">
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
        <!-- 选择商品弹窗 -->
        <select-spec-dialog :visible.sync="dialogSpecShow"
                            :warehouseId.sync="warehouseId"
                            @selected="onSpecSelected">
        </select-spec-dialog>
    </div>
</template>

<script>
import datePickerPublic from '@/components/date-picker-public';
import paginationPublic from '@/components/pagination-public';
import selectPublic from '@/components/select-public';
import inputPublic from '@/components/input-public';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import selectSpecDialog from '@/components/dialog/selectSpec';

export default {
  name: 'storeGoods',
  mixins: [mixin],
  components: {
    datePickerPublic,
    selectPublic,
    inputPublic,
    paginationPublic,
    selectSpecDialog,
  },
  data() {
    return {
      dialogSpecShow: false,
      params: {
        total: 123,
      }, // 分页数据
      goodsList: [
        {
          img: 'img',
          name: '商品一',
          status_name: '1',
          cost: 1,
          sale: 123,
          time: '2019-07-19',
        }, {
          img: 'img',
          name: '商品一',
          status_name: '1',
          cost: 1,
          sale: 123,
          time: '2019-07-19',
        }, {
          img: 'img',
          name: '商品一',
          status_name: '1',
          cost: 1,
          sale: 123,
          time: '2019-07-19',
        }, {
          img: 'img',
          name: '商品一',
          status_name: '1',
          cost: 1,
          sale: 123,
          time: '2019-07-19',
        }, {
          img: 'img',
          name: '商品一',
          status_name: '1',
          cost: 1,
          sale: 123,
          time: '2019-07-19',
        },
      ], // 入库单列表
      addGoodsList: [],
      inboundDialogVisible: false, // 入库单详情弹框
    };
  },
  created() {
    //
  },
  methods: {
    onSpecSelected(data) {
      // console.log('选中的数据', data);
      for (let i = 0; i < data.length; i += 1) {
        let found = false;
        for (let j = 0; j < this.addGoodsList.length; j += 1) {
          if (data[i].id === this.addGoodsList[j].id) {
            found = true;
            // console.log('存在数据', data[i]);
            break;
          }
        }
        if (!found) {
          this.addGoodsList.push(data[i]);
        }
      }
      console.log(this.addGoodsList, 'this.addGoodsList');
    },
    handlerQuery(res) {
      console.log(res);
    }, // 选择框回调
    handlerInputQuery(res) {
      console.log(res);
    }, // 输入框回调
    handlerChangePage(val) {
      $http.getInboundPage({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          console.log(res);
        });
    },
    getData() {
    }, // 获取列表
    // 添加入库单
    addGoods() {
      this.dialogSpecShow = true;
    },
    // 入库单详情弹框
    viewDetails(row) {
      this.inboundDialogVisible = true;
      this.id = row.id;
    },
    // 删除入库单
    inboundDelete(id) {
      console.log(id, 'id');
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // $http.deleteInbound(id)
        //   .then(() => {
        //     this.$message({
        //       message: '删除成功',
        //       type: 'success',
        //       showClose: true,
        //     });
        //     this.getData();
        //   });
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
