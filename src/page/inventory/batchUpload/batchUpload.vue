<template>
  <div class="path">
    <div class="domestic-batch-uploading" style="min-height: auto;">
      <div class="model-download">
        <div class="batch-icon">1</div>
        <div class="model-text">
          <div class="model-content">下载模板</div>
        </div>
      </div>

      <div class="domestic-batch-uploading-model">
        <div @click="downloadTemplate(templateList.url)" class="model-div">
          <div class="model-div-icon">
            <img src="../../../assets/img/excel-(1).png" />
          </div>
          <div class="model-div-content">
            标准模板
          </div>
        </div>
        <div class="update-time">模板更新时间：{{ templateList.date }}</div>
      </div>
    </div>
    <div class="domestic-batch-uploading">
      <div class="model-uploading">
        <div class="model-download">
          <div class="batch-icon">2</div>
          <div class="uploading-buttton">
            <el-upload
              class="upload-demo"
              :action="baseUrlUpload"
              :on-success="uploadExcelSuccess"
              :on-error="uploadError"
              :on-progress="uploadProgress"
              :headers="TOKEN"
            >
              <el-button icon="el-icon-upload2" style="width: auto">
                上传模板
              </el-button>
            </el-upload>
          </div>
          <div class="uploading-plan">
            <div class="progress" v-show="progress">
              <el-progress :percentage="progress"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <template v-if="!!gridData.length">
        <el-table :data="excel_data_paging" style="width: 100%">
          <el-table-column label="操作" min-width="60">
            <template slot-scope="scope">
              <el-button
                style="width: 40px;"
                @click="deleteFun(scope.row, scope.$index)"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.relevance_code">
              <span slot="content">{{ row.relevance_code }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="EAN" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.ean">
              <span slot="content">{{ row.ean }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="货位编码" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.location_code">
              <span slot="content">{{ row.location_code }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="进货价格" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.purchase_price">
              <span slot="content">{{ row.purchase_price }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="规格数量" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.need_num">
              <span slot="content">{{ row.need_num }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="生成批次号" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.production_batch_number">
              <span slot="content">{{ row.production_batch_number }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="最佳食用日期" min-width="250">
            <editable-cell
              slot-scope="{ row }"
              editable-component="el-date-picker"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="row.best_before_date"
            >
              <span slot="content">{{ row.best_before_date }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="保质期至" min-width="250">
            <editable-cell
              slot-scope="{ row }"
              editable-component="el-date-picker"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="row.expiration_date"
            >
              <span slot="content">{{ row.expiration_date }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="备注" min-width="180">
            <editable-cell slot-scope="{ row }" v-model="row.remark">
              <span slot="content">{{ row.remark }}</span>
            </editable-cell>
          </el-table-column>
        </el-table>
        <el-pagination
          class="paging"
          v-if="gridData.length"
          @current-change="page_no = $event"
          :current-page="page_no"
          :page-size="page_size"
          @size-change="page_size = $event"
          layout="prev, pager, next, sizes, total"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="gridData.length"
        >
        </el-pagination>
      </template>

      <div class="uploading-save">
        <div class="model-download">
          <div class="batch-icon">3</div>
          <el-button type="primary" @click="batchValidatePackage" :disabled="!gridData.length">
            检查
          </el-button>
        </div>
      </div>
      <div class="uploading-save">
        <div class="model-download">
          <el-row style="width: 100%">
            <el-col :span="1">
              <div class="batch-icon" style="margin-top: 10px;">4</div>
            </el-col>
            <el-col :span="23">
              <el-form :model="form" inline label-width="80px" style="text-align: left;">
                <el-form-item
                  :label="$t('Numbers')"
                  label-position="right"
                  prop="confirmation_number"
                  class="noborder"
                >
                  <el-input v-model="form.confirmation_number" prefix-icon="el-icon-tickets">
                    <el-button
                      slot="append"
                      @click="getBatchCode"
                      style="width:30;"
                      icon="el-icon-refresh"
                    ></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('category')" label-position="right" prop="type_id">
                  <el-select v-model="form.type_id">
                    <el-option
                      v-for="item in batchTypeList"
                      :label="item.name"
                      :disabled="item.is_enabled === 0"
                      :value="item.id"
                      :key="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('supplier')" label-position="right" prop="distributor_id">
                  <el-select v-model="form.distributor_id" :placeholder="$t('Pleseselectsupplier')">
                    <el-option
                      v-for="item in distributorSelectList"
                      :label="item.name_cn"
                      :value="item.id"
                      :key="item.id"
                    >
                    </el-option>
                  </el-select>
                  <el-button @click="onDistributor" icon="el-icon-more"></el-button>
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item :label="$t('remark')">
                      <el-input
                        v-model="form.remark"
                        style="width: 500px;"
                        type="textarea"
                        :rows="5"
                        :placeholder="$t('TheFieldmaynotbegreaterthan30characters')"
                        :maxlength="30"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <el-button
          type="primary"
          :loading="submit_loading"
          @click="batchSubmitData"
          :disabled="!is_done"
          >确认提交</el-button
        >
      </div>
    </div>
    <el-dialog
      :visible.sync="validate_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-progress
        type="circle"
        :percentage="
          +(
            ((validate_result.success + validate_result.error) / validate_result.total) *
            100
          ).toFixed(2)
        "
      ></el-progress>
      <p style="margin-top: 1rem;">
        {{ $t('success') }}{{ validate_result.success }}，失败 {{ validate_result.error }}，剩余
        {{ validate_result.total - (validate_result.success + validate_result.error) }}
      </p>
      <p style="margin-top: 1rem;">
        <el-button @click="(validate_dialog = false), (validate_queue = false)">关闭</el-button>
      </p>
    </el-dialog>
    <el-dialog
      :visible.sync="submit_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-progress
        type="circle"
        :percentage="
          +(((submit_data_total - submit_data.length) / submit_data_total) * 100).toFixed(2)
        "
      ></el-progress>
      <p style="margin-top: 1rem;">{{ $t('actiovate.Submitting') }}<span class="dot">...</span></p>
      <p style="margin-top: 1rem;">
        {{ $t('success') }}{{ submit_data_total - submit_data.length }}，{{ $t('Remaining')
        }}{{ submit_data.length }}
      </p>
    </el-dialog>
    <el-dialog
      :title="$t('distributorManagement')"
      :visible.sync="distributorListShow"
      @close="handlerDistributorListClose"
      width="80%"
    >
      <div class="distributor_main">
        <div :class="$style.distributorUtil">
          <el-button @click="addDistributor" size="large">
            {{ $t('add') }}
          </el-button>
        </div>
        <el-table :data="distributorList" border style="width: 100%">
          <el-table-column type="index" width="60" header-align="center" align="center">
          </el-table-column>
          <el-table-column
            prop="name_cn"
            :label="$t('distributorName')"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column :label="$t('operation')" width="200" header-align="center">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button @click="distributorEdit(scope.row)" size="small">
                {{ $t('edit') }}
              </el-button>
              <!-- 删除 -->
              <el-button @click="distributorDelete(scope.row.id)" type="danger" size="small" plain>
                {{ $t('delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin: 10px 0 0 0; float: right;"
          @current-change="distributorchange"
          :current-page="distributor.page"
          :page-size="distributor.size"
          layout="total, prev, pager, next, jumper"
          :total="+distributor.total"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="distributorEditShow" @close="cancelDistributor" width="40%">
      <el-row :gutter="20" :class="$style.distributorEdit">
        <el-col :span="5">{{ $t('supplier') }}</el-col>
        <el-col :span="10">
          <el-input v-model="distributorInfo.name_cn"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDistributor">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="onDistributorSave">
          {{ $t('submit') }}
        </el-button>
      </span>
    </el-dialog>
    <iframe src="" id="downloadIframe" style="display:none" width="0" height="0"></iframe>
  </div>
</template>
<script>
import Vue from 'vue';
import { Progress } from 'element-ui';
import port from '@/api';
import baseApi from '@/lib/axios/base_api';
import EditableCell from '@/components/editable_cell.vue';
Vue.use(Progress);
// let _uid = 1; // 生成包裹唯一id
const UID = Symbol('uid'); // uid的key
// const IS_NEED_IDCORD_PIC = Symbol('need_idcard_pic'); // 是否需要上传身份证的标识名
// const REPEATED_IDCARD_DATA = Symbol('repeat_idcard_data'); // idcard重复的数据存放的字段
const CONCURRENCY_NUMBER = 5; // 队列并发数
export default {
  components: {
    EditableCell
  },
  data() {
    return {
      excel_data: [], // excel数据
      excel_header: [], // excel 表头数据
      type_name: '', // excel 类型
      page_no: 1,
      page_size: 10,
      pre_submit_data: [],
      submit_data: [], // 提交检查的列表
      submit_data_total: 1, // 待提交列表总数
      submit_dialog: false, // 提交弹窗
      excel_name: this.$t('ToBeUploaded'),
      progress: 0, // 上传execel的进度
      submit_loading: false,
      templateList: [], // execel模板列表
      cur_template: 0,
      validate_dialog: false, // 检查进度弹窗
      validate_result: {
        // 检查结果统计
        success: 0,
        error: 0,
        total: 1
      },
      validate_queue: [], // 检查任务队列
      is_cancel: false, // 是否中途取消检查
      is_scroll: false, // 是否滚到到错误地点
      gridData: [],
      form: {
        distributor_id: '',
        type_id: '',
        confirmation_number: ''
      },
      batchTypeList: [], // 入库单分类
      distributorSelectList: [], // 供应商列表
      distributorList: [], // 供应商列表
      distributorListShow: false, // 供应商列表对话框
      distributorEditShow: false, // 供应商编辑对话框
      isDistributorEdit: false, // 供应商编辑还是新增
      distributorInfo: {},
      distributorParams: {},
      distributor: {
        page: 0
      }
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    excel_data_paging() {
      // 分页的excel列表数据
      if (!this.gridData.length) return [];
      const no = this.page_no;
      const size = this.page_size;
      return this.gridData.slice((no - 1) * size, no * size);
    },
    TOKEN() {
      return {
        warehouse: this.warehouseId,
        Authorization: this.$store.state.token.token
      };
    },
    baseUrlCheck() {
      return `${baseApi.BASE_URL}specs/stocks/check`;
    },
    baseUrlUpload() {
      return `${baseApi.BASE_URL}specs/stocks/upload`;
    },
    is_started() {
      // 是否开始上传
      return !!this.excel_data.length;
    },
    is_validate_success() {
      return this.validate_result.success === this.validate_result.total;
    },
    is_done() {
      // 是否全部完成
      return this.gridData.length && this.is_validate_success;
    }
  },
  created() {
    this.getTemplate();

    this.getBatchTypeList(); // 获取入库单分类
    this.getDistributorList(); // 获取供应商列表
    this.queryAllDistributor(); // 不带分页的所有供应商
    this.getBatchCode();
  },
  methods: {
    getDistributorList() {
      port.getDistributor().then(res => {
        this.distributorList = res.data.data;
        this.distributor.total = res.data.total;
        this.distributor.page = res.data.current_page;
        this.distributor.size = res.data.per_page;
      });
    }, // 供应商列表
    getBatchCode() {
      port
        .getBatchCode({
          warehouse_id: this.warehouseId
        })
        .then(res => {
          this.form.confirmation_number = res.data.batch_code;
        });
    }, // 获取批次号
    onDistributor() {
      this.distributorListShow = true;
      this.getDistributorList();
    }, // 供应商管理弹出框

    handlerDistributorListClose() {
      this.queryAllDistributor();
      for (let i = 0; i < this.distributorSelectList.length; i += 1) {
        if (this.distributorSelectList[i].id === this.form.distributor_id) {
          this.form.distributor_id = this.distributorSelectList[i].id;
        }
      }
    },
    queryAllDistributor() {
      port.queryDistributor({ all: 1 }).then(res => {
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
        is_enabled: 1
      };
      port.getBatchType(typeParams).then(res => {
        this.batchTypeList = res.data.data;
      });
    }, // 拉取入库分类列表
    deleteFun(row, index) {
      this.gridData.splice((this.page_no - 1) * this.page_size + index, 1);
      this.validate_result.total = this.gridData.length;
    },
    // 获得模板
    getTemplate() {
      port.getSpecsTemplate().then(res => {
        this.templateList = res.data;
      });
    },
    // 下载模板
    downloadTemplate(url) {
      document.getElementById('downloadIframe').src = url;
    },
    // 获取上传时的url
    uploadExcelSuccess(res) {
      if (!res.status) {
        this.resetDate();
        this.gridData = res.data;
        // this.excel_header = res.data.excel_header;
        this.type_name = res.data.type_name;
        this.$notify({
          title: '上传成功',
          message: res.msg,
          type: 'success'
        });
      } else {
        this.uploadError(res);
      }
    },
    // 上传Excel进度条
    uploadProgress(e, file) {
      this.excel_name = file.name;
      this.progress = +e.percent.toFixed(2);
    },
    // 上传EXCEL失败
    uploadError(res) {
      this.resetDate();
      this.excel_name = this.$t('FailedToUpload');
      this.$notify({
        title: '上传失败',
        message: res.msg,
        type: 'error'
      });
    },
    // 重新上传,重置数据
    resetDate() {
      this.excel_data = [];
      this.excel_header = [];
      this.type_name = '';
      this.resetPackageNumber();
      this.pre_submit_data = [];
      this.progress = 0;
    },
    // 用户修改错误
    changeTd(index, i, value) {
      const status = this.excel_data[index].status;
      this.modifyPackageNumber(status, -1);
      this.deteleSubmitData(index);
      this.excel_data[index].status = 'warning';
      this.$set(this.excel_data[index], i, value);
    },
    // 用户删除行
    deleteTr(index) {
      const status = this.excel_data[index].status;
      this.modifyPackageNumber(status, -1);
      this.deteleSubmitData(index);
      this.excel_data.splice(index, 1);
      const len = this.excel_data.length;
      if (!len) this.resetDate();
      this.validate_result.total = len;
    },
    // 修改已成功的包裹,需要从待提交包裹列表删除
    deteleSubmitData(index) {
      const tr = this.excel_data[index];
      if (!tr[UID]) return;
      this.pre_submit_data.forEach((item, index) => {
        if (item && item[UID] === tr[UID]) {
          this.$set(this.pre_submit_data, index, undefined);
        }
      });
    },
    // 修改各个状态包裹数量
    modifyPackageNumber(status, step) {
      if (!/success|error/.test(status)) return;
      this.validate_result[status] += step;
    },
    // 重置各个状态包裹数量
    resetPackageNumber() {
      for (const status in this.validate_result) {
        this.validate_result[status] = 0;
      }
      this.validate_result.total = 1;
    },
    // 批量检查包裹
    batchValidatePackage() {
      this.validate_dialog = true;
      this.resetPackageNumber();
      this.validate_result.total = this.gridData.length;
      this.validate_queue = this.gridData.map((item, index) => () =>
        this.validatePackage(
          {
            // 列表数据转化为处理数据的任务队列
            type_name: this.type_name,
            excel_header: this.excel_header,
            excel_data: item
          },
          index
        ).then(result => this.modifyPackageNumber(result ? 'success' : 'error', 1))
      );
    },
    // 检查包裹
    async validatePackage(data) {
      let res;
      try {
        res = await port.checkSpecsTemplate(data.excel_data);
      } catch (e) {
        res = e;
      }
      const status = res ? res && res.status === 0 : false;
      this.$set(this.pre_submit_data, data.excel_data[UID], res.data);
      return status;
    },
    // 重置列表,取消错误提示,准备再次检查
    resetError(data) {
      data.excel_data.forEach((item, ii) => {
        if (typeof item !== 'object') return;
        data.excel_data[ii] = item.value;
      });
    },
    // 批量提交订单
    async batchSubmitData() {
      if (!this.form.type_id) {
        this.$message.error('请输入分类');
        return;
      }
      if (!this.form.distributor_id) {
        this.$message.error('请选择供应商');
        return;
      }
      this.submit_loading = true;
      var res;
      try {
        res = await port.importSpecsTemplate({ ...this.form, product_stock: this.gridData });
      } catch (e) {
        // this.$notify({
        //   title: this.$t('addFailure'),
        //   message: `添加失败`,
        //   type: 'error',
        //   duration: 0
        // });
      }
      this.submit_loading = false;
      if (res.status == 0) {
        this.$notify({
          title: this.$t('success'),
          message: '成功提交',
          type: 'success'
        });
        this.$router.push({ name: 'inboundList' });
      }
    },
    // 处理任务队列
    handlerQueue() {
      if (!this.validate_queue.length && this.validate_result.success == this.gridData.length) {
        // 任务队列为空则完成
        this.validate_dialog = false;
        return;
      }
      const callback = this.validate_queue.shift();
      callback().then(this.handlerQueue);
    },

    onDistributorSave() {
      this.distributorParams = {
        name_cn: this.distributorInfo.name_cn,
        name_en: this.distributorInfo.name_en
      };
      if (this.isDistributorEdit) {
        port.editDistributor(this.distributorInfo.id, this.distributorParams).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.distributorchange(this.distributor.page); // 刷新弹窗的供应商列表
          this.distributorEditShow = false;
        });
      } else {
        port.addDistributor(this.distributorParams).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.distributorchange(this.distributor.page); // 刷新弹窗的供应商列表
          this.queryAllDistributor(); // 刷新搜索框的供应商列表
          this.distributorEditShow = false;
        });
      }
    }, // 保存供应商
    distributorchange(val) {
      port.checkDistributor({ page: val }).then(res => {
        this.distributorList = res.data.data;
        this.distributor.total = res.data.total;
        this.distributor.page = res.data.current_page;
        this.distributor.size = res.data.per_page;
      });
    }, // 供应商分页
    addDistributor() {
      this.distributorEditShow = true;
      this.isDistributorEdit = false;
    }, // 新增供应商弹出框
    distributorEdit(row) {
      this.distributorEditShow = true;
      this.isDistributorEdit = true;
      this.distributorInfo = Object.assign({}, row);
    }, // 编辑供应商弹出框
    cancelDistributor() {
      this.distributorEditShow = false;
      this.distributorInfo.name_en = '';
      this.distributorInfo.name_cn = '';
    }, // 取消新增供应商
    distributorDelete(id) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        port.deleteDistributor(id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.distributorchange(this.distributor.page);
        });
      });
    } // 删除供应商
  },
  watch: {
    'validate_queue.length'(newValue, oldValue) {
      if (oldValue || !newValue) return; // 只在添加新任务的时候触发
      const cbArr = this.validate_queue.splice(0, CONCURRENCY_NUMBER);
      cbArr.forEach(cb => {
        cb().then(this.handlerQueue);
      });
    },
    is_cancel(newValue) {
      if (!newValue) return;
      this.validate_queue = [];
    }
  },
  filters: {
    validate_status(status) {
      if (status === 'success') {
        return '成功';
      } else if (status === 'error') {
        return '失败';
      } else {
        return '待检查';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.path {
  width: 100%;
  margin: 20px auto;
  text-align: center;
}
.batch-icon {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: #98d1ff;
  font-weight: 400;
  color: #fff;
  margin-right: 1rem;
}

.domestic-batch-uploading {
  min-height: 500px;
  background: #fff;
  border: 1px solid #fff;
  margin-top: -1px;
  padding: 30px;
  .model-download {
    display: flex;
    flex-direction: row;
    align-items: center;
    .model-text {
      display: flex;
      flex-direction: row;
      align-items: center;
      .model-title {
        font-size: 1rem;
        color: #010101;
        font-weight: 600;
      }
      .model-content {
        line-height: 26px;
        margin-left: 15px;
      }
    }
  }

  .domestic-batch-uploading-model {
    margin-top: 20px;
    margin-left: 30px;
    display: flex;
    .model-div {
      position: relative;
      display: flex;
      margin-right: 20px;
      border: 1px solid #d2d2d2;
      padding: 10px 20px;
      cursor: pointer;
      .model-div-icon {
        width: 35px;
        text-align: right;
      }
      .model-div-content {
        text-indent: 5px;
        line-height: 30px;
      }
      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-width: 10px;
        right: -3px;
        bottom: -4px;
        border-style: solid;
        border-color: #fff #fff #fff #fff;
        transform: rotate(-40deg);
      }
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-width: 10px;
        right: 3px;
        bottom: 3px;
        border-style: solid;
        border-color: transparent transparent #d2d2d2 transparent;
        transform: rotate(-40deg);
      }
      &.cur-template {
        border-color: #390;
        &:after {
          border-color: transparent transparent #390 transparent;
        }
      }
    }
  }

  .model-uploading {
    @extend .model-download;
    .uploading-plan {
      margin: 0 40px;
      height: 28px;
      display: flex;
      padding: 5px;
      .uploading-img {
        margin-top: 1px;
      }
      p {
        line-height: 30px;
        margin-left: 5px;
        margin-right: 20px;
      }
      .progress {
        margin-top: 6px;
        margin-right: 5px;
        width: 200px;
      }
    }
  }

  .uploading-table {
    margin-left: 30px;
    margin-top: 30px;
    overflow-x: scroll;
    overflow-y: hidden;
    table {
      white-space: nowrap;
      border-collapse: collapse;
      position: relative;
      tr {
        position: relative;
      }
      th {
        background-color: #375623;
        color: #fff;
        font-weight: normal;
        font-size: 16px;
        padding: 0.2em 0.5em;
      }
      th,
      td {
        min-width: 0;
        overflow: hidden;
        min-height: 34px;
        margin: 1px;
      }
      td {
        // padding-right: 35px;
      }
      .el-icon-circle-cross {
        cursor: pointer;
      }
    }
  }
  .uploading-save {
    @extend .model-download;
    margin-top: 50px;
  }
  .error {
    position: relative;
    border: 1px solid #ff4949;
    display: flex;
    justify-content: center;
    .el-icon-information {
      color: #ff4949;
    }
  }
}
.update-time {
  padding: 10px 20px;
  background: #fff1ca;
  line-height: 1.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: red;
  }
}
.dot {
  overflow: hidden;
  height: 1em;
  display: inline-block;
  &:before {
    content: '...\A..\A.';
    white-space: pre-wrap;
    display: block;
    line-height: 1;
    text-align: left;
    animation: dot 1s infinite step-end;
  }
  @keyframes dot {
    33% {
      transform: translateY(-2em);
    }
    66% {
      transform: translateY(-1em);
    }
  }
}
.idcard-upload-tip {
  margin-top: 30px;
  text-align: left;
  line-height: 1.8em;
}
</style>
<style lang="less">
.model-uploading {
  .el-upload-list {
    display: none;
  }
}

.uploading-table {
  th {
    span {
      display: block;
      font-size: 14px;
    }
  }
}
.no-submit-tips {
  text-align: left;
  margin: 10px 40px;
  a {
    // color: $topnav-bg;
  }
}
.upload-idcard {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 9.89rem;
    height: 6.89rem;
    &:hover {
      border-color: #20a0ff;
    }
    .idcard {
      width: 100%;
      height: 100%;
    }
    .el-upload__text {
      line-height: 6.89rem;
    }
  }
}
</style>

<style lang="less" module>
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
  line-height: 40px;
  height: 40px;
}
.header {
  margin: 0 0 10px 0;
}
.noborder .el-input__inner {
  border-radius: 0px;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  background-color: red;
}
</style>
<style lang="less" scoped>
.distributor_main {
  margin: 20px 0 40px 0;
}
</style>
