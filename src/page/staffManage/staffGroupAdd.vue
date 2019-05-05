<template>
<div class="goods_edit">
  <mdoel-form>
      <el-form slot="left" label-width="120px">
        <el-form-item label="当前仓库">
          <el-select size="small" style="width: 100%" v-model="form.warehouse_id">
            <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :value="item.id"
            :label="item.name_cn"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文组名">
          <el-input v-model="form.name_cn" size="small"></el-input>
        </el-form-item>
        <el-form-item label="外文组名">
          <el-input v-model="form.name_en" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="$store.state.config.button_loading">提交</el-button>
        </el-form-item>
      </el-form>
    </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';

export default {
  components: {
    MdoelForm,
  },
  data() {
    return {
      form: {
        name_cn: '',
        name_en: '',
        remark: '',
        warehouse_id: '',
      },
      warehouseList: [],
    };
  },
  created() {
    this.getList();
  },
  computed: {
  },
  methods: {
    getList() {
      $http.warehouse({ form: 1 }).then((res) => {
        this.warehouseList = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.label {
  font-size: 18px;
}
</style>
