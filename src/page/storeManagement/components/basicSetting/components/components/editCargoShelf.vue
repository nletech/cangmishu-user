<template>
  <mdoel-form>
    <el-form
      :model="form"
      slot="left"
      ref="ShelfReference"
      label-width="120px"
      :rules="formValidator"
    >
      <label class="label">{{ $t('EssentialInformation') }}</label>
      <el-form-item
        :label="$t('ShippingAreaNumber')"
        :class="$style.avatar_uploader"
        prop="code"
      >
        <el-input
          v-model="form.code"
          size="small"
          :placeholder="$t('Examples')"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('BelongingArea')" prop="warehouse_area_id">
        <el-select v-model="form.warehouse_area_id" size="small">
          <el-option
            v-for="item in area_list_data"
            :key="item.id"
            :label="`${item.code}-${item.name_cn}`"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('Capacity')" prop="capacity">
        <el-input v-model="form.capacity" size="small"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('WhetherToEnable')">
        <el-switch
          v-model="form.is_enabled"
          active-value="1"
          inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form-item>
      <label class="label">
        {{ $t('OptionalInformation') }}
      </label>
      <el-form-item :label="$t('aisle')" :class="$style.avatar_uploader">
        <el-input v-model="form.passage" size="small"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('row')">
        <el-input v-model="form.row" size="small"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('Columns')">
        <el-input v-model="form.col" size="small"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('Floor')">
        <el-input v-model="form.floor" size="small"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('remark')">
        <el-input v-model="form.remark" type="textarea" size="small" :rows="3">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit" type="primary" :loading="isButtonLoading">
          {{ $t('submit') }}
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
    MdoelForm
  },
  created() {
    this.get_area_data();
    this.get_data();
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
        is_enabled: '0', // 是否启用
        remark: '', // 备注
        warehouse_id: this.$route.query.warehouse_id
      },
      is_enabled: '0',
      area_list_data: [] // 货区列表数据
    };
  },
  computed: {
    formValidator() {
      return {
        code: [
          {
            required: true,
            message: this.$t('pleaseEnterShippingAreaName'),
            trigger: 'blur'
          }
        ], // 货架编号
        warehouse_area_id: [
          {
            required: true,
            message: this.$t('PleaseSelectTheTargoarea'),
            trigger: 'change'
          }
        ] // 货区id
      };
    }
  },
  methods: {
    get_area_data() {
      if (!this.$route.query.warehouse_id) return;
      $http
        .getWarehouseArea({ warehouse_id: this.$route.query.warehouse_id })
        .then(res => {
          this.area_list_data = res.data.data;
        });
    }, // 获取货区列表
    get_data() {
      let allData = {}; // 缓存拿到的数据
      if (this.$route.query.edit) {
        if (this.$route.query.currentPage !== 1) {
          // 请求非首页的数据
          $http
            .checkWarehouseshelf({
              page: this.$route.query.currentPage,
              warehouse_id: this.$route.query.warehouse_id
            })
            .then(res => {
              if (res.status) return;
              allData = res.data.data; // 存储数据
              for (let i = 0; i < allData.length; i += 1) {
                if (allData[i].id === this.$route.query.shelfId) {
                  this.form.code = allData[i].code;
                  this.form.warehouse_area_id = allData[i].warehouse_area.id;
                  this.is_enabled = `${allData[i].is_enabled}`; // 这里必须是字符串
                  // 可选信息
                  this.form.passage = allData[i].passage;
                  this.form.row = allData[i].row;
                  this.form.col = allData[i].col;
                  this.form.floor = allData[i].floor;
                  this.form.remark = allData[i].remark;
                  this.form.capacity = allData[i].capacity;
                }
              }
            });
        } else {
          // 请求首页的数据
          $http
            .getWarehouseshelf({ warehouse_id: this.$route.query.warehouse_id })
            .then(res => {
              if (res.status) return;
              allData = res.data.data; // 存储数据
              for (let i = 0; i < allData.length; i += 1) {
                if (allData[i].id === this.$route.query.shelfId) {
                  this.form.code = allData[i].code;
                  this.form.warehouse_area_id = allData[i].warehouse_area.id;
                  this.is_enabled = `${allData[i].is_enabled}`; // 这里必须是字符串
                  this.form.is_enabled = `${allData[i].is_enabled}`;
                  // 可选信息
                  this.form.passage = allData[i].passage;
                  this.form.row = allData[i].row;
                  this.form.col = allData[i].col;
                  this.form.floor = allData[i].floor;
                  this.form.remark = allData[i].remark;
                  this.form.capacity = allData[i].capacity;
                }
              }
            });
        }
      }
    }, // 获取当前货位信息
    onSubmit() {
      this.$refs.ShelfReference.validate(valid => {
        if (!valid) return;
        $http
          .editWarehouseshelf(this.$route.query.shelfId, this.form)
          .then(res => {
            if (res.status) return;
            this.$message({
              message: this.$t('success'),
              type: 'success',
              showClose: true
            });
            this.$router.push({
              name: 'basicSetting',
              query: {
                add_shelf_back: true,
                warehouse_id: this.$route.query.warehouse_id
              }
            });
          });
      });
    }
  }
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
