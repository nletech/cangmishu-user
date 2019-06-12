<template>
<div class="goods_edit">
  <mdoel-form :colValue="24">
              <el-form  :model="form"
                        slot="left"
                        label-width="120px"
                        :rules="formValidator"
                        ref="form">
                        <label class="label"> {{'基本信息'}} </label>
                        <el-form-item  label="货品分类"
                                       prop="category_id">
                                       <el-select  v-model="form.category_id"
                                                   size="small">
                                                   <el-option  v-for="item in typeList"
                                                               :label="item.name_cn"
                                                               :value="item.id"
                                                               :disabled="item.is_enabled === 0"
                                                               :key="item.id">
                                                   </el-option>
                                       </el-select>
                        </el-form-item>
                        <el-form-item>
                                    <div  :class="$style.code"
                                          v-show="form.category_id === item.id"
                                          v-for="item in typeList"
                                          :key="item.id">
                                          <el-tag  v-show="item.need_best_before_date">最佳食用期</el-tag>
                                          <el-tag  v-show="item.need_expiration_date">保质期</el-tag>
                                          <el-tag  v-show="item.need_production_batch_number">批次号</el-tag>
                                    </div>
                        </el-form-item>
                        <el-form-item  label="中文名称"
                                       prop="name_cn"
                                       style="width:70%">
                                       <el-input v-model="form.name_cn"
                                                 size="small"
                                                 :disabled="!!$route.query.isCheck">
                                       </el-input>
                        </el-form-item>
                        <el-form-item  label="外文名称"
                                       prop="name_en"
                                       style="width:70%">
                                       <el-input  v-model="form.name_en"
                                                  size="small"
                                                  :disabled="!!$route.query.isCheck">
                                       </el-input>
                        </el-form-item>
                        <label class="label"> {{'货品规格'}} </label>
                        <el-form-item>
                                      <el-table  :data="skuList"
                                                 border >
                                                  <my-edit-table  label="规格中文名*"
                                                                  prop="name_cn">
                                                  </my-edit-table>
                                                  <my-edit-table  label="规格外文名*"
                                                                  prop="name_en">
                                                  </my-edit-table>
                                                  <my-edit-table  label="SKU*"
                                                                  prop="relevance_code"
                                                                  :isDisabled="!!$route.query.id">
                                                  </my-edit-table>
                                                  <my-edit-table  label="净重(g)"
                                                                  width="80"
                                                                  prop="net_weight">
                                                  </my-edit-table>
                                                  <my-edit-table  label="毛重(g)"
                                                                  width="80"
                                                                  prop="gross_weight">
                                                  </my-edit-table>
                                                  <el-table-column  prop="send_email"
                                                                    label="是否发送库存报警邮件"
                                                                    width="80">
                                                                    <template slot-scope="scope">
                                                                                <el-switch
                                                                                  v-model="form.is_send_email"
                                                                                  active-value="1"
                                                                                  inactive-value="0"
                                                                                  active-color="#13ce66"
                                                                                  inactive-color="#ff4949">
                                                                                </el-switch>
                                                                    </template>
                                                  </el-table-column>
                                                  <table-function  label="操作"
                                                                   :disabled="!!$route.query.isCheck"
                                                                   width="160px">
                                                                   <template  slot="edit"
                                                                              slot-scope="scope">
                                                                              <el-button  :disabled="!!$route.query.isCheck"
                                                                                          @click="saveSpec(scope.row, scope.index, scope.row.is_add)"
                                                                                          type="text">
                                                                                          {{$t('save')}}
                                                                              </el-button>
                                                                   </template>
                                                                  <template  slot-scope="scope">
                                                                             <el-button  @click="delScpe(scope.row, scope.index)"
                                                                                         :disabled="!!$route.query.isCheck"
                                                                                         type="danger"
                                                                                         size="mini">
                                                                                         {{$t('remove')}}
                                                                             </el-button>
                                                                  </template>
                                                  </table-function>
                                      </el-table>
                        </el-form-item>
                        <label class="label"> {{'选填信息'}} </label>
                        <el-form-item :label="$t('goodsRemark')"
                                      style="width:70%">
                                      <el-input  v-model="form.remark"
                                                 :disabled="!!$route.query.isCheck"
                                                 type="textarea"
                                                 :autosize="{ minRows: 4, maxRows: 6}">
                                      </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('goodsPhoto')">
                                      <picture-upload :photo.sync="form.photos"
                                                      :disabled="!!$route.query.isCheck">
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
import { English, noChinese, Chinese } from '@/lib/validateForm';

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
      isOriginEdit: false, // 编辑还是新增
      originInfo: {},
      form: {
        category_id: '', // 所属分类
        name_cn: '', // 仓库中文
        name_en: '', // 仓库外文
        hs_code: '',
        display_link: '',
        photos: '', // 图片
        remark: '',
        is_send_email: '1', // 是否发送邮件
      },
      en: true,
      tips: '',
      spec_name: '', // 添加规格名
      typeList: [], // 分类列表
      skuList: [], // 商品规格
      fileList: [],
      is_edit: false,
    };
  },

  watch: {
    warehouseId() {
      this.getTypeList();
    },
  },
  created() {
    if (!this.$route.query.id) {
      this.skuList.push(this.specsForm());
    } else {
      this.getInfo();
    }
    this.getTypeList();
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    formValidator() {
      const validatorChinese = (rule, value, callback) => {
        if (!Chinese(value)) {
          return callback(Error('中文名称必须包含中文'));
        }
        return callback();
      };
      const validatorEnglish = (rule, value, callback) => {
        if (!English(value) || !noChinese(value)) {
          return callback(Error('外文名称不能出现中文且必须包含外文'));
        }
        return callback();
      };
      return {
        category_id: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        name_cn: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          { validator: validatorChinese, trigger: 'blur' },
        ],
        name_en: [
          { required: true, message: '请输入外文名称', trigger: 'blur' },
          { validator: validatorEnglish, trigger: 'blur' },
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
    // 货品分类列表
    getTypeList() {
      $http.getCategoryManagement().then((res) => {
        this.typeList = res.data.data;
      });
    },
    // 规格取消
    ScpeCancel(row) {
      if (row.id) {
        this.$set(row, '$_edit', false);
      } else {
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            row[key] = '';
          }
        }
        this.$set(row, '$_edit', true);
      }
    },
    // 保存/编辑规格
    saveSpec(row, index, is) {
      if (!row.name_cn || !row.name_en) {
        this.$message({
          message: '规格中外文名不能为空',
          type: 'warning',
        });
        return;
      }
      if (/\w*[\u4E00-\u9FFF]+\w*/g.test(row.name_en)) {
        this.$message({
          message: '规格外文名不能含中文名',
          type: 'warning',
        });
        return;
      }
      if (!row.relevance_code) {
        this.$message({
          message: '外部编码不能为空',
          type: 'warning',
        });
        return;
      }
      if (!/^[a-zA-Z0-9]{4,}$/g.test(row.relevance_code)) {
        this.$message({
          message: '外部编码只能为数字或字母，且长度必须大于3位',
          type: 'warning',
        });
        return;
      }
      if (this.$route.query.id) {
        row.product_id = this.$route.query.id;
        if (row.id) row.spec_id = row.id;
        if (this.warehouseId) row.warehouse_id = this.warehouseId;
        $http.addSpec(row, row.id).then(() => {
          this.$message({
            message: !row.id ? '添加成功' : '修改成功',
            type: 'success',
          });
          this.$set(row, '$_edit', false);
          this.getInfo();
        });
      } else {
        for (let i = 0; i < this.skuList.length; i += 1) {
          if (i !== index && row.relevance_code === this.skuList[i].relevance_code) {
            this.$message({
              message: '外部编码已存在',
              type: 'warning',
            });
            return;
          }
        }
        if (!is) this.skuList.push(this.specsForm());
        this.is_edit = false;
        this.$set(row, '$_edit', false);
      }
    },
    // 删除规格
    delScpe(row, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (this.$route.query.id) {
          $http.delSpec({
            spec_id: row.id,
            warehouse_id: this.warehouseId,
          }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.getInfo();
          });
          return;
        }
        this.skuList.splice(index, 1);
      });
    },
    // 初始化表单
    specsForm() {
      return {
        name_en: '',
        name_cn: '',
        net_weight: '',
        gross_weight: '',
        relevance_code: '',
        $_edit: true,
      };
    },
    // 提交商品信息
    onSubmitGoods(formName) {
      let ctr = true;
      this.skuList.filter(res => res.name_cn).forEach((val) => {
        if (!val.name_en) {
          ctr = false;
          this.$message({
            message: '规格中外文名不能为空',
            type: 'warning',
          });
          return;
        }
        if (/\w*[\u4E00-\u9FFF]+\w*/g.test(val.name_en)) {
          ctr = false;
          this.$message({
            message: '规格外文名不能含中文名',
            type: 'warning',
          });
          return;
        }
        if (!val.relevance_code) {
          ctr = false;
          this.$message({
            message: '外部编码不能为空',
            type: 'warning',
          });
          return;
        }
        if (!/^[a-zA-Z0-9]{4,}$/g.test(val.relevance_code)) {
          ctr = false;
          this.$message({
            message: '外部编码只能为数字或字母，且长度必须大于3位',
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
            this.form.specs = this.skuList.filter(res => res.name_cn);
            this.form.specs[0].is_warning = this.form.is_send_email;
            console.log(this.form, 'this.form');
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
