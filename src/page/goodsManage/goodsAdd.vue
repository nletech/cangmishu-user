<template>
<div class="goods_edit">
  <mdoel-form :colValue="24">
              <el-form  :model="form"
                slot="left"
                label-width="120px"
                :rules="formValidator"
                ref="form">
                <label class="label"> {{'基本信息'}} </label>
                <el-row>
                  <el-col :span="10">
                      <!-- 供应商 -->
                      <el-form-item label="货品分类" label-position="right"
                                    prop="category_id">
                      <el-select  v-model="form.category_id">
                                 <el-option  v-for="item in typeList"
                                             :label="item.name_cn"
                                             :value="item.id"
                                             :disabled="item.is_enabled === 0"
                                             :key="item.id">
                                 </el-option>
                      </el-select>
                      <el-button @click="addCategory" icon="el-icon-more"></el-button>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item  label="中文名称"
                               prop="name_cn"
                               style="width:70%">
                               <el-input v-model="form.name_cn">
                               </el-input>
                </el-form-item>
                <el-form-item  v-if="isEnabledLangInput()"  label="外文名称"
                               prop="name_en"
                               style="width:70%">
                               <el-input  v-model="form.name_en"></el-input>
                </el-form-item>
                <el-row style="margin-top:20px;">
                  <el-col>
                    <label class="label" style="float:left; width:80px;">货品规格 </label>
                    <div style="float:left; width:300px; padding-top:20px;">
                        <el-button size="mini" @click="addNewLine" type="primary" plain>添加行 <i class="el-icon-more el-icon--right"></i> </el-button>
                        <span class="sub-title">带*为必填项</span>
                    </div>
                  </el-col>
                </el-row>
                        <el-row>
                          <el-col>
                              <el-table  :data="specList" empty-text="请添加商品规格">
                                  <el-table-column  type="index"
                                                    label="#" fixed>
                                  </el-table-column>
                                  <el-table-column label="规格名称*" prop="name_cn" width="200px">
                                    <template slot-scope="scope">
                                      <el-input type="text" placeholder="请输入规格名称" maxlength="10" show-word-limit v-model="scope.row.name_cn"></el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column v-if="isEnabledLangInput()" label="规格外文名*" prop="name_en" width="200px">
                                    <template slot-scope="scope">
                                      <el-input type="text" placeholder="请输入规格外文称" maxlength="10" show-word-limit v-model="scope.row.name_cn"></el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column label="SKU*" prop="relevance_code" width="200px">
                                    <template slot="header" slot-scope="scope">
                                      SKU *
                                      <el-popover placement="top-start" title="SKU" width="200" trigger="hover"
                                          content="SKU是商品唯一编码，保存后不能更改，且不能重复">
                                          <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                                      </el-popover>
                                    </template>
                                    <template slot-scope="scope">
                                      <el-input type="text" :isDisabled="!!$route.query.id" placeholder="请输入SKU" maxlength="20" show-word-limit v-model="scope.row.relevance_code"></el-input>
                                    </template>
                                  </el-table-column>
                                  <!-- 零售价 -->
                                  <el-table-column  prop="purchase_price"
                                                    align="center"
                                                    header-align="center"
                                                    label="进货价（元）"
                                                    width="150">
                                    <template slot-scope="scope">
                                      <el-input type="number" placeholder="进货价" maxlength="10" show-word-limit v-model="scope.row.purchase_price" :min="0"></el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column  prop="sale_price"
                                                    align="center"
                                                    header-align="center"
                                                    label="销售价（元）"
                                                    width="150">
                                    <template slot-scope="scope">
                                      <el-input type="number" placeholder="销售价" maxlength="10" show-word-limit v-model="scope.row.sale_price" :min="0"></el-input>
                                      </template>
                                  </el-table-column>
                                  <el-table-column  prop="sale_price"
                                                    align="center"
                                                    header-align="center"
                                                    label="毛重(g)"
                                                    width="120">
                                    <template slot-scope="scope">
                                      <el-input type="number" placeholder="请输入克" maxlength="10" show-word-limit v-model="scope.row.gross_weight" :min="0"></el-input>
                                      </template>
                                  </el-table-column>
                                  <el-table-column min-width="60px">
                                    <template slot-scope="scope">
                                      <el-tooltip content="删除" placement="top">
                                        <el-button  size="mini" icon="el-icon-delete"
                                                         @click="delSpec(scope.row, scope.$index)"
                                                         type="danger" round>
                                        </el-button>
                                      </el-tooltip>
                                    </template>
                                  </el-table-column>
                              </el-table>
                            </el-col>
                        </el-row>
                        <label class="label" style="padding-top:20px;"> {{'选填信息'}} </label>
                        <el-form-item :label="$t('goodsRemark')"
                                      style="width:70%">
                                      <el-input  v-model="form.remark"
                                                 type="textarea"
                                                 :autosize="{ minRows: 4, maxRows: 6}">
                                      </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('goodsPhoto')">
                                      <picture-upload :photo.sync="form.photos">
                                      </picture-upload>
                                      <span :class="$style.uploader_tips">*图片不可超过2M大小，图片格式为jpg、png、jpeg</span>
                        </el-form-item>
                        <el-form-item>
                                      <el-button  @click="onSubmitGoods('form')"
                                                  type="primary"
                                                  :loading="$store.state.config.button_loading"
                                                  v-if="!$route.query.isCheck">
                                                  提交
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
import MyEditTable from '@/components/my_edit_table';
import TableFunction from '@/components/my_edit_table/table_function';
import PictureUpload from '@/components/picture_upload';

