<template>
        <div :class="$style.goods_list">
              <!-- 选择货品按钮 -->
              <el-button  :class="$style.goods_list_btn"
                          @click="handleSelectGoods">
                          选择商品
              </el-button>
              <!-- 货品列表 -->
              <el-table :data="goodsList"
                        border
                        style="width: 100%;">
                        <el-table-column  type="index"
                                          label="#">
                        </el-table-column>
                        <el-table-column  label="商品名称">
                                          <template slot-scope="scope">
                                                    {{scope.row.product_name_cn}}
                                          </template>
                        </el-table-column>
                        <el-table-column label="SKU"
                                         prop="relevance_code">
                        </el-table-column>
                        <el-table-column label="数量"
                                         prop="num">
                                          <template slot-scope="scope">
                                                    <el-input-number  v-model="num_arr[scope.row.id]"
                                                                      :min="0"
                                                                      size="mini">
                                                    </el-input-number>
                                          </template>
                        </el-table-column>
                        <el-table-column label="操作">
                                          <template slot-scope="scope">
                                                    <el-button @click="removeGoods(scope.$index)" size="small">删除</el-button>
                                          </template>
                        </el-table-column>
              </el-table>
              <!-- 选择商品弹窗 -->
              <select-goods :visible_goods.sync="visible_goods"
                            @select-goods_data="handleSelectGoodsData"
                            @update:visible_goods="handleVisibleGoods($event)">
              </select-goods>
        </div>
</template>

<script>
import SelectGoods from './selectGoods';

export default {
  name: 'goodsList',
  components: {
    SelectGoods,
  },
  data() {
    return {
      goodsList: [],
      goods: [],
      visible_goods: false,
      goods_data: [{
        relevance_code: '',
        num: '',
      }], // 需要传到父组件的内容
      num_arr: [],
    };
  },
  watch: {
    num_arr() {
      console.log(this.num_arr, 'num_arr');
      console.log(this.goodsList, 'goodslist');
      // 给 goodsList数组中的每个对象都添加一个 num属性,且该属性值为当前选择的数量值
      for (let i = 0; i < this.goodsList.length; i += 1) {
        for (let j = 0; j < this.num_arr.length; j += 1) {
          if (this.goodsList[i].id === j) {
            this.goodsList[i].number = this.num_arr[j];
          }
        }
      }
      this.$emit('get_data', this.goodsList);
    },
  },
  methods: {
    removeGoods(index) {
      const temp = JSON.parse(JSON.stringify(this.goodsList));
      for (let i = 0; i < temp.length; i += 1) {
        if (index === i) {
          temp.splice(index, 1);
          this.num_arr[index] = 0;
        }
      }
      // console.log(temp, 'temp', this.goodsList, 'this.goodsList');
      this.goodsList = temp;
    },
    handleVisibleGoods(val) {
      // for (let i = 0; i < goodsList.length; i += 1) {
      //   let flag = false;
      //   for (let j = 0; j < this.temp_goods_list.length; j += 1) {
      //     if (goodsList[i].id === this.temp_goods_list[j].id) {
      //       flag = true;
      //     }
      //   }
      //   if (!flag) {
      //     this.temp_goods_list.push(goodsList[i]);
      //   }
      // }
      this.visible_goods = val;
    }, // 选择商品之后关闭弹窗
    handleSelectGoodsData(data) {
      for (let i = 0; i < data.length; i += 1) {
        let flag = false;
        for (let j = 0; j < this.goodsList.length; j += 1) {
          if (data[i].id === this.goodsList[j].id) {
            flag = true;
          }
        }
        if (!flag) {
          this.goodsList.push(data[i]);
        }
      }
      // console.log(this.goodsList, '父组件');
      // console.log(data, '子组件');
    }, // 选择商品后的事件
    handleSelectGoods() {
      this.visible_goods = true;
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

