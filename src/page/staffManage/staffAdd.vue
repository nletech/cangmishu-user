<template>
<div class="goods_edit">
  <mdoel-form>
      <el-form slot="left" label-width="120px">
        <label class="label"> {{$t('EssentialInformation')}} </label>
        <el-form-item label="EUT邮箱账户">
          <el-input
            v-model="keywords"
            size="small"
            style="width: 100%"
            @blur="userBlur"
            placeholder="请输入EUT邮箱账户"
          ></el-input>
          <!-- <el-select
          v-model="form.user_id"
          filterable
          remote
          reserve-keyword
          default-first-option
          size="small"
          style="width: 100%"
          placeholder="请输入EUT邮箱账户"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.email"
            :value="item.id">
          </el-option>
        </el-select> -->
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
          :loading="$store.state.config.button_loading"
          @click="addEmployee">提交</el-button>
          <cancel-button></cancel-button>
        </el-form-item>
      </el-form>
    </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        user_id: '',
        name: '',
        phone: '',
      },
      time: null,
      userList: [],
      value9: '',
      keywords: '',
      loading: false,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    addEmployee() {
      if (!this.form.user_id) {
        this.$message.error('EUT邮箱账户不存在，请重新输入');
        return;
      }
      $http.addEmployee(this.form, this.$route.query.user_id).then(() => {
        this.successTips(this.$route.query.user_id);
      });
    },
    getInfo() {
      if (!this.$route.query.user_id) return;
      $http.EmployeeInfo(this.$route.query.user_id).then((res) => {
        this.form = res.data;
        this.form.user_id = this.form.employee.id;
        this.keywords = this.form.employee.email;
      });
    },
    // querySearchAsync(query, cb) {
    //   if (!query) {
    //     cb([]);
    //     return;
    //   }
    //   this.loading = true;
    //   clearTimeout(this.time);
    //   this.time = setTimeout(() => {
    //     $http.findList({ keywords: query }).then((res) => {
    //       if (res.data.email) {
    //         this.form.user_id = res.data.user_id;
    //         cb([{ value: res.data.email, label: res.data.id }]);
    //       };
    //       this.loading = false;
    //     }).catch(() => {
    //       cb([]);
    //       this.loading = false;
    //     });
    //   }, 200);
    // },
    userBlur() {
      if (!this.keywords) return;
      $http.findList({ keywords: this.keywords }).then((res) => {
        if (res.data.email) this.form.user_id = res.data.id;
        if (!this.form.user_id) {
          this.$message.error('EUT邮箱账户不存在，请重新输入');
        }
      });
    },
    // handleSelect(item) {
    //   this.from.user_id = item.label;
    // },
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loading = true;
    //     clearTimeout(this.time)
    //     this.time = setTimeout(() => {
    //       this.userList = [];
    //       $http.findList({ keywords: query }).then((res) => {
    //         res.data.email && this.userList.push(res.data);
    //         this.loading = false;
    //       }).catch(() => {
    //         this.loading = false;
    //       });
    //     }, 200);
    //   }
    // },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.label {
  font-size: 18px;
}
</style>
