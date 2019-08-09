<template>
  <div :class="$style.shops">
    <div  :class="$style.main">
        <el-row>
            <el-col :span="2" :offset="22">
                <el-button
                    type="text"
                    :class="$style.btn"
                    @click="addShop"
                    icon="el-icon-plus">
                    新增店铺
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table  :data="shops" border>
                <el-table-column label="#" type="index" width="80" header-align="center" align="center" ></el-table-column>
                <el-table-column  prop="name_cn" label="店铺名称" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="banner_background" label="店铺链接地址" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  label="操作" width="200" header-align="center">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑店铺信息" placement="top">
                          <el-button
                              size="mini" icon="el-icon-edit" round
                              @click="editShop(scope.row)"
                              :loading="isButtonLoading()">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip content="管理商品" placement="top">
                          <el-button
                              size="mini" icon="el-icon-goods"
                              @click="editStore(scope.row)"
                              type="primary" round>
                          </el-button>
                        </el-tooltip>
                    </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <pagination-public  :class="$style.pagination"
                                :params="params"
                                @changePage="handlerChangePage">
            </pagination-public>
        </el-row>
    </div>
    <add-shops
        :row_data="row_data"
        :status="status"
        @finishCallback="finishCallback"
        :visible.sync="visible">
    </add-shops>
  </div>
</template>

<script>
import $http from '@/api/index';
import paginationPublic from '@/components/pagination-public';
import mixin from '@/mixin/form_config';
import addShops from './components/addShops';

export default {
  name: 'shops',
  mixins: [mixin],
  components: {
    paginationPublic,
    addShops,
  },
  data() {
    return {
      row_data: {},
      status: 1,
      visible: false,
      params: {
        total: 2,
        currentPage: 1,
      },
      shops: [],
    };
  },
  created() {
    this.getShops(); // 获取店铺列表
  },
  methods: {
    finishCallback(val) {
      if (val) {
        this.getShops({ page: this.params.currentPage });
      }
    }, // 回到添加之前的某页 (比如, 当前分页是第二页， 添加或者编辑之后，回到之前的页面)
    handlerChangePage(val) {
      this.getShops({ page: val });
    }, // 查询分页回调
    getShops(query) {
      const preSubmit = { warehouse_id: this.warehouseId };
      if (query) {
        preSubmit.page = query.page; // 查询分页
      } // 查询
      $http.getShops(preSubmit)
        .then((res) => {
          if (res.status) return;
          this.shops = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 获取店铺列表(耦合分页查询)
    editStore(row) {
      console.log(row, 'row');
      this.$router.push({
        name: 'storeGoods',
        query: {
          warehouse_id: this.warehouse_id, // 仓库 id
        },
      });
    }, // 管理商品
    editShop(row) {
      this.visible = true;
      this.status = 2; // 编辑
      this.row_data = row;
    }, // 编辑店铺
    addShop() {
      this.visible = true;
      this.status = 1; // 新增
    }, // 添加店铺
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.shops {
  margin: @margin;
  .main {
    width: @width;
    margin: 0 auto;
    .btn {
      font-size: @fontSize;
    }
    .pagination {
      margin: 10px  0 0 0;
      float: right;
    }
  }
}
</style>
