<template>
          <div  class="storeManage">
                <mdoel-form   :colValue="24">
                    <el-form  slot="left"
                              :rules="formValidator"
                              :model="form" label-width="100px"
                              ref="form">
                          <el-row type="flex" justify="space-between">
                          <el-col :span="8">
                          </el-col>
                          <el-col :span="7"><h2 align="center" style="margin:0px;">商品采购清单</h2></el-col>
                          <el-col :span="8">
                            <!-- 确认入库单编号 -->
                              <el-form-item label="单据编号" label-position="right"
                                          prop="confirmation_number" style="float:right" class="noborder">
                                  <el-input v-model="form.confirmation_number" prefix-icon="el-icon-tickets">
                                    <el-button slot="append" @click="getBatchCode" icon="el-icon-refresh"></el-button>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <hr/>
                        <label class="label"> 基本信息 </label>
                        <!-- 入库单分类 -->
                        <el-row type="flex" justify="space-between">
                          <el-col :span="8">
                            <el-form-item label="分类" label-position="right" prop="order_type">
                              <!-- 供应商 -->
                                  <el-select v-model="form.type_id">
                                            <el-option
                                              v-for="item in batchTypeList"
                                              :label="item.name"
                                              :disabled="item.is_enabled === 0"
                                              :value="item.id" :key="item.id">
                                            </el-option>
                                  </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                          </el-col>
                          <el-col :span="9">
                              <!-- 供应商 -->
                              <el-form-item label="供应商" label-position="right"
                                            prop="distributor_id" style="float:right">
                              <el-select  v-model="form.distributor_id" placeholder="请选择供应商">
                                  <el-option  v-for="item in distributorSelectList"
                                        :label="item.name_cn"
                                        :value="item.id" :key="item.id">
                                  </el-option>
                              </el-select>
                              <el-button @click="onDistributor" icon="el-icon-more"></el-button>
                              </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col>
                            <label class="label" style="float:left; width:80px;">商品清单 </label>
                            <div style="float:left; width:300px; padding-top:20px">
                                <el-button size="mini" @click="showDialog" type="primary" plain>选择商品规格 <i class="el-icon-more el-icon--right"></i> </el-button>
                                <span class="sub-title">带*为必填项</span>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col>
                              <el-table :data="specList" empty-text="请选择商品规格">
                                        <el-table-column  type="index"
                                                          label="#" fixed>
                                        </el-table-column>
                                        <el-table-column label="商品规格名称" prop="product_name" width="200px" fixed></el-table-column>
                                        <el-table-column label="SKU" prop="relevance_code" width="150px"></el-table-column>
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
                                        <el-table-column label="进货价格（元）"
                                                        min-width="80px">
                                                          <template slot-scope="scope">
                                                                    <el-input size="mini"
                                                                              v-model="scope.row.purchase_price">
                                                                    </el-input>
                                                          </template>
                                        </el-table-column>
                                        <el-table-column :label="$t('remarks')">
                                                        <template slot-scope="scope">
                                                                  <el-input size="mini" v-model="scope.row.remark"></el-input>
                                                        </template>
                                        </el-table-column>
                                        <el-table-column min-width="60px">
                                          <template slot-scope="scope">
                                              <el-tooltip content="删除" placement="top">
                                                <el-button  size="mini" icon="el-icon-delete"
                                                                 @click="removeGoods(scope.$index)"
                                                                 type="danger" round>
                                                </el-button>
                                              </el-tooltip>
                                          </template>
                                        </el-table-column>
                              </el-table>
                          </el-col>
                        </el-row>
                              <!-- 运输方式 -->
                              <label class="label"> {{$t('notNecessaryInfo')}} </label>
                              <el-row>
                                <el-col>
                                  <el-form-item :label="$t('planInboundTime')">
                                            <el-row>
                                              <el-col :span="12"
                                                      style="padding:0;">
                                                      <el-date-picker v-model="startDate"
                                                                      type="date"
                                                                      :placeholder="$t('startDate')"
                                                                      :picker-options="pickerOptions"
                                                                      value-format="yyyy-MM-dd"
                                                                      size="small">
                                                      </el-date-picker>
                                              </el-col>
                                              <el-col  :span="5"  :offset="1">
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
                                              </el-row>
                                              <el-row>
                                              <el-col  :span="12">
                                                       <el-date-picker  v-model="endDate"
                                                                        type="date"
                                                                        :placeholder="$t('endDate')"
                                                                        :picker-options="pickerOptions"
                                                                        value-format="yyyy-MM-dd"
                                                                       size="small">
                                                       </el-date-picker>
                                              </el-col>
                                              <el-col :span="5"  :offset="1">
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
                                            </el-row>
                                    </el-form-item>
                                  </el-col>
                              </el-row>
                              <el-row :gutter="20">
                                <el-col>
                                  <el-form-item :label="$t('remarks')" >
                                          <el-input v-model="form.remark"
                                                    type="textarea"
                                                    placeholder="最多不超过30个字"
                                                    :maxlength="30">
                                          </el-input>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-form-item style="padding-left:100px;" >
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
                <select-spec-dialog :visible.sync="dialogSpecShow" :warehouseId.sync="warehouseId" @selected="onSpecSelected"></select-spec-dialog>
                <!-- 供应商管理弹窗 -->
                <el-dialog  title="供应商管理"
                            :visible.sync="distributorListShow"
                            width="80%">
                            <div class="distributor_main">
                                  <div  :class="$style.distributorUtil">
                                        <el-button  @click="addDistributor"
                                                    size="large">
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
                                                                        size="small"
                                                                        >
                                                                        {{$t('edit')}}
                                                            </el-button>
                                                            <!-- 删除 -->
                                                            <el-button  @click="distributorDelete(scope.row.id)"
                                                                        type="danger"
                                                                        size="small"
                                                                        plain>
                                                                        {{$t('delete')}}
                                                            </el-button>
                                                  </template>
                                            </el-table-column>
                                  </el-table>
                                  <el-pagination  style="margin: 10px 0 0 0; float: right;"
                                                  @current-change="distributorchange"
                                                  :current-page="distributor.page"
                                                  :page-size="distributor.size"
                                                  layout="total, prev, pager, next, jumper"
                                                  :total="+distributor.total">
                                  </el-pagination>
                            </div>
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
                                  <el-button  @click="cancelDistributor">
                                              {{$t('cancel')}}
                                  </el-button>
                                  <el-button  type="primary"
                                              @click="onDistributorSave">
                                              {{$t('submit')}}
                                  </el-button>
                            </span>
                </el-dialog>
          </div>
