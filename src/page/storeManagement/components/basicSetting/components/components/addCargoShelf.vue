<template>
  <mdoel-form>
    <el-form  :model="form"
              slot="left"
              ref="ShelfReference"
              label-width="120px"
              :rules="formValidator">
              <label class="label"> {{$t('EssentialInformation')}}</label>
              <el-form-item :label="$t('ShippingAreaNumber')"
                            :class="$style.avatar_uploader"
                            prop="code">
                            <el-input v-model="form.code"
                                      size="small"
                                      :placeholder="$t('Examples')">
                            </el-input>
              </el-form-item>
              <el-form-item :label="$t('BelongingArea')"
                            prop="warehouse_area_id">
                            <el-select v-model="form.warehouse_area_id"
                                       size="small">
                                        <el-option  :disabled="!item.is_enabled"
                                                    v-for="item in area_list_data"
                                                    :key="item.id"
                                                    :value="item.id"
                                                    :label="item.code + '-' + item.name_cn">
                                        </el-option>
                            </el-select>
              </el-form-item>
              <el-form-item :label="$t('Capacity')"
                            prop="capacity">
                            <el-input v-model="form.capacity"
                                      size="small">
                                      <span slot="suffix">m³</span>
                            </el-input>
              </el-form-item>
              <el-form-item  :label="$t('WhetherToEnable')">
                             <el-switch  v-model="is_enabled"
                                         active-value="1"
                                         inactive-value="0"
                                         active-color="#13ce66"
                                         inactive-color="#ff4949">
                             </el-switch>
              </el-form-item>
              <label class="label">
                      {{$t('OptionalInformation')}}
              </label>
              <el-form-item :label="$t('aisle')"
                            :class="$style.avatar_uploader">
                            <el-input v-model="form.passage"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item :label="$t('row')">
                            <el-input v-model="form.row"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item :label="$t('Columns')">
                            <el-input v-model="form.col"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item :label="$t('Floor')">
                            <el-input v-model="form.floor"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item :label="$t('remark')">
                            <el-input v-model="form.remark"
                                      type="textarea"
                                      size="small"
                                      :rows="3">
                            </el-input>
              </el-form-item>
              <el-form-item>
                            <el-button  @click="onSubmit"
                                        type="primary"
                                        :loading="isButtonLoading">
                                        {{$t('submit')}}
                            </el-button>
              </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  components: {
    MdoelForm,
  },
  created() {
    this.get_area_data();
  },
  data() {
    return {
      form: {
        code: '', // 货位编号
        warehouse_area_id: '', // 货架 ID
        capacity: '', // 容积
        passage: '', // 通道
        row: '', // 排
        col: '', // 列
        floor: '', // 层
        is_enabled: '1', // 是否启用
        remark: '', // 备注
        warehouse_id: '',
      },
      is_enabled: '1',
      area_list_data: [], // 货区列表数据
    };
  },
  computed: {
    formValidator() {
      return {
        code: [
          { required: true, message: this.$t('Pleaseenterrackcode'), trigger: 'blur' },
        ], // 货架编号
        warehouse_area_id: [
          { required: true, message: this.$t('PleaseSelectTheTargoarea'), trigger: 'change' },
        ], // 货区id
        capacity: [
          { required: true, message: this.$t('pleaseEnterCapacity'), trigger: 'blur' },
        ], // 容积
      };
    },
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    get_area_data() {
      if (!this.$route.query.warehouse_id) return;
      $http.getWarehouseArea({ warehouse_id: this.$route.query.warehouse_id })
        .then((res) => {
          this.area_list_data = res.data.data;
        });
    },
    onSubmit() {
      this.$refs.ShelfReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = this.is_enabled;
        this.form.warehouse_id = this.$route.query.warehouse_id;
        $http.addWarehouseshelf(this.form)
          .then((res) => {
            if (res.status) return;
            this.$message({
              message: this.$t('success'),
              type: 'success',
              showClose: true,
            });
            this.$router.push({
              name: 'basicSetting',
              query: {
                add_shelf_back: true,
                warehouse_id: this.form.warehouse_id,
              },
            });
          });
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
</style>
