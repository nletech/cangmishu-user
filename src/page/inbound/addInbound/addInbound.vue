<template>
<div class="storeManage">
  <mdoel-form :colValue="20">
    <el-form  slot="left"
              label-width="120px"
              :rules="formValidator"
              :model="form"
              ref="form">
             <!-- 基本信息 -->
              <label class="label"> {{$t('EssentialInformation')}} </label>
              <!-- 入库单分类 -->
              <el-form-item :label="$t('inboundType')"
                            prop="type_id">
                            <el-select v-model="form.type_id">
                                      <el-option
                                        v-for="item in batchTypeList"
                                        :label="item.name"
                                        :value="item.id" :key="item.id">
                                      </el-option>
                            </el-select>
              </el-form-item>
              <!-- 确认入库单编号 -->
              <el-form-item label="入库单编号"
                            prop="confirmation_number">
                            <el-input v-model="form.confirmation_number" size="small"></el-input>
              </el-form-item>
              <!-- 供应商 -->
              <el-form-item :label="$t('distributor')"
                            prop="distributor_id">
                            <el-select  v-model="form.distributor_id"
                                        filterable
                                        placeholder="输入关键字以搜索">
                                        <el-option  v-for="item in distributorSelectList"
                                                    :label="item.name_cn"
                                                    :value="item.id" :key="item.id">
                                        </el-option>
                            </el-select>
                            <el-button @click="onDistributor">
                                       {{$t('distributorManagement')}}
                            </el-button>
              </el-form-item>
              <!-- 选择商品 -->
              <label class="label"> {{'待入库商品清单'}}</label>
                      <!-- 选择货品按钮 -->
                      <el-button @click="showDialog">
                                  {{'选择商品'}}
                      </el-button>
              <el-table :data="goodsList"
                        border style="width: 100%;margin: 20px 0 20px 100px;">
                        <el-table-column  type="index"
                                          label="#">
                        </el-table-column>
                        <el-table-column :label="$t('cnName')">
                                          <template slot-scope="scope">
                                                    {{scope.row.name_cn}}({{scope.row.specs[0].name_cn}})
                                          </template>
                        </el-table-column>
                        <el-table-column label="SKU"
                                         width="150px">
                                         <template slot-scope="scope">
                                                   {{scope.row.specs[0].relevance_code}}
                                         </template>
                        </el-table-column>
                        <el-table-column :label="$t('inboundNumbers')"
                                         width="150px;">
                                        <template slot-scope="scope">
                                                  <el-input-number
                                                    size="mini"
                                                    v-model="scope.row.need_num"
                                                    :min="1">
                                                  </el-input-number>
                                        </template>
                        </el-table-column>
                        <el-table-column :label="$t('distributorNumber')"
                                         min-width="120px">
                                          <template slot-scope="scope">
                                                    <el-input size="mini"
                                                              v-model="scope.row.distributor_code">
                                                    </el-input>
                                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('remarks')">
                                        <template slot-scope="scope">
                                                  <el-input size="mini" v-model="scope.row.remark"></el-input>
                                        </template>
                        </el-table-column>
                        <el-table-column :label="$t('operation')">
                                          <template slot-scope="scope">
                                                    <el-button @click="removeGoods(scope.$index)" size="mini">{{$t('delete')}}</el-button>
                                          </template>
                        </el-table-column>
              </el-table>
              <!-- 运输方式 -->
              <label class="label"> {{$t('notNecessaryInfo')}} </label>
              <el-form-item :label="$t('planInboundTime')">
                            <div class="start-time">
                              <el-col :span="10"
                                      style="padding:0;">
                                      <el-date-picker v-model="startDate"
                                                      type="date"
                                                      :placeholder="$t('startDate')"
                                                      :picker-options="pickerOptions"
                                                      value-format="yyyy-MM-dd"
                                                      size="small">
                                      </el-date-picker>
                              </el-col>
                              <el-col :span="6"
                                      style="padding:0;">
                                      <el-time-select  v-model="startTime"
                                                      :picker-options="{
                                                        start: '00:00',
                                                        step: '00:30',
                                                        end: '23:30'
                                                      }"
                                                      :placeholder="$t('startTime')"
                                                      size="small">
                                      </el-time-select>
                                </el-col>
                              </div>
                              <div class="start-time">
                              <el-col :span="10"
                                      style="padding:0;">
                                      <el-date-picker  v-model="endDate"
                                                      type="date"
                                                      :placeholder="$t('endDate')"
                                                      :picker-options="pickerOptions"
                                                      value-format="yyyy-MM-dd"
                                                      size="small">
                                      </el-date-picker>
                              </el-col>
                              <el-col :span="6"
                                      style="padding:0;">
                                      <el-time-select  v-model="endTime"
                                                      :picker-options="{
                                                        start: '00:00',
                                                        step: '00:30',
                                                        end: '23:30'
                                                      }"
                                                      :placeholder="$t('endTime')"
                                                      size="small">
                                      </el-time-select>
                                </el-col>
                            </div>
              </el-form-item>
              <el-form-item :label="$t('remarks')">
                            <el-input v-model="form.remark"
                                      type="textarea"
                                      :autosize="{ minRows: 4, maxRows: 6}">
                            </el-input>
              </el-form-item>
              <el-form-item>
                            <el-button @click="onSave('form')"
                                      type="primary"
                                      :loading="$store.state.config.button_loading">
                                      {{$t('submit')}}
                            </el-button>
                            <el-button @click="$router.go(-1)">
                                      {{$t('cancel')}}
                            </el-button>
              </el-form-item>
    </el-form>
  </mdoel-form>

  <!-- 选择商品弹窗 -->
    <el-dialog  title="选择商品"
                width="80%"
                :visible.sync="goodsDialog"
                :show-close="false"
                :before-close="handleClose">
                <!-- 请选择 -->
                <my-group v-model="params"
                          @submit="onSubmit">
                          <!-- 选择框 -->
                          <el-col :span="4"
                                  :class="$style.myselect">
                                  <my-select keyName="category_id">
                                              <el-option  v-for="item in typeList"
                                                          :label="item.name_cn"
                                                          :value="item.id" :key="item.id">
                                              </el-option>
                                  </my-select>
                          </el-col>
                          <!-- 搜索框 -->
                          <el-col :span="6" :offset="2">
                                  <my-input keyName="keywords"></my-input>
                          </el-col>
                          <!-- 添加商品 -->
                          <el-col :span="2" :offset="8">
                                  <el-button @click="handlerAddGoods">
                                    {{'添加商品'}}
                                  </el-button>
                          </el-col>
                </my-group>
                <!-- 数据表 -->
                <el-table :data="goods"
                          ref="table"
                          border
                          @selection-change="handleSelectionChange"
                          style="width: 100%">
                          <el-table-column
                            type="selection"
                            width="55">
                          </el-table-column>
                          <el-table-column  label="商品名称"
                                            prop="name_cn">
                          </el-table-column>
                          <el-table-column  prop="specs[0].relevance_code"
                                            label="SKU">
                        </el-table-column>
                </el-table>

                <button-pagination :pageParams="params"></button-pagination>

                <span slot="footer"
                      class="dialog-footer">
                      <el-button  type="primary"
                                  @click="confirmSelected"
                                  :loading="$store.state.btn_loading"
                                  :disabled="!goodsSelected.length">
                                  {{$t('submit')}}
                      </el-button>
                      <el-button @click="handleClose()">{{$t('cancel')}}</el-button>
                </span>
    </el-dialog>
    <!-- 供应商管理弹窗 -->
    <el-dialog  title="供应商管理"
                :visible.sync="distributorListShow"
                width="60%">
                <div  class="utils"
                      :class="$style.distributorUtil">
                      <el-button type="primary"
                                 @click="addDistributor"
                                 size="mini">
                                 {{$t('add')}}
                      </el-button>
                </div>

                <el-table :data="distributorList"
                          border
                          style="width: 100%">
                          <el-table-column  type="index"
                                            width="60">
                          </el-table-column>
                          <el-table-column  prop="name_cn"
                                            :label="$t('distributorName')">
                          </el-table-column>
                          <el-table-column  prop="name_en"
                                            label="供应商外文名称">
                          </el-table-column>

                          <el-table-column  label="操作"
                                            width="200">
                                            <template slot-scope="scope">
                                                      <!-- 编辑 -->
                                                      <el-button  @click="distributorEdit(scope.row)"
                                                                  type="primary"
                                                                  size="mini"
                                                                  plain>
                                                                  {{$t('edit')}}
                                                      </el-button>
                                                      <!-- 删除 -->
                                                      <el-button  @click="distributorDelete(scope.row.id)"
                                                                  type="danger"
                                                                  size="mini"
                                                                  plain>
                                                                  {{$t('delete')}}
                                                      </el-button>
                                            </template>
                          </el-table-column>
                </el-table>
                <el-pagination  style="margin: 0; float: right;"
                                @current-change="distributorchange"
                                :current-page="Paramss.page"
                                :page-size="Paramss.size"
                                layout="total, prev, pager, next, jumper"
                                :total="+Paramss.data_count">
                </el-pagination>
    </el-dialog>

    <!-- 新增供应商弹窗 -->
    <el-dialog  :visible.sync="distributorEditShow"
                @close="cancelDistributor"
                width="40%">
                <el-row :gutter="20"
                        :class="$style.distributorEdit">
                        <el-col :span="5">{{'供应商中文名'}}</el-col>
                        <el-col :span="10">
                                <el-input v-model="distributorInfo.name_cn"></el-input>
                        </el-col>
                </el-row>
                <el-row :gutter="20">
                        <el-col :span="5">{{'供应商英文名'}}</el-col>
                        <el-col :span="10">
                                <el-input v-model="distributorInfo.name_en"></el-input>
                        </el-col>
                </el-row>
                <span  slot="footer"
                       class="dialog-footer">
                       <el-button  @click="cancelDistributor">{{$t('cancel')}}</el-button>
                       <el-button  type="primary"
                                  @click="onDistributorSave">{{$t('submit')}}
                       </el-button>
                </span>
    </el-dialog>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import getListData from '@/mixin/list';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import { OnlyLetterAndNumber } from '@/lib/validateForm';

