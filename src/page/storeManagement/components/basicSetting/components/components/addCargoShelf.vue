<template>
  <mdoel-form>
    <el-form
      slot="left"
      ref="ShelfReference"
      :model="form"
      label-width="120px"
      :rules="formValidator"
    >
      <label class="label"> {{$t('EssentialInformation')}}</label>
      <el-form-item :label="$t('ShelfNumber')" :class="$style.avatar_uploader" prop="code">
        <el-input v-model="form.code" size="small" placeholder="示例：A1-1-01、00-01、1"></el-input>
      </el-form-item>
      <el-form-item :label="$t('BelongingArea')" prop="warehouse_area_id">
        <el-select v-model="form.warehouse_area_id" size="small">
          <el-option
            v-for="item in area_list_data"
            :key="item.id"
            :value="item.id"
            :disabled="!item.is_enabled"
            :label="item.code + '-' + item.name_cn"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('Capacity')" prop="capacity">
        <el-input v-model="form.capacity" size="small">
          <span slot="suffix">m³</span>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-switch v-model="is_enabled"></el-switch>
      </el-form-item>
      <label class="label"> {{$t('OptionalInformation')}} </label>
      <el-form-item :label="$t('aisle')" :class="$style.avatar_uploader">
        <el-input v-model="form.passage" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('row')">
        <el-input v-model="form.row" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Columns')">
        <el-input v-model="form.col" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Floor')">
        <el-input v-model="form.floor" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('remarks')">
        <el-input v-model="form.remark" type="textarea" size="small" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="$store.state.config.button_loading"
          @click="onSubmit"
        >
          {{$route.query.shelfId ? $t('ModifyNow') : $t('CreateNow')}}
        </el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import mixin from '@/mixin/form_config';
import mixins from '@/mixin/list';
import $http from '@/api';
import { code, area, shelfCode, OnlyNumber } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin, mixins],
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
        is_enabled: 0, // 是否启用
        remark: '', // 备注
        warehouse_id: this.$route.query.id,
      },
      is_enabled: true,
      area_list_data: [],
      params: {
        type: '',
        warehouse_id: this.$route.query.id,
      },
    };
  },
  computed: {
    shelfId() {
      return this.$route.query.shelfId;
    },
    formValidator() {
      const validatorCode = (rule, value, callback) => {
        const splitArr = value.split('-');
        if (!code(value)) {
          return callback(Error(this.$t('PleaseEnterTheWarehouseNumbers')));
        }
        if (splitArr.length === 3 && shelfCode(value)) {
          return callback();
        }
        if (splitArr.length === 2 &&
            OnlyNumber(splitArr[0]) && OnlyNumber(splitArr[1])) {
          return callback();
        }
        if (splitArr.length === 1 && OnlyNumber(splitArr[0])) {
          return callback();
        }
        return callback(Error(this.$t('PleaseEnterTheRightWarehouseShelf')));
      };
      const validatorArea = (rule, value, callback) => {
        if (!area(value)) {
          return callback(Error(this.$t('PleaseEnterTheWarehouseCapacity')));
        }
        return callback();
      };
      return {
        code: [
          { required: true, message: this.$t('PleaseEnteTheShelfNumber'), trigger: 'blur' },
          { validator: validatorCode, trigger: 'blur' },
        ], // 货架编号
        warehouse_area_id: [
          { required: true, message: this.$t('PleaseSelectTheGoodsArea'), trigger: 'blur' },
        ], // 货区id
        capacity: [
          { required: true, message: this.$t('PleaseWnterTheVolume'), trigger: 'blur' },
          // { max: 255, message: this.$t('TheLengthIs'), trigger: 'blur' },
          { validator: validatorArea, trigger: 'blur' },
        ], // 容积
      };
    },
  },
  methods: {
    getList() {
      $http.warehouseArea(this.params).then((res) => {
        this.area_list_data = res.data.data.filter(item => !!item.is_enabled);
        this.getInfo();
      });
    },
    getInfo() {
      if (!this.shelfId) return;
      $http.shelfInfo(this.shelfId).then((res) => {
        this.is_enabled = !!res.data.is_enabled;
        this.form = res.data;
      });
    },
    onSubmit() {
      this.$refs.ShelfReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = +this.is_enabled;
        console.log(this.form);
        if (this.shelfId) this.form.id = this.shelfId;
        $http.addWarehouseshelf(this.form, this.shelfId).then(() => {
          this.successTips(this.shelfId);
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