</template>

<script>
import inputPublic from '@/components/input-public';
import MdoelForm from '@/components/form';
import getListData from '@/mixin/list';
import mixin from '@/mixin/form_config';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import MyGroup from '@/components/my_group';
import { OnlyLetterAndNumber } from '@/lib/validateForm';
import selectSpecDialog from '@/components/dialog/selectSpec';

export default {
  components: {
    MdoelForm,
    MyGroup,
    buttonPagination,
    inputPublic,
    selectSpecDialog,
  },
  mixins: [getListData, mixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - (3600 * 1000 * 24));
        },
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
      batchTypeList: [], // 入库单分类
      specList: [], // 选中货品列表
      dialogSpecShow: false, // 待入库货品弹出框
      distributorList: [], // 供应商列表
      distributorListShow: false, // 供应商列表对话框
      distributorEditShow: false, // 供应商编辑对话框
      isDistributorEdit: false, // 供应商编辑还是新增
      distributorInfo: {},
      distributorParams: {},
      // 以下重写
      distributor: {},
      distributorSelectList: [], // 供应商列表
    };
  },
  created() {
    this.getBatchTypeList(); // 获取入库单分类
    this.getDistributorList(); // 获取供应商列表
    this.queryAllDistributor(); // 不带分页的所有供应商
    this.getBatchCode();
  },
  computed: {
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
    getBatchCode() {
      // 获取批次号)
      $http.getBatchCode({ warehouse_id: this.warehouseId })
        .then((res) => {
          this.form.confirmation_number = res.data.batch_code;
        });
    },
    queryAllDistributor() {
      $http.queryDistributor({ all: 1 }).then((res) => {
        this.distributorSelectList = res.data;
      });
    }, // 远程搜索供应商
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
        this.distributor.total = res.data.total;
        this.distributor.currentPage = res.data.current_page;
        this.distributor.size = res.data.per_page;
      });
    }, // 供应商列表
    handleSelectionChange(val) {
      this.goodsSelected = val;
    }, // 处理选择商品弹框的选择事件
    distributorchange(val) {
      $http.checkDistributor({ page: val })
        .then((res) => {
          this.distributorList = res.data.data;
          this.distributor.total = res.data.total;
          this.distributor.currentPage = res.data.current_page;
          this.distributor.size = res.data.per_page;
        });
    }, // 供应商分页
    // 待入库货品弹出框
    showDialog() {
      this.dialogSpecShow = true;
    },
    onSpecSelected(data) {
      console.log('选中的数据', data);
      for (let i = 0; i < data.length; i += 1) {
        let found = false;
        for (let j = 0; j < this.specList.length; j += 1) {
          if (data[i].id === this.specList[j].id) {
            found = true;
            console.log('存在数据', data[i]);
            break;
          }
        }
        if (!found) {
          this.specList.push(data[i]);
        }
      }
    },
    // 删除已选择货品
    removeGoods(index) {
      this.specList.splice(index, 1);
    },
    // 入库单提交
    onSave(formName) {
      this.items = [];
      // eslint-disable-next-line
      for (const item of this.specList) {
        this.items.push({
          // id: item.product_id,
          spec_id: item.id,
          relevance_code: item.relevance_code,
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
            this.getDistributorList(); // 刷新弹窗的供应商列表
            this.queryAllDistributor(); // 刷新搜索框的供应商列表
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
.header {
  margin: 0 0 10px 0;
}
.noborder .el-input__inner {
    border-radius:0px;
    border-top:0px;
    border-left:0px;
    border-right:0px;
    background-color: red;
}
</style>
<style lang="less" scoped>
 .distributor_main {
   margin: 20px 0 40px 0;
 }
</style>
