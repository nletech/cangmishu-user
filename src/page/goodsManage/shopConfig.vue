<template>
<div class="storeManage">
  <div :class="$style.top_button">
      <!-- <span :class="$style.top_notice">货品分类为所有仓库通用，请谨慎添加 </span> -->
      <el-button @click="dialogFormVisible = true">添加店铺</el-button>
  </div>
  <wms-tags>
    <el-table
      :data="renters_list_data"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="name_cn"
        label="店铺名称">
      </el-table-column>
      <el-table-column
        prop="name_en"
        label="app_key">
      </el-table-column>
      <el-table-column
        prop="is_enabled"
        label="app_secret">
        <template slot-scope="scope">
          <el-button v-if="true"
                     @click="unlockKeyVisible = true"
                     round>点击查看
          </el-button>
          <span v-if="scope.row.is_enabled==0">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click="delClassification(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
     <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>
  <el-dialog title="添加店铺" :visible.sync="dialogFormVisible" center>
  <el-form :model="form"
           :class="$style.form_width"
           :rules="formValidator "
           ref="shop_name">
    <el-form-item prop="name_cn">
      <el-input v-model="form.name_cn" placeholder="请输入店铺中文名" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item prop="name_en">
      <el-input v-model="form.name_en" placeholder="请输入店铺外文名" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="confirmAddShop('shop_name')">确 定</el-button>
  </div>
</el-dialog>
<el-dialog :visible.sync="unlockKeyVisible" center>
    <el-input v-model="password"
              placeholder="为防止信息泄露，请输入账号密码"
              auto-complete="off">
    </el-input>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="checkSecret">查看</el-button>
  </div>
</el-dialog>
</div>
</template>

<script>
import WmsTags from '@/components/wms_tags';
import buttonPagination from '@/components/pagination_and_buttons';
import mixin from '@/mixin/list';
import $http from '@/api';
import { English, noChinese, Chinese } from '@/lib/validateForm';

export default {
  data() {
    return {
      form: {
        name_cn: '',
        name_en: '',
      },
      password: '',
      renters_list_data: [], // 仓库列表状态
      dialogFormVisible: false,
      unlockKeyVisible: false,
    };
  },
  mixins: [mixin],
  components: {
    WmsTags,
    buttonPagination,
  },
  // created() {
  //   this.getList();
  // },
  watch: {
    warehouseId() {
      this.getList();
    },
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId;
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
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  methods: {
    // 获取仓库货品分类列表
    getList() {
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      $http.categoryList(this.params).then((res) => {
        this.renters_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    checkSecret() {

    },
    confirmAddShop(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $http.GoodsAdd(this.form, this.$route.query.id).then(() => {
            this.successTips(this.$route.query.id);
            this.dialogFormVisible = false;
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
    addCategory(id) {
      this.$router.push({
        name: 'addCategory',
        query: {
          id,
        },
      });
    },
    delClassification(ids) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delAddress({ id: ids }, this.params.type).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.getList();
        });
      });
    },
  },
};
</script>

<style lang="less" module>
  @import '../../less/public_variable.less';
  .top_button {
  width: 93%;
  padding: 10px 45px 0px 45px;
  display: inline-flex;
  justify-content: flex-end;
  align-items: baseline;
  .top_notice {
    color: red;
    padding-right: 10px;
  }
  .form_width {
    width: 60%;
  }
}
</style>
