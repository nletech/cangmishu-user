<template>
        <div :class="$style.select_goods">
              <!-- 选择商品弹窗 -->
                              <!-- 选择商品弹窗 -->
                <el-dialog  :title="$t('selectGoods')"
                            width="80%"
                            :visible.sync="goodsDialog"
                            :before-close="handleClose">
                  <el-row :gutter="20">
                    <el-col :span="5">{{$t('PleaseSelectCategory')}}</el-col>
                    <el-col :span="19">
                        <!-- 搜索框 -->
                        <el-row :gutter="20" type="flex">
                          <el-col  :span="12">
                              <el-input placeholder="" >
                                  <el-button slot="append" type="primary" icon="el-icon-search"></el-button>
                              </el-input>
                          </el-col>
                          <!-- 添加商品 -->
                          <el-col :span="4" :offset="8" >
                            <div style="float:right">
                            <el-button @click="handlerAddGoods">
                              {{$t('AddProduct')}}
                            </el-button>
                            </div>
                          </el-col>
                        </el-row>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="5">
                        <el-tree
                          :props="{label:'name_cn'}"
                          :data="goodsTypes"
                          default-expand-all
                          @node-click="handlerSelect"
                          :expand-on-click-node="false"></el-tree>
                    </el-col>
                    <el-col :span="19">
                        <!-- 数据表 -->
                        <el-table :data="goods"
                                  ref="table"
                                  border
                                  @selection-change="rowClickGoods" style="width: 100%; margin-top:10px;">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column type="index" label="序号" width="60"></el-table-column>
                            <el-table-column type="index" label="入库数量" width="160">
                              <template slot-scope="scope">
                                  <el-input-number size="mini" :min="1" v-model="scope.row.need_num"></el-input-number>
                              </template>
                            </el-table-column>
                            <el-table-column  label="商品名称及规格" prop="product_name"></el-table-column>
                            <el-table-column  label="参考进货价（元）" prop="purchase_price"></el-table-column>
                            <el-table-column  label="当前库存" prop="stockin_num"></el-table-column>
                        </el-table>
                        <button-pagination :pageParams="params"></button-pagination>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="5">
                      {{$t('productionType')}}{{goodsSelected.length}}
                    </el-col>
                    <el-col :span="19" class="dialog-footer">
                      <div style="float:right">
                        <el-button  type="primary"
                                    @click="confirmSelected"
                                    :loading="$store.state.btn_loading"
                                    :disabled="!this.goodsSelected.length">
                                    提交
                        </el-button>
                        <el-button @click="handleClose()">取消</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-dialog>
        </div>
</template>

<script>
import $http from '@/api';

export default {
  name: 'selectGoods',
  props: {
    visible_goods: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      goods: [],
      total: '',
      selected: [], // 初选
      currentPage: 1,
      all_selected: [], // 总的选择存储（因为有分页）
    };
  },
  watch: {
    visible_goods() {
      if (this.visible_goods) {
        this.getGoodsList();
      }
    },
  },
  computed: {
    warehouse_id() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    handleSelected(arr) {
      this.selected = [];
      for (let i = 0; i < arr.length; i += 1) {
        this.selected.push(arr[i]);
      }
    }, // 将选中项缓存起来
    getGoodsList() {
      // eslint-disable-next-line
      const warehouse_data = {
        warehouse_id: this.warehouse_id,
      };
      $http.getProducts(warehouse_data)
        .then((res) => {
          if (res.status) return;
          this.goods = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    }, // 获取商品列表
    handleClose() {
      this.$emit('update:visible_goods', false);
    },
    handleSelectGoods() {
      this.visible_goods = true;
    },
    confirmSelected() {
      for (let i = 0; i < this.selected.length; i += 1) {
        this.all_selected.push(this.selected[i]);
      }
      // 这里对包含对象的数组进行去重（根据对象的id属性）
      function removeArrObj(arr) {
        const obj = {}; // 用作记录的对象
        const result = []; // 接收去重后的数组
        // eslint-disable-next-line
        let subObj = arr;
        for (let i = 0; i < subObj.length; i += 1) {
          if (!obj[subObj[i].id]) {
            result.push(subObj[i]);
            obj[subObj[i].id] = true;
          } // 在数组的对象中, id 唯一则推入到 result 数组
        }
        return result;
      }
      const result = removeArrObj(this.all_selected);
      this.all_selected = []; // 初始化
      this.$emit('select-goods_data', result); // 回传给父组件
      this.$emit('update:visible_goods', false);
    }, // 提交
    handleCurrentChange(val) {
      for (let i = 0; i < this.selected.length; i += 1) {
        this.all_selected.push(this.selected[i]);
      } // 缓存当前页的选中项
      // 分页请求
      $http.getProductsPage({
        page: val,
        warehouse_id: this.warehouse_id,
      })
        .then((res) => {
          if (res.status) return;
          this.goods = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    }, // 分页
  },
};
</script>

<style lang="less" module>

.select_goods {
  .select_goods_btn {
    margin: 0 0 10px 0;
  }
  .pagination {
    margin: 10px 0 10px 0;
    float: right;
  }
  .submit_btn {
    margin: 10px 0 0 0;
  }
}
</style>

