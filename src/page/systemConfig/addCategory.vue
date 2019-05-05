<template>
  <model-form>
    <el-form slot="left"
             label-width="130px"
             :model="form"
             :rules="formValidator "
             ref="classificationForm">
      <label :class="$style.label"> 基本信息 </label>
      <el-form-item label="分类中文名" prop="name_cn">
        <el-input v-model="form.name_cn"></el-input>
      </el-form-item>
      <el-form-item label="分类外文名" prop="name_en">
        <el-input v-model="form.name_en"></el-input>
      </el-form-item>
      <el-form-item :label="$t('cargoProperty')" prop="cargo_property">
        <el-select v-model="form.cargo_property">
          <el-option
            v-for="item in cargoPropertyList"
            :label="item.name"
            :value="item.id" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('SkuProperty')" prop="checkList">
          <el-checkbox-group :class="$style.checkbox" v-model="form.checkList">
            <el-checkbox label="保质期"></el-checkbox>
            <el-checkbox label="生产批次号"></el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="上级分类">
        <el-select v-model="form.value" placeholder="不限">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税费比例">
        <el-input v-model="form.ratio_rate"
                  style="width:200px;">
         <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="分佣比例">
        <el-input v-model="form.extract_rate"
                  style="width:200px;">
          <template slot="append">%</template>
        </el-input>
      </el-form-item> -->
      <!-- <label :class="$style.label"> 高级选项 </label>
      <el-form-item label="含保质期" >
        <el-switch
          v-model="form.need_expiration_date"
          :value="form.need_expiration_date"
          :active-value="1"
          :inactive-value="0"
        ></el-switch> 若开启，该分类下的货品在入库时需填写保质期
      </el-form-item>
      <el-form-item label="是否含出产批次号">
        <el-switch
          v-model="form.need_production_batch_number"
          :value="form.need_production_batch_number"
          :active-value="1"
          :inactive-value="0"
        ></el-switch> 若开启，该分类下的货品在入库时需填写批次号
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="form.is_enabled"
          :value="form.is_enabled"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item> -->
      <!-- <el-form-item label="排序值：">
        <el-input-number
          v-model="form.num1"
          :min="0"
          label="描述文字">
        </el-input-number> 数字越大越靠前
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitCategoryAdd('classificationForm')">提交</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </model-form>
</template>

<script>
import ModelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import { English, noChinese, Chinese } from '@/lib/validateForm';

export default {
  components: {
    ModelForm,
  },
  data() {
    return {
      form: {
        name_cn: '',
        name_en: '',
        cargo_property: '',
        checkList: [],
      },
      cargoPropertyList: [
        { name: '冷冻', id: 1 },
        { name: '冷藏', id: 2 },
        { name: '常温', id: 3 },
      ],
    };
  },
  computed: {
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
        name_cn: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          { validator: validatorChinese, trigger: 'blur' },
        ],
        name_en: [
          { required: true, message: '请输入外文名称', trigger: 'blur' },
          { validator: validatorEnglish, trigger: 'blur' },
        ],
        cargo_property: [
          { required: true, message: '请选择仓库特性', trigger: 'change' },
        ],
      };
    },
  },
  mixins: [mixin],
  methods: {
    submitCategoryAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $http.GoodsAdd(this.form, this.$route.query.id).then(() => {
            this.successTips(this.$route.query.id);
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
    },
  },
};
</script>

<style lang="less" module>
  .label {
    font-size: 18px;
  }
  .avatar_uploader {
    margin-top: 10px;
  }
  .addCategoryButton {
    position: absolute;
    top:0;
    right:0;
  }
  .checkbox span {
    font-weight: normal;
  }
</style>
