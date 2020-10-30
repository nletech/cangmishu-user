<template>
  <div class="modify-info">
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="modify-info-ruleform"
          >
            <el-form-item label="手机号" prop="phone">
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.phone"
                  autocomplete="off"
                ></el-input>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <el-button type="primary" plain style="width: 85%"
                  >绑定</el-button
                >
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱" prop="phone">
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.phone"
                  autocomplete="off"
                ></el-input>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <el-button type="primary" plain style="width: 85%"
                  >绑定</el-button
                >
              </el-col>
            </el-form-item>
            <el-form-item label="商户名称" prop="code">
              <el-input v-model="ruleForm.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" prop="code">
              <el-input v-model="ruleForm.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="code">
              <el-input v-model="ruleForm.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属行业" prop="code">
              <el-select v-model="ruleForm.value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onConfirm">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form :model="{ avatar: '' }">
            <el-form-item :label="$t('avatar')" prop="avatar">
              <my-upload
                :img.sync="imageUrl"
                :width="180"
                :height="180"
                @uploadSuccessCallBack="handlerUploadSuccessCallBack"
              >
                <template slot="btnTitle">{{ $t("upload") }}</template>
              </my-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import $http from '@/api';
import myUpload from '@/components/imageUpload/index';

export default {
  name: 'bindPhone',
  data() {
    const minLength = { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' };
    return {
      value: '',
      ruleForm: {
        phone: '',
        code: '',
      },
      rules: {
        phone: [
          { required: true, message: '请输入更改手机号', trigger: 'blur' },
          minLength,
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      imageUrl: '',
      options: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
    };
  },
  components: {
    myUpload,
  },
  computed: {
    user_id() {
      return +localStorage.getItem('setUser');
    },
  },
  methods: {
    handlerUploadSuccessCallBack(url) {
      this.imageUrl = url;
    },
    onConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          $http.modifyPsw(this.user_id, this.ruleForm)
            .then((res) => {
              if (res.status) return;
              this.$refs.ruleForm.resetFields();
              this.$message({
                type: 'success',
                message: this.$t('success'),
              });
            });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.modify-info {
  .modify-info-ruleform {
    max-width: 500px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .switch {
    margin: 20px 0;
  }
}
</style>
