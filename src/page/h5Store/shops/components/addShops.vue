<template>
  <el-dialog
      :title="status ? '编辑店铺' : '新增店铺'"
      width="90%"
      @update:visible="$emit('update:visible', $event)"
      :visible="visible">
      <el-row>
          <el-col :span="12" :offset="6">
              <el-form label-width="100px">
                <label
                  style="font-size: 16px;
                  position: relative;
                  font-weight: bold;
                  display: inline-block;
                  margin: 0 0 20px 0">
                  {{'店铺信息'}}
                </label>
                <el-form-item :label="'店铺名称'">
                    <el-input v-model="shop_form.name_cn"></el-input>
                </el-form-item>
                <el-form-item :label="'店铺简介'">
                    <el-input v-model="shop_form.remark"></el-input>
                </el-form-item>
                <label
                  style="font-size: 16px;
                  position: relative;
                  display: inline-block;
                  font-weight: bold;
                  margin: 0 0 20px 0">
                  {{'联系方式'}}
                </label>
                <el-form-item :label="'店主姓名'">
                    <el-input v-model="shop_form.contact.fullname"></el-input>
                </el-form-item>
                <el-form-item :label="'联系方式'">
                    <el-input v-model="shop_form.contact.phone"></el-input>
                </el-form-item>
                <el-form-item
                    prop="address"
                    label="省市区"
                    size="middle">
                    <el-cascader  style="width:100%;"
                                  :props="props"
                                  :options="addressInfo"
                                  v-model="shop_form.contact.pre_address">
                    </el-cascader>
                </el-form-item>
                <el-form-item
                    prop="addressDetail"
                    label="详细地址"
                    maxlength="30"
                    size="middle">
                    <el-input
                        type="textarea"
                        placeholder="最多不超过30个字"
                        v-model="shop_form.contact.address">
                    </el-input>
                </el-form-item>
                <el-form-item>
                  <el-row>
                      <el-col :span="2" :offset="10">
                          <el-button type="primary" @click.native="onSubmit">提交</el-button>
                      </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
          </el-col>
      </el-row>
  </el-dialog>
</template>
<script>
import $http from '@/api/index';
import Address from '@/assets/address.json';
import mixin from '@/mixin/form_config';

export default {
  name: 'addShops',
  mixins: [mixin],
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
      type: Number,
      default: 1,
    }, // '添加': 1, '编辑': 2
  },
  data() {
    return {
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children',
      },
      addressInfo: Address, // 选择地址联动
      shops: [],
      shop_form: {
        name_cn: '', // 店铺名称
        remark: '', // 店铺简介
        contact: {
          fullname: '', // 店主名称
          phone: '', // 电话
          pre_address: '', // 省市区
          address: '', // 详细地址
        },
      },
    };
  },
  watch: {
    visible() {
      if (this.visible && this.status === 2) {
        console.log(this.row_data, 'row_data');
        this.editInit(this.row_data);
      }
    },
  },
  methods: {
    onSubmit() {
      if (this.status === 1) {
        this.addShop();
      } else if (this.status === 2) {
        this.editShop(this.row_data.id);
      }
    },
    addShop() {
      this.shop_form.contact.country = 'China';
      this.shop_form.contact.province = this.shop_form.contact.pre_address[0];
      this.shop_form.contact.city = this.shop_form.contact.pre_address[1];
      this.shop_form.contact.district = this.shop_form.contact.pre_address[2];
      $http.addNewShop({ warehouse_id: this.warehouseId, ...this.shop_form })
        .then((res) => {
          if (res.status) return;
          this.successTips(0, false); // 提示路框
          this.$emit('update:visible', false); // 关闭弹窗
          this.$emit('finishCallback', true); // 操作完成回调
        });
    },
    editShop(shopId) {
      this.shop_form.contact.country = 'China';
      this.shop_form.contact.province = this.shop_form.contact.pre_address[0];
      this.shop_form.contact.city = this.shop_form.contact.pre_address[1];
      this.shop_form.contact.district = this.shop_form.contact.pre_address[2];
      $http.editShop(shopId, { warehouse_id: this.warehouseId, ...this.shop_form })
        .then((res) => {
          if (res.status) return;
          this.successTips(1, false); // 提示路框
          this.$emit('update:visible', false); // 关闭弹窗
          this.$emit('finishCallback', true); // 操作完成回调
        });
    },
    editInit(rowData) {
      this.shop_form.name_cn = rowData.name;
      this.shop_form.remark = rowData.remark;
      this.shop_form.contact.fullname = rowData.sender_address.fullname;
      this.shop_form.contact.phone = rowData.sender_address.phone;
      this.shop_form.contact.address = rowData.sender_address.address;
      this.shop_form.contact.pre_address = [`${rowData.sender_address.province}`, `${rowData.sender_address.city}`, `${rowData.sender_address.district}`];
    },
  },
};
</script>
