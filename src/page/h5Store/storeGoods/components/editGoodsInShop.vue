<template>
  <el-dialog
      :title="$t('edit')"
      width="90%"
      :before-close="handleClose"
      :visible.sync="visible">
      <el-row>
          <el-col :span="12" :offset="6">
              <el-form label-width="100px">
                <el-form-item :label="$t('ProductName2')">
                  <span style="font-size: 1.2rem;">
                    <el-input
                        v-model="shop_form.name_cn"
                        maxlength="30"
                        :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
                        show-word-limit>
                    </el-input>
                  </span>
                </el-form-item>
                <el-form-item :label="$t('GoodsCarouselFigure')">
                    <my-upload
                      :width="400"
                      :height="400"
                      :disable="imgNumberMoreThanThree"
                      @uploadSuccessCallBack="handlerSuccessCarouselImgs">
                      <template slot="btnTitle">{{$t('uploadImage')}}</template>
                    </my-upload>
                    <div>
                      最多<span style="color: red; font-size: 1.1rem;">&nbsp;3&nbsp;</span>张,
                      建议尺寸<span style="color: red; font-size: 1.1rem;">&nbsp;400*400&nbsp;</span>
                    </div>
                    <image-list :line="false" :list="CarouselImgs"></image-list>
                </el-form-item>
                <el-form-item :label="$t('goodsIntroduction')">
                    <el-input
                        v-model="shop_form.remark"
                        type="textarea"
                        maxlength="50"
                        :placeholder="$t('TheFieldmaynotbegreaterthan50characters')"
                        show-word-limit>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('goodsImageDetial')">
                    <my-upload
                      :width="400"
                      :height="400"
                      :disable="imgNumberMoreThanTen"
                      @uploadSuccessCallBack="handlerSuccessDescriptionImgs">
                      <template slot="btnTitle">{{$t('uploadImage')}}</template>
                    </my-upload>
                    <div>
                      最多<span style="color: red; font-size: 1.1rem;">&nbsp;10&nbsp;</span>张,
                      建议尺寸<span style="color: red; font-size: 1.1rem;">&nbsp;400*400&nbsp;</span>
                    </div>
                    <image-list :line="false" :list="descriptionImgs"></image-list>
                </el-form-item>
                <el-form-item :label="$t('specName')">
                    <el-table :data="shop_form.specs">
                        <el-table-column :label="$t('SizeName')" prop="name_cn"></el-table-column>
                        <el-table-column :label="$t('SalePrice')" prop="origin_sale_price"></el-table-column>
                        <el-table-column :label="$t('SalePrice1')">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.sale_price"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column :label="'是否上架'">
                          <template slot-scope="scope">
                            <el-switch
                              v-model="scope.row.is_shelf"
                              :active-value="1"
                              :inactive-value="0"
                              inactive-color="#ff4949">
                            </el-switch>
                          </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                  <el-row>
                      <el-col :span="2" :offset="10">
                          <el-button
                            type="primary"
                            @click.native="onSubmit">
                            {{$t('submit')}}
                          </el-button>
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
import myUpload from '@/components/imageUpload/index';
import $http from '@/api/index';
import mixin from '@/mixin/form_config';
import baseApi from '@/lib/axios/base_api';
import imageList from './nleImageList';


export default {
  name: 'editGoodsinShop',
  mixins: [mixin],
  components: {
    pictureUpload,
    imageList,
    myUpload,
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
      CarouselImgs: [], // 商品轮播图
      descriptionImgs: [], // 商品详情页图
      shop_form: {
        name_cn: '', // 商品中文名
        remark: '', // 店铺简介
        pics: [], // 商品轮播图
        specs: [], // 商品规格
        descs: [], // 商品详情页图
        shopId: this.$route.query.shopId,
        id: this.row_data.id,
      },
    };
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.CarouselImgs = [];
        this.descriptionImgs = [];
      } else {
        this.getDataList(this.$route.query.shopId, this.row_data.id); // 获取商品详情
      }
    },
  },
  computed: {
    picsa() {
      return 1;
    },
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi}/upload/image`;
    },
    imgNumberMoreThanThree() {
      return this.CarouselImgs.length >= 3;
    },
    imgNumberMoreThanTen() {
      return this.descriptionImgs.length >= 10;
    },
  },
  methods: {
    handlerSuccessCarouselImgs(response) {
      if (this.imgNumberMoreThanThree) return;
      this.CarouselImgs.push(response.data);
    },
    handlerSuccessDescriptionImgs(response) {
      if (this.imgNumberMoreThanTen) return;
      this.descriptionImgs.push(response.data);
    },
    getDataList(shopId, goodsId) {
      $http.goodsDetailInShop(shopId, goodsId).then((res) => {
        this.shop_form.name_cn = res.data.name;
        this.shop_form.remark = res.data.remark;
        this.shop_form.specs = res.data.specs;
        res.data.pics.forEach((e) => {
          const obj = {
            url: `${e}`,
          };
          this.CarouselImgs.push(obj);
        });
        res.data.descs.forEach((e) => {
          const obj = {
            url: `${e}`,
          };
          this.descriptionImgs.push(obj);
        });
      });
    },
    // delGoods(row) {
    //   const arr = this.shop_form.specs;
    //   for (let i = 0; i < arr.length; i += 1) {
    //     if (arr[i].id === row.id) {
    //       arr.splice(i, 1);
    //     }
    //   }
    // },
    handleClose() {
      this.CarouselImgs = [];
      this.descriptionImgs = [];
      this.$emit('update:visible', false);
    },
    onSubmit() {
      const specsCopy = []; // 商品规格
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
            if (item === 'is_shelf') {
              // eslint-disable-next-line
              obj.is_shelf = this.shop_form.specs[i][item];
            }
          }
        }
        specsCopy.push(obj);
      }
      if (this.shop_form) {
        if (this.shop_form.name_cn === '') {
          this.$message({
            type: 'error',
            message: '商品名称必填',
          });
          return;
        }
        if (this.CarouselImgs.length === 0) {
          this.$message({
            type: 'error',
            message: '商品轮播图至少上传一张',
          });
          return;
        }
        if (this.CarouselImgs.length > 3) {
          this.$message({
            type: 'error',
            message: '商品轮播图最多上传三张',
          });
          return;
        }
        if (this.descriptionImgs.length === 0) {
          this.$message({
            type: 'error',
            message: '商品详情页图至少上传一张',
          });
          return;
        }
        if (this.descriptionImgs.length > 10) {
          this.$message({
            type: 'error',
            message: '商品详情页图最多上传10张',
          });
          return;
        }
      }
      this.shop_form.specs = specsCopy; // 商品规格
      this.shop_form.descs = [];
      this.shop_form.pics = [];
      this.descriptionImgs.forEach((e) => {
        this.shop_form.descs.push(e.url);
      });// 商品详情页图
      this.CarouselImgs.forEach((e) => {
        this.shop_form.pics.push(e.url);
      }); // 商品轮播图
      this.shop_form.warehouse_id = this.warehouseId;
      $http.editGoodsInShop(this.$route.query.shopId, this.row_data.id, this.shop_form).then((res) => {
        if (res.status) return;
        this.$emit('update:visible', false);
        this.$emit('edit_finish_callback', true);
      });
    },
  },
};
</script>
<style>

</style>

