<template>
        <div :class="$style.goods_list">
              <!-- 选择货品按钮 -->
              <el-button  :class="$style.goods_list_btn" type="primary" plain
                          @click="handleShowDialog" size="mini" icon="el-icon-more" style="float:right">
                          选择商品
              </el-button>
              <!-- 货品列表 -->
              <el-table :data.sync="specList"
                        border
                        style="width: 100%;" empty-text="请选择商品规格">
                        <el-table-column  type="index"
                                          label="#">
                        </el-table-column>
                        <el-table-column  label="商品名称及规格">
                            <template slot-scope="scope">
                                      {{scope.row.product_name}}
                            </template>
                        </el-table-column>
                        <el-table-column label="SKU" prop="relevance_code">
                        </el-table-column>
                        <el-table-column label="销售单价（元）" prop="sale_price">
                              <template slot-scope="scope">
                                  <el-input-number  v-model="scope.row.sale_price" :min="0" size="mini">
                                  </el-input-number>
                              </template>
                        </el-table-column>
                        <el-table-column label="数量" prop="num">
                          <template slot-scope="scope">
                              <el-input-number  v-model="scope.row.need_num" :min="0" size="mini">
                              </el-input-number>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                              <el-tooltip content="删除" placement="top">
                                <el-button  size="mini" icon="el-icon-delete"
                                                 @click="removeSpec(scope.$index)"
                                                 type="danger" round>
                                </el-button>
                              </el-tooltip>
                          </template>
                        </el-table-column>
              </el-table>
              <!-- 选择商品弹窗 -->
              <select-spec :visible.sync="dialogShow" :warehouseId.sync="warehouseId" @selected="onSpecSelected" :onlyShowStock="1">
              </select-spec>
        </div>
</template>

<script>
import selectSpec from '@/components/dialog/selectSpec';

export default {
  name: 'specList',
  props: {
    warehouseId: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  components: {
    selectSpec,
  },
  data() {
    return {
      specList: [],
      dialogShow: false,
      num_arr: [],
    };
  },
  methods: {
    onSpecSelected(data) {
      console.log('选中的数据', data);
      for (let i = 0; i < data.length; i += 1) {
        let found = false;
        for (let j = 0; j < this.specList.length; j += 1) {
          if (data[i].id === this.specList[j].id) {
            found = true;
            console.log('存在数据', data[i]);
            break;
          }
        }
        if (!found) {
          this.specList.push(data[i]);
        }
      }
    },
    removeSpec(index) {
      this.specList.splice(index, 1);
    },
    handleShowDialog() {
      console.log(this.dialogShow, '打开选择商品规格窗口');
      this.dialogShow = true;
    }, // 打开选择商品弹窗
  },
};
</script>

<style lang="less" module>
.goods_list {
  .goods_list_btn {
    margin: 0 0 10px 0;
  }
}
</style>