export default {
  name: 'goodsAdd',
  components: {
    MdoelForm,
    MyEditTable,
    TableFunction,
    PictureUpload,
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
        photos: '', // 图片
        remark: '',
      },
      en: true,
      tips: '',
      typeList: [], // 分类列表
      specModel: {
        id: 0,
        name_cn: '',
        name_en: '',
        relevance_code: '',
        sale_price: 0,
        purchase_price: 0,
        gross_weight: 0,
      },
      specList: [], // 商品规格
      fileList: [],
    };
  },
  watch: {
    warehouseId() {
      this.getTypeList();
    },
  },
  created() {
    if (!this.$route.query.id) {
      this.addNewLine();
    } else {
      this.getInfo();
    }
    this.getTypeList();
  },
  computed: {
    formValidator() {
      return {
        category_id: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        name_cn: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
        ],
      };
    },
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi}/upload/image`;
    },
    imgUrl() {
      return `${baseApi}${this.form.photos}`;
    },
  },
  methods: {
    resetData() {
      this.specModel = {
        id: 0,
        name_cn: '',
        name_en: '',
        relevance_code: '',
        sale_price: 0,
        purchase_price: 0,
        gross_weight: 0,
      };

      return this.specModel;
    },
    addNewLine() {
      this.specList.push(this.resetData());
    },
    // 货品分类列表
    getTypeList() {
      $http.getCategoryManagement().then((res) => {
        this.typeList = res.data.data;
      });
    },
    // 删除规格
    delSpec(row, index) {
      this.specList.splice(index, 1);
    },
    // 提交商品信息
    onSubmitGoods(formName) {
      let ctr = true;
      if (this.specList.length === 0) {
        this.$message({
          message: '请添加商品规格',
          type: 'warning',
        });
        return;
      }
      this.specList.filter(res => res.name_cn).forEach((val) => {
        if (!val.name_cn) {
          ctr = false;
          this.$message({
            message: '规格名称不能为空',
            type: 'warning',
          });
          return;
        }
        if (!val.relevance_code) {
          ctr = false;
          this.$message({
            message: 'SKU不能为空',
            type: 'warning',
          });
          // eslint-disable-next-line
          return;
        }
        if (!/^[a-zA-Z0-9-_]{4,}$/g.test(val.relevance_code)) {
          ctr = false;
          this.$message({
            message: 'SKU只能为数字或字母或下划线，且长度必须大于3位',
            type: 'warning',
          });
        }
      });
      if (ctr) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.$route.query.id) {
              this.form.product_id = this.$route.query.id;
            }
            this.form.warehouse_id = this.warehouseId || this.$route.query.warehouseId;
            this.form.specs = this.specList.filter(res => res.name_cn);
            $http.addProducts(this.form)
              .then(() => {
                this.successTips(this.$route.query.id);
                this.$router.replace({ name: 'myGoodsList' });
              });
          } else {
            this.$message({
              message: '请检查您的输入!',
              type: 'warning',
            });
            return false;
          }
          return true;
        });
      }
    },
    // 获取商品单条信息
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
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
    color: #fff  !important;
    background: #ccc !important;
    border-color: #ccc !important;
  }
}
</style>
<style lang="less" scoped>
.avatar-uploader .el-upload{
  border: none !important;
}
</style>
