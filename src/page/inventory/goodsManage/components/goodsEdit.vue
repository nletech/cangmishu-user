<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <div class="goods_edit">
    <mdoel-form :colValue="24">
      <el-form :model="form" slot="left" label-width="180px" :rules="formValidator" ref="form">
        <label class="label"> {{ $t('EssentialInformation') }} </label>
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$t('categoryManagement')"
              label-position="right"
              prop="category_id"
            >
              <el-select v-model="form.category_id">
                <el-option
                  v-for="item in typeList"
                  :label="item.name_cn"
                  :value="item.id"
                  :disabled="item.is_enabled === 0"
                  :key="item.id"
                >
                </el-option>
              </el-select>
              <el-button @click="addCategory" icon="el-icon-more"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('cnName')" prop="name_cn" style="width:70%">
          <el-input v-model="form.name_cn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('barcode')" prop="barcode" style="width:70%">
          <el-input v-model="form.barcode"></el-input>
        </el-form-item>
        <el-form-item
          v-if="isEnabledLangInput()"
          :label="$t('enName')"
          prop="name_en"
          style="width:70%"
        >
          <el-input v-model="form.name_en"></el-input>
        </el-form-item>
        <el-row style="margin-top:20px;">
          <el-col>
            <label class="label" style="float:left; margin-right: 20px;"
              >{{ $t('goodsSpecification') }}
            </label>
            <div style="float:left; width:300px; padding-top20px;">
              <el-button size="mini" @click="addNewLine" type="primary" plain
                >{{ $t('addLine') }}<i class="el-icon-more el-icon--right"></i>
              </el-button>
              <span class="sub-title">{{ $t('mustEnter') }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table :data="specList" :empty-text="$t('addASpecification')">
              <el-table-column type="index" label="#" fixed> </el-table-column>
              <el-table-column :label="$t('SizeName')" prop="name_cn" width="200px">
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    :placeholder="$t('pleaseEnterSpecificationName')"
                    maxlength="10"
                    show-word-limit
                    v-model="scope.row.name_cn"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isEnabledLangInput()"
                :label="$t('specificationEnglishName')"
                prop="name_en"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    :placeholder="$t('enterspecificationEnglishName')"
                    maxlength="10"
                    show-word-limit
                    v-model="scope.row.name_cn"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="SKU*" prop="relevance_code" width="200px">
                <template slot="header">
                  SKU *
                  <el-popover
                    placement="top-start"
                    title="SKU"
                    width="200"
                    trigger="hover"
                    :content="$t('SKUTips')"
                  >
                    <el-button
                      size="mini"
                      type="text"
                      slot="reference"
                      icon="el-icon-question"
                    ></el-button>
                  </el-popover>
                </template>
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    v-if="!scope.row.id"
                    :placeholder="$t('pleaseEnterSKU')"
                    maxlength="20"
                    show-word-limit
                    v-model="scope.row.relevance_code"
                  >
                  </el-input>
                  <span v-if="scope.row.id">{{ scope.row.relevance_code }}</span>
                </template>
              </el-table-column>
              <!-- 零售价 -->
              <el-table-column
                prop="purchase_price"
                align="center"
                header-align="center"
                :label="$t('PurchasePrice')"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    maxlength="10"
                    show-word-limit
                    v-model="scope.row.purchase_price"
                    :min="0"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="sale_price"
                align="center"
                header-align="center"
                :label="$t('SalePrice')"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    maxlength="10"
                    show-word-limit
                    v-model="scope.row.sale_price"
                    :min="0"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="sale_price"
                align="center"
                header-align="center"
                :label="$t('grossWeight')"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    :placeholder="$t('PleaseEnterGram')"
                    maxlength="10"
                    show-word-limit
                    v-model="scope.row.gross_weight"
                    :min="0"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column min-width="60px">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('remove')" placement="top">
                    <el-button
                      size="mini"
                      icon="el-icon-delete"
                      @click="delSpec(scope.row, scope.$index)"
                      type="danger"
                      round
                    >
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <label class="label" style="padding-top:20px;"> {{ $t('notNecessaryInfo') }} </label>
        <el-form-item :label="$t('goodsRemark')" style="width:70%">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('goodsPhoto')">
          <picture-upload :photo.sync="form.photos" :limit="1"> </picture-upload>
          <span :class="$style.uploader_tips">
            {{ $t('pictureNoLargerThan2M') }}
          </span>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmitGoods('form')" type="primary" :loading="isButtonLoading">
            {{ $t('submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </mdoel-form>
  </div>
</template>

<script>
import MdoelForm from '@/components/form';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import PictureUpload from '@/components/picture_upload';

export default {
  name: 'goodsEdit',
  components: {
    MdoelForm,
    PictureUpload
  },
  mixins: [mixin],
  data() {
    return {
      originInfo: {},
      form: {
        category_id: '', // 所属分类
        name_cn: '', // 仓库中文
        name_en: '', // 仓库外文
        hs_code: '',
        display_link: '',
        photos: '',
        remark: '',
        is_warning: '1', // 是否发送邮件
        barcode: '' // 条码
      },
      en: true,
      tips: '',
      specModel: {
        id: 0,
        name_cn: '',
        name_en: '',
        relevance_code: '',
        sale_price: 0,
        purchase_price: 0,
        gross_weight: 0
      },
      typeList: [], // 分类列表
      specList: [], // 商品规格
      fileList: []
    };
  },
  watch: {
    warehouseId() {
      this.getTypeList();
    }
  },
  created() {
    this.getTypeList(); // 获取货品分类
    this.getGoodsData(); // 获取单个货品信息（用于编辑）
  },
  computed: {
    formValidator() {
      return {
        category_id: [{ required: true, message: this.$t('ProductTAG'), trigger: 'change' }],
        name_cn: [{ required: true, message: this.$t('inputCnWord'), trigger: 'blur' }],
        barcode: [{ required: true, message: this.$t('inputBarcode'), trigger: 'blur' }]
      };
    },
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi.BASE_URL}upload/image`;
    },
    imgUrl() {
      return `${baseApi.BASE_URL}${this.form.photos}`;
    }
  },
  methods: {
    addCategory() {
      this.$confirm(this.$t('AddingProduct')).then(() => {
        this.$router.push({
          name: 'categoryManagement'
        });
      });
    },
    resetData() {
      this.specModel = {
        id: 0,
        name_cn: '',
        name_en: '',
        relevance_code: '',
        sale_price: 0,
        purchase_price: 0,
        gross_weight: 0
      };
      return this.specModel;
    },
    addNewLine() {
      this.specList.push(this.resetData());
    },
    // 货品分类列表
    getTypeList() {
      $http
        .getCategoryManagement({
          warehouse_id: this.warehouseId,
          page_size: 200
        })
        .then(res => {
          this.typeList = res.data.data;
        });
    },
    // 获取单个货品的信息
    getGoodsData() {
      const productId = this.$route.query.id;
      const whId = this.$route.query.warehouse_id;
      $http.getAProducts(productId, { warehouse_id: whId }).then(res => {
        this.form = {
          category_id: res.data.category_id, // 所属分类
          name_cn: res.data.name_cn, // 仓库中文
          name_en: res.data.name_en, // 仓库外文
          hs_code: res.data.hs_code,
          display_link: res.data.display_link,
          photos: res.data.photos,
          remark: res.data.remark,
          barcode: res.data.barcode,
          is_warning: '1' // 是否发送邮件
        };
        res.data.specs.forEach(val => {
          this.specList.push({
            id: val.id,
            name_cn: val.name_cn,
            name_en: val.name_en,
            relevance_code: val.relevance_code,
            sale_price: val.sale_price,
            purchase_price: val.purchase_price,
            gross_weight: val.gross_weight
          });
        });
      });
    },
    // 删除规格
    delSpec(row, index) {
      if (row.id === 0) {
        this.specList.splice(index, 1);
        return;
      }
      this.$confirm(this.$t('checkSku'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.specList.splice(index, 1);
      });
    },
    // 提交商品信息
    onSubmitGoods(formName) {
      let ctr = true;
      this.specList
        .filter(res => res.name_cn)
        .forEach(val => {
          if (!val.name_cn) {
            ctr = false;
            this.$message({
              message: this.$t('productCodeBlank'),
              type: 'warning'
            });
            return;
          }
          if (!val.relevance_code) {
            ctr = false;
            this.$message({
              message: this.$t('productCodeBlank'),
              type: 'warning'
            });
            return;
          }
          if (!/^[a-zA-Z0-9-_]{4,}$/g.test(val.relevance_code)) {
            ctr = false;
            this.$message({
              message: 'SKU只能为数字或字母或下划线，且长度必须大于3位',
              type: 'warning'
            });
          }
        });
      if (ctr) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.form.warehouse_id = this.warehouseId || this.$route.query.warehouseId;
            this.form.specs = this.specList.filter(res => res.name_cn);
            // 编辑接口
            $http.editProducts(this.$route.query.id, this.form).then(() => {
              this.successTips(this.$route.query.id, true);
              this.$router.replace({ name: 'goodsManage' }); // 编辑成功之后进行跳转
            });
          } else {
            this.$message({
              message: '请检查您的输入!',
              type: 'warning'
            });
            return false;
          }
          return true;
        });
      }
    }
  }
};
</script>

<style lang="less" module>
.label {
  font-size: 18px;
}
.originUtil {
  text-align: right;
  margin-bottom: 20px;
}
.uploader_tips {
  color: red;
}
.code {
  .button_color {
    color: #fff !important;
    background: #ccc !important;
    border-color: #ccc !important;
  }
}
</style>
<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: none !important;
}
</style>
