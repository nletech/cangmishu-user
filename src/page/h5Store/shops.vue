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
                              :loading="$store.state.config.button_loading">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip content="管理商品" placement="top">
                          <el-button
                              size="mini" icon="el-icon-goods"
                              @click="editStore(scope.row.id)"
                              type="primary" round>
                          </el-button>
                        </el-tooltip>
                    </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row  :class="$style.pagination">
            <pagination-public  :params="params"
                                @changePage="handlerChangePage">
            </pagination-public>
        </el-row>
    </div>
  </div>
</template>

<script>
import paginationPublic from '@/components/pagination-public';

export default {
  name: 'shops',
  components: {
    paginationPublic,
  },
  data() {
    return {
      params: {},
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
    editShop() {
      //
    },
    editStore() {
      //
    },
    addShop() {
      //
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
      margin: 10px  0 10px 0;
      float: right;
    }
  }
}
</style>
