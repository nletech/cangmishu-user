<template>
  <el-dialog
      :title="status ? '编辑店铺' : '新增店铺'"
      width="90%"
      align="center"
      @update:visible="$emit('update:visible', $event)"
      :visible="visible">
      <el-row>
          <el-col :span="12" :offset="6">
              <el-form label-width="100px">
                <label
                  style="font-size: 16px;
                  position: relative;
                  left: -320px;
                  font-weight: bold;
                  display: inline-block;
                  margin: 0 0 20px 0">
                  {{'店铺信息'}}
                </label>
                <el-form-item :label="'店铺名称'">
                    <el-input v-model="shop_form.name"></el-input>
                </el-form-item>
                <el-form-item :label="'店铺简介'">
                    <el-input v-model="shop_form.readme"></el-input>
                </el-form-item>
                <label
                  style="font-size: 16px;
                  position: relative;
                  left: -320px;
                  display: inline-block;
                  font-weight: bold;
                  margin: 0 0 20px 0">
                  {{'联系方式'}}
                </label>
                <el-form-item :label="'店主姓名'">
                    <el-input v-model="shop_form.owner_name"></el-input>
                </el-form-item>
                <el-form-item :label="'联系方式'">
                    <el-input v-model="shop_form.phone"></el-input>
                </el-form-item>
                <el-form-item :label="'发货地址'">
                    <el-input v-model="shop_form.address"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </el-form-item>
              </el-form>
          </el-col>
      </el-row>
  </el-dialog>
</template>
<script>

export default {
  name: 'addShops',
  props: {
    visible: {
      type: Boolean,
      default: false,
    }, // 弹窗显示
    row_data: {
      type: Object,
      default() {
        return {};
      },
    }, // 数据
    status: {
      type: Boolean,
      default: false,
    }, // '添加': false, '编辑': true
  },
  mounted() {
    console.log('mounted');
    this.initData();
  },
  data() {
    return {
      shops: [],
      shop_form: {
        name: '',
        readme: '',
        owner_name: '',
        phone: '',
        address: '',
      },
    };
  },
  methods: {
    initData() {
      if (!this.status) return; // 编辑信息
      this.shop_form.name = this.row_data.name;
      this.shop_form.readme = this.row_data.readme;
      this.shop_form.owner_name = this.row_data.owner_name;
      this.shop_form.phone = this.row_data.phone;
      this.shop_form.address = this.row_data.address;
    }, // 编辑店铺信息
    onSubmit() {
      //
    },
  },
};
</script>

<style lang="less" module>

</style>
