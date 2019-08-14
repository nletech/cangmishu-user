<template>
  <el-dialog
      title="修改商品信息"
      width="90%"
      :before-close="handleClose"
      :visible.sync="visible">
      <el-row>
          <el-col :span="12" :offset="6">
              <el-form label-width="100px">
                <el-form-item :label="'商品名称'">
                  <span style="font-size: 1.2rem;">
                    <el-input v-model="shop_form.name_cn"></el-input>
                  </span>
                </el-form-item>
                <el-form-item :label="'添加商品图片'">
                    <div><span style="color: red;">最多3张, 建议尺寸800*800</span></div>
                    <picture-upload v-if="visible" :limit="3" :pictures.sync="shop_form.pics" :fileList="fileList"></picture-upload>
                </el-form-item>
                <el-form-item :label="'商品简介'">
                    <el-input v-model="shop_form.remark" type="textarea" maxlength="50" placeholder="最多不超过50个字"></el-input>
                </el-form-item>
                <el-form-item :label="'商品规格'">
                    <el-table :data="shop_form.specs">
                        <el-table-column :label="'规格名称'" prop="name_cn"></el-table-column>
                        <el-table-column :label="'进价(元)'" prop="purchase_price"></el-table-column>
                        <el-table-column :label="'售价(元)'">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.sale_price"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column :label="'操作'">
                          <template slot-scope="scope">
                            <el-tooltip content="删除" placement="top">
                              <el-button
                                  size="mini" icon="el-icon-delete"
                                  @click="delGoods(scope.row)"
                                  type="danger" round>
                              </el-button>
                            </el-tooltip>
                          </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                  <el-row>
                      <el-col :span="2" :offset="10">
                          <el-button type="primary" @click.native="onSubmit">提交</el-button>
                      </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
          </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
import pictureUpload from '@/components/picture_upload';
import $http from '@/api/index';
import mixin from '@/mixin/form_config';

export default {
  name: 'editGoodsinShop',
  mixins: [mixin],
  components: {
    pictureUpload,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    row_data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      shop_form: {
        name_cn: '', // 商品中文名
        remark: '', // 店铺简介
        pics: [], // 图片
        specs: [], // 规格
        shopId: this.$route.query.shopId,
        id: this.row_data.id,
      },
      fileList: [],
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.fileList = [];
        this.getDataList(this.$route.query.shopId, this.row_data.id); // 获取商品详情
        return;
      }
      this.shop_form.pics = [];
    },
  },
  computed: {
    picsa() {
      return 1;
    },
  },
  methods: {
    delGoods(row) {
      const arr = this.shop_form.specs;
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
    onSubmit() {
      const specsCopy = []; // 规格表单信息
      for (let i = 0; i < this.shop_form.specs.length; i += 1) {
        // eslint-disable-next-line
        let obj = new Object(null);
        for (const item in this.shop_form.specs[i]) {
          if (Object.prototype.hasOwnProperty.call(this.shop_form.specs[i], item)) {
            if (item === 'id') {
              obj.id = this.shop_form.specs[i][item];
            }
            if (item === 'sale_price') {
              // eslint-disable-next-line
              obj.sale_price = this.shop_form.specs[i][item];
            }
            if (item === 'name_cn') {
              // eslint-disable-next-line
              obj.name_cn = this.shop_form.specs[i][item];
            }
            if (item === 'name_en') {
              // eslint-disable-next-line
              obj.name_en = this.shop_form.specs[i][item];
            }
          }
        }
        specsCopy.push(obj);
      }
      if (this.fileList) {
        this.fileList.forEach((e) => {
          if (!this.shop_form.pics.includes(e.url)) {
            this.shop_form.pics.push(e.url);
          }
        });
        if (this.shop_form.pics.length > 3) {
          this.$message({
            type: 'error',
            message: '最多上传三张图片',
          });
        }
      }
      console.log(this.fileList, 'fileList');
      console.log(this.shop_form.pics, 'this.shop_form.pics');
      this.shop_form.specs = specsCopy;
      this.shop_form.warehouse_id = this.warehouseId;
      $http.editGoodsInShop(this.$route.query.shopId, this.row_data.id, this.shop_form).then((res) => {
        if (res.status) return;
        this.$emit('update:visible', false);
        this.$emit('edit_finish_callback', true);
      });
    },
    getDataList(shopId, goodsId) {
      $http.goodsDetailInShop(shopId, goodsId).then((res) => {
        this.shop_form.name_cn = res.data.name;
        this.shop_form.remark = res.data.remark;
        this.shop_form.specs = res.data.specs;
        res.data.pics.forEach((e) => {
          const obj = {
            name: new Date(),
            url: `${e}`,
          };
          this.fileList.push(obj);
        });
        // this.shop_form.pics = [...res.data.pics];
      });
    },
  },
};
</script>
<style>

</style>

