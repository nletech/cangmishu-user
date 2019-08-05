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
                <el-table-column  prop="name" label="店铺名称" header-align="center" align="center" >
                </el-table-column>
                <el-table-column  prop="url" label="店铺链接地址" header-align="center" align="center" >
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
        v-if="visible"
        :row_data="row_data"
        :status="status"
        :visible.sync="visible">
    </add-shops>
  </div>
</template>

<script>
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
      status: false,
      visible: false,
      params: {
        total: 2,
        currentPage: 1,
      },
      shops: [
        {
          name: '店铺一',
          url: 'wwww',
        }, {
          name: '店铺二',
          url: 'wwww',
        }, {
          name: '店铺三',
          url: 'wwww',
        }, {
          name: '店铺四',
          url: 'wwww',
        }, {
          name: '店铺五',
          url: 'wwww',
        },
      ],
    };
  },
  methods: {
    handlerChangePage() {
      //
    },
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
      this.status = true;
      this.row_data = row;
    },
    addShop() {
      this.visible = true;
      this.status = false;
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';

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