export default {
  components: {
    MdoelForm,
    MyInput,
    MyGroup,
    MySelect,
    buttonPagination,
  },
  mixins: [getListData, mixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - (3600 * 1000 * 24));
        },
      },
      Paramss: {
        page: 1,
        page_size: 10,
        data_count: 0,
      },
      form: {
        warehouse_id: '',
        type_id: '',
        batch_code: '',
        confirmation_number: '',
        distributor_id: '',
        remarks: '',
        transportation_type: '',
        waybill_number: '',
      },
      startDate: '',
      startTime: '',
      endTime: '',
      endDate: '',
      recomendShelfList: [
        { value: 's02-01-21' },
        { value: 's02-01-22' },
      ],
      recomendShelf: '',
      typeList: [], // 货品分类列表
      batchTypeList: [], // 入库单分类
      boundList: [], // 入库仓库
      goodsList: [], // 选中货品列表
      goods: [], // 弹出框货品列表
      goodsSelected: [], // 弹出框选中货品
      goodsDialog: false, // 待入库货品弹出框
      distributorList: [], // 供应商列表
      distributorListShow: false, // 供应商列表对话框
      distributorEditShow: false, // 供应商编辑对话框
      isDistributorEdit: false, // 供应商编辑还是新增
      distributorInfo: {},
      distributorParams: {},
      distributorSelectList: [],
    };
  },
  created() {
    this.getTypeList(); // 货品分类
    this.getBoundList(); // 获取仓库
    this.getBatchTypeList(); // 获取入库单分类
    this.getBatchCode();
    this.getDistributorList();
    this.getDistributorListSelect();
  },
  watch: {
    warehouseId() {
      this.getTypeList();
      this.getBoundList();
      this.getBatchTypeList();
      this.getBatchCode();
      this.getDistributorList();
    },
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    formValidator() {
      const validatorOrdernumber = (rule, value, callback) => {
        if (!OnlyLetterAndNumber(value)) {
          return callback(Error('只能输入字母和数字'));
        }
        return callback();
      };
      return {
        warehouse_id: [
          { required: true, message: '请选择入库仓库', trigger: 'change' },
        ],
        type_id: [
          { required: true, message: '请选择入库单分类', trigger: 'change' },
        ],
        batch_code: [
          { required: true, message: '请输入入库单编号', trigger: 'blur' },
          { validator: validatorOrdernumber, trigger: 'blur' },
        ],
        confirmation_number: [
          { required: true, message: '请输入确认单编号', trigger: 'blur' },
          { validator: validatorOrdernumber, trigger: 'blur' },
        ],
        distributor_id: [
          { required: true, message: '请选择供应商', trigger: 'change' },
        ],
        waybill_number: [
          { validator: validatorOrdernumber, trigger: 'blur' },
        ],
      };
    },
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  methods: {
    handlerAddGoods() {
      this.$router.push({
        name: 'goodsAdd',
        query: { warehouse_id: this.$route.query.warehouse_id },
      });
    },
    getBatchTypeList() {
      if (!this.warehouseId) return;
      this.form.type_id = '';
      const typeParams = {
        page: 1,
        page_size: 100,
        warehouse_id: this.warehouseId,
        is_enabled: 1,
      };
      $http.getBatchType(typeParams).then((res) => {
        this.batchTypeList = res.data.data;
      });
    }, // 拉取入库分类列表
    getDistributorList() {
      $http.getDistributor().then((res) => {
        this.distributorList = res.data.data;
        this.Paramss.data_count = res.data.total;
      });
    }, // 供应商列表
    getDistributorListSelect() {
      $http.getDistributor().then((res) => {
        this.distributorSelectList = res.data.data;
        // this.Paramss.data_count = res.data.total;
      });
    }, // 选择供应商
    handleSelectionChange(val) {
      this.goodsSelected = val;
    }, // 处理选择商品弹框的选择事件
    distributorchange(val) {
      this.Paramss.page = val;
      this.getDistributorList();
    },
    getTypeList() {
    },
    // 获取入库单编号
    getBatchCode() {
    },
    // 获取仓库列表
    getBoundList() {
    },
    // 待入库货品弹出框
    showDialog() {
      this.goodsDialog = true;
      this.params.page = 1;
      this.params.keyword = '';
      this.getList();
    },
    // 拉取待入库货品列表
    getList() {
      if (!this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId;
      this.goods = [];
      // 获取商品列表(商品是规格)
      $http.getProducts({ warehouse_id: this.warehouseId })
        .then((res) => {
          this.arr = this.goodsSelected.length ? this.goodsSelected : [...this.goodsList];
          this.goodsSelected = this.arr;
          this.goods = res.data.data;
          console.log(res, 'getProducts', this.goods, 'this.goods');
          this.params.data_count = res.data.total;
        });
    },
    // 货品列表行点击
    rowClickGoods(row) {
      this.$set(row, 'checked', !row.checked);
      if (row.checked) {
        // eslint-disable-next-line
        this.goodsSelected.some(item => item.id === row.id) || this.goodsSelected.push(row);
        return;
      }
      this.goodsSelected = this.goodsSelected.filter(item => +item.id !== +row.id);
    },
    // 选择货品弹框确认
    confirmSelected() {
      this.goodsList = [...this.goodsSelected];
      this.handleClose();
    },
    // 选择货品弹框关闭
    handleClose() {
      this.goodsSelected = [];
      this.goodsDialog = false;
    },
    // 删除已选择货品
    removeGoods(index) {
      this.goodsList.splice(index, 1);
    },
    // 入库单提交
    onSave(formName) {
      this.items = [];
      console.log(this.goodsList, 'this.goodsList');
      // eslint-disable-next-line
      for (const item of this.goodsList) {
        this.items.push({
          // id: item.product_id,
          spec_id: item.id,
          relevance_code: item.specs[0].relevance_code,
          need_num: item.need_num,
          // pieces_num: item.pieces_num || '',
          distributor_code: item.distributor_code,
          remark: item.remark || '',
        });
      }
      this.form.product_stock = this.items;
      if (this.startDate && this.startTime && this.endDate && this.endTime) {
        this.form.plan_time = `${this.startDate} ${this.startTime}:00`;
        this.form.over_time = `${this.endDate} ${this.endTime}:00`;
        const timeDiff = Date.parse(this.form.over_time) - Date.parse(this.form.plan_time);
        if (timeDiff < 0) {
          this.$notify({
            message: '结束时间必须晚于开始时间!',
            type: 'warning',
          });
          return;
        }
      }
      this.form.warehouse_id = this.warehouseId;
      this.$refs[formName].validate((valid) => {
        // console.log(this.form, 'this.form');
        if (valid) {
          $http.addInbound(this.form).then(() => {
            // this.successTips();
            this.$router.push({
              name: 'inboundList',
            });
            this.$message({
              message: '添加成功!',
              type: 'success',
            });
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
    // 供应商管理弹出框
    onDistributor() {
      this.distributorListShow = true;
      // this.getDistributorList();
    },
    // 删除供应商
    distributorDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.deleteDistributor(id)
          .then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.getDistributorList();
            this.getDistributorListSelect();
          });
      });
    },
    // 保存供应商
    onDistributorSave() {
      this.distributorParams = {
        name_cn: this.distributorInfo.name_cn,
        name_en: this.distributorInfo.name_en,
      };
      if (this.isDistributorEdit) {
        $http.editDistributor(this.distributorInfo.id, this.distributorParams)
          .then(() => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.getDistributorListSelect();
            this.getDistributorList();
            this.distributorEditShow = false;
          });
      } else {
        $http.addDistributor(this.distributorParams)
          .then(() => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.getDistributorListSelect();
            this.getDistributorList();
            this.distributorEditShow = false;
          });
      }
    },
    // 新增供应商弹出框
    addDistributor() {
      this.distributorEditShow = true;
      this.isDistributorEdit = false;
    },
    // 编辑供应商弹出框
    distributorEdit(row) {
      this.distributorEditShow = true;
      this.isDistributorEdit = true;
      this.distributorInfo = Object.assign({}, row);
    },
    // 取消新增供应商
    cancelDistributor() {
      this.distributorEditShow = false;
      this.distributorInfo.name_en = '';
      this.distributorInfo.name_cn = '';
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';
.label {
  font-size: 18px;
}
.distributorUtil {
  text-align: right;
  margin-bottom: 20px;
}
.distributorEdit {
  margin-bottom: 20px;
}
.myselect {
  line-height:40px;
  height: 40px;
}
</style>
