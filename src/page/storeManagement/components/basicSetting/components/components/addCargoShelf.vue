<template>
  <mdoel-form>
    <el-form  :model="form"
              slot="left"
              ref="ShelfReference"
              label-width="120px"
              :rules="formValidator">
              <label class="label"> {{'基本信息'}}</label>
              <el-form-item label="货位编号"
                            :class="$style.avatar_uploader"
                            prop="code">
                            <el-input v-model="form.code"
                                      size="small"
                                      placeholder="示例：A1-1-01、00-01、1">
                            </el-input>
              </el-form-item>
              <el-form-item label="所属货区"
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
              <el-form-item label="容积"
                            prop="capacity">
                            <el-input v-model="form.capacity"
                                      size="small">
                                      <span slot="suffix">m³</span>
                            </el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                             <el-switch  v-model="is_enabled"
                                         active-value="1"
                                         inactive-value="0"
                                         active-color="#13ce66"
                                         inactive-color="#ff4949">
                             </el-switch>
              </el-form-item>
              <label class="label">
                      {{'可选信息'}}
              </label>
              <el-form-item label="通道"
                            :class="$style.avatar_uploader">
                            <el-input v-model="form.passage"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item label="行">
                            <el-input v-model="form.row"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item label="列">
                            <el-input v-model="form.col"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item label="层">
                            <el-input v-model="form.floor"
                                      size="small">
                            </el-input>
              </el-form-item>
              <el-form-item label="备注">
                            <el-input v-model="form.remark"
                                      type="textarea"
                                      size="small"
                                      :rows="3">
                            </el-input>
              </el-form-item>
              <el-form-item>
                            <el-button  @click="onSubmit"
                                        type="primary"
                                        :loading="$store.state.config.button_loading">
                                        {{'提交'}}
                            </el-button>
              </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';

export default {
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
        is_enabled: '0', // 是否启用
        remark: '', // 备注
        warehouse_id: '',
      },
      is_enabled: '0',
      area_list_data: [], // 货区列表数据
    };
  },
  computed: {
    formValidator() {
      return {
        code: [
          { required: true, message: '请输入货位编号', trigger: 'blur' },
        ], // 货架编号
        warehouse_area_id: [
          { required: true, message: '请选择货区', trigger: 'change' },
        ], // 货区id
        capacity: [
          { required: true, message: '请填写容积', trigger: 'blur' },
        ], // 容积
      };
    },
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    get_area_data() {
      if (!this.warehouseId) return;
      $http.getWarehouseArea({ warehouse_id: this.warehouseId })
        .then((res) => {
          this.area_list_data = res.data.data;
        });
    },
    onSubmit() {
      this.$refs.ShelfReference.validate((valid) => {
        if (!valid) return;
        this.form.is_enabled = this.is_enabled;
        this.form.warehouse_id = this.warehouseId;
        this.$confirm('确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            $http.addWarehouseshelf(this.form)
              .then((res) => {
                // console.log(this.form, 'this.formthis.formthis.form');
                if (res.status) return;
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true,
                });
                this.$router.push({
                  name: 'basicSetting',
                  params: { add_shelf_back: true },
                });
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
