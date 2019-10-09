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
                    {{$t('shopAdd')}}
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table
                element-loading-text="loading"
                v-loading="isButtonLoading()"
                :data="shops"
                border>
                <el-table-column label="#" type="index" width="80" header-align="center" align="center" ></el-table-column>
                <el-table-column  prop="name_cn" :label="$t('shopName')" header-align="center" align="center" >
                </el-table-column>
                <el-table-column :label="$t('shopQR')" header-align="center" align="center" >
                  <template slot-scope="scope">
                    <img width="100px" height="100px" v-if="scope.row.weapp_qrcode" :src="scope.row.weapp_qrcode" alt="二维码">
                  </template>
                </el-table-column>
                <el-table-column :label="$t('shopLogo')" header-align="center" align="center" >
                  <template slot-scope="scope">
                    <img width="100px" height="100px" v-if="scope.row.logo" :src="scope.row.logo" alt="二维码">
                  </template>
                </el-table-column>
                <el-table-column  :label="$t('operation')" width="200" header-align="center">
                    <template slot-scope="scope">
                        <el-tooltip :content="$t('edit')" placement="top">
                          <el-button
                              size="mini" icon="el-icon-edit" round
                              @click="editShop(scope.row)"
                              :loading="isButtonLoading()">
                          </el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('storeGoods')" placement="top">
                          <el-button
                              size="mini" icon="el-icon-goods"
                              :loading="isButtonLoading()"
                              @click="editStore(scope.row)"
                              type="primary" round>
                          </el-button>
                        </el-tooltip>
                    </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <pagination-public
                :class="$style.pagination"
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
  watch: {
    warehouseId() {
      this.getShops();
    },
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
      this.$router.push({
        name: 'storeGoods',
        query: {
          warehouse_id: this.warehouseId, // 仓库 id
          shopId: row.id,
          shopName_cn: row.name_cn,
          shopName_en: row.name_en,
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
