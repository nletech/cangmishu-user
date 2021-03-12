<template>
  <div class="path">
    <!-- <side-achieve :type="2" :batch="true"></side-achieve> -->
    <div class="domestic-batch-uploading" style="min-height: auto;">
      <div class="model-download">
        <div class="batch-icon">1</div>
        <div class="model-text">
          <div class="model-title">{{ $t('BatchDownloading.DownloadTheTemplate') }}</div>

          <div class="model-content">
            {{ $t('BatchDownloading.TemplateContent') }}
          </div>
        </div>
      </div>

      <div class="domestic-batch-uploading-model">
        <!-- v-for="(item, index) in templateList" -->
        <div @click="downloadTemplate(templateList.url)" class="model-div">
          <!-- @mouseover="cur_template = index" -->
          <!-- :class="cur_template === index && 'cur-template'" -->
          <div class="model-div-icon">
            <img src="../../../assets/img/excel-(1).png" />
          </div>
          <div class="model-div-content">
            标准模板
          </div>
        </div>
        <div class="update-time">
          模板更新时间：{{ templateList.date }}
          <!-- {{ $t('BatchDownloading.TemplateUploadTime') }} -->
        </div>
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
              <el-button icon="el-icon-upload2" style="width: auto">{{
                $t('BatchDownloading.UploadOrderForm')
              }}</el-button>
            </el-upload>
          </div>
          <div class="uploading-plan">
            <div class="uploading-img">
              <img src="../../../assets/img/excel-(1).png" />
            </div>

            <p>{{ excel_name }}</p>
            <div class="progress" v-show="progress">
              <el-progress :percentage="progress"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <template v-if="is_started">
        <div class="uploading-table" ref="tableBox">
          <table border="1">
            <thead>
              <th>{{ $t('ConfirmParcel.Operation') }}</th>
              <th>{{ $t('Balances.Status') }}</th>
              <th
                v-for="(head, index) in excel_header"
                :key="index"
                v-html="head.replace('（下拉选择）', '')"
              ></th>
            </thead>
            <tbody ref="tableBody">
              <tr v-for="(items, ii) in excel_data_paging" :key="ii">
                <td style="padding-right: 0;">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">{{ $t('ConfirmParcel.Delete') }}</div>
                    <i
                      class="el-icon-circle-close"
                      @click="deleteTr((page_no - 1) * page_size + ii)"
                    ></i>
                  </el-tooltip>
                </td>
                <td style="padding-right: 0;">{{ items.status | validate_status }}</td>
                <td v-for="(item, i) in items" :key="i" :class="{ error: !item.substr }">
                  <editable-div
                    class="editable-div"
                    :value="!item.substr ? item.value : item"
                    @change="changeTd((page_no - 1) * page_size + ii, i, $event)"
                  ></editable-div>
                  <el-tooltip effect="dark" v-if="!item.substr" placement="top-start">
                    <div
                      slot="content"
                      style="line-height: 1.8;"
                      v-for="(tip, index) in item.tips"
                      :key="tip"
                    >
                      <span v-if="item.tips.length - 1">{{ index + 1 }}. </span>{{ tip }}
                    </div>
                    <i class="el-icon-warning el-input__icon"></i>
                  </el-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <el-pagination
          class="paging"
          v-if="excel_data.length"
          @current-change="page_no = $event"
          :current-page="page_no"
          :page-size="page_size"
          @size-change="page_size = $event"
          layout="prev, pager, next, sizes, total"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="excel_data.length"
        >
        </el-pagination>
      </template>

      <div class="uploading-save">
        <div class="model-download">
          <div class="batch-icon">3</div>
          <el-button
            type="primary"
            @click="batchValidatePackage"
            :disabled="!is_started || is_validate_success"
            >{{ $t('Check') }}</el-button
          >
        </div>
      </div>
      <template v-if="need_idcard_data.length">
        <div class="model-uploading uploading-save">
          <div class="model-download">
            <div class="batch-icon">4</div>
            <!-- <el-button type="primary" @click="batchValidatePackage" :disabled="false"></el-button> -->
            <div class="model-text">
              <div class="model-title">{{ $t('AddClaim.UploadId') }}</div>
              <div class="model-content">
                <p>{{ $t('AddClaim.CustomsRegulations') }}</p>
              </div>
            </div>
          </div>
        </div>
        <el-row>
          <el-col :md="15" :sm="24">
            <el-table class="uploading-table" border :data="need_idcard_data">
              <el-table-column type="index"> </el-table-column>
              <el-table-column :label="$t('Reserve.name')">
                <template slot-scope="scope">
                  {{ scope.row.receiver.fullname }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('Settings.ID')">
                <template slot-scope="scope">
                  {{ scope.row.receiver.idcard }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('AddClaim.UploadId')">
                <template slot-scope="scope">
                  <el-upload
                    class="upload-idcard"
                    :headers="TOKEN"
                    :show-file-list="false"
                    :on-success="uploadIdcardSuccess(scope.row, 'id_card_front')"
                    :before-upload="beforeUploadIdcard"
                    :action="baseUrl"
                  >
                    <img
                      v-if="scope.row.receiver.id_card_front"
                      :src="scope.row.receiver.id_card_front"
                      class="idcard"
                    />
                    <div v-else class="el-upload__text">{{ $t('Settings.IDFront') }}</div>
                  </el-upload>
                  <el-upload
                    class="upload-idcard"
                    :show-file-list="false"
                    :headers="TOKEN"
                    :on-success="uploadIdcardSuccess(scope.row, 'id_card_back')"
                    :before-upload="beforeUploadIdcard"
                    :action="baseUrl"
                  >
                    <label class="el-upload-list__item-status-label"
                      ><i class="el-icon-upload-success el-icon-check"></i
                    ></label>
                    <img
                      v-if="scope.row.receiver.id_card_back"
                      :src="scope.row.receiver.id_card_back"
                      class="idcard"
                    />
                    <div v-else class="el-upload__text">{{ $t('Settings.IDRear') }}</div>
                  </el-upload>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :offset="1" :md="8" :sm="24" class="idcard-upload-tip">
            {{ $t('AddClaim.UploadInstructions') }}：
            <ul>
              <li>1、{{ $t('AddClaim.PleaseUseSecondGenerationIDCard') }}</li>
              <li>2、{{ $t('AddClaim.PhotoSupportJPGPNG') }}</li>
              <li>3、{{ $t('AddClaim.PromiseInfoProtected') }}</li>
            </ul>
          </el-col>
        </el-row>
      </template>
      <div class="uploading-save">
        <div class="model-download">
          <div class="batch-icon">{{ need_idcard_data.length ? 5 : 4 }}</div>
          <el-button
            type="primary"
            :loading="submit_loading"
            @click="batchSubmitData"
            :disabled="!is_done"
            >{{ $t('actiovate.ConfirmSubmit') }}</el-button
          >
        </div>
      </div>
      <!-- <div class="no-submit-tips">
        <shopping-cart></shopping-cart>
      </div> -->
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
        {{ is_cancel ? $t('Cancelling') : $t('Checking') }}<span class="dot">...</span>
      </p>
      <p style="margin-top: 1rem;">
        {{ $t('success') }}{{ validate_result.success }}，{{ $t('Failure')
        }}{{ validate_result.error }}，{{ $t('Remaining')
        }}{{ validate_result.total - (validate_result.success + validate_result.error) }}
      </p>
      <p style="margin-top: 1rem;">
        <el-button :loading="is_cancel" @click="is_cancel = true">{{
          $t('ReservationDetails.cancel')
        }}</el-button>
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
    <iframe src="" id="downloadIframe" style="display:none" width="0" height="0"></iframe>
  </div>
</template>
<script>
import Vue from 'vue';
import { Progress } from 'element-ui';
// import SideAchieve from '@/components/step_achieve.vue';
import port from '@/api';
import baseApi from '@/lib/axios/base_api';
// import { NLE } from '@/api/constant';
import EditableDiv from '@/components/editable_div.vue';
// import ShoppingCart from '../components/shopping_cart';
Vue.use(Progress);
let _uid = 1; // 生成包裹唯一id
const UID = Symbol('uid'); // uid的key
const IS_NEED_IDCORD_PIC = Symbol('need_idcard_pic'); // 是否需要上传身份证的标识名
const REPEATED_IDCARD_DATA = Symbol('repeat_idcard_data'); // idcard重复的数据存放的字段
const CONCURRENCY_NUMBER = 5; // 队列并发数
export default {
  components: {
    // SideAchieve,
    EditableDiv
    // ShoppingCart
  },
  data() {
    return {
      // baseUrl: baseApi,
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
      is_scroll: false // 是否滚到到错误地点
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    excel_data_paging() {
      // 分页的excel列表数据
      if (!this.is_started) return [];
      const no = this.page_no;
      const size = this.page_size;
      return this.excel_data.slice((no - 1) * size, no * size);
    },
    TOKEN() {
      return {
        warehouse: this.warehouseId,
        Authorization: this.$store.state.token.token
      };
    },
    baseUrl() {
      return `${baseApi.BASE_URL}specs/import`;
    },
    baseUrlCheck() {
      return `${baseApi.BASE_URL}specs/stocks/check`;
    },
    baseUrlUpload() {
      return `${baseApi.BASE_URL}specs/stocks/upload`;
    },
    need_idcard_data() {
      // 需要上传身份证的列表
      const result = [];
      const flag = {};
      // 将idcard重复的数据去重, 并保存一份引用在剩下的一份数据下面
      this.pre_submit_data.forEach(item => {
        if (!item || !item[IS_NEED_IDCORD_PIC]) return;
        const idcard = item.receiver.idcard;
        if (flag[idcard] !== undefined) {
          // 是否有重复idcard的数据
          const resultItem = result[flag[idcard]];
          resultItem[REPEATED_IDCARD_DATA] = {
            ...resultItem[REPEATED_IDCARD_DATA],
            [item[UID]]: item
          };
        } else {
          flag[idcard] = result.length;
          result.push(item);
        }
      });
      return result;
    },
    is_started() {
      // 是否开始上传
      return !!this.excel_data.length;
    },
    is_validate_success() {
      return this.validate_result.success === this.validate_result.total;
    },
    is_upload_idcard_done() {
      // 是否所有身份证都上传完成
      return this.need_idcard_data.every(item => {
        return item.receiver.id_card_front && item.receiver.id_card_back;
      });
    },
    is_done() {
      // 是否全部完成
      return (
        this.is_started &&
        this.is_validate_success &&
        (!this.need_idcard_data.length || this.is_upload_idcard_done)
      );
    }
  },
  created() {
    this.getTemplate();
  },
  methods: {
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
        this.excel_data = res.data;
        // this.excel_header = res.data.excel_header;
        this.type_name = res.data.type_name;
        this.$notify({
          title: this.$t('UploadedSuccessfully'),
          message: res.tips,
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
        title: this.$t('UploadFailed'),
        message: res.tips,
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
    // 根据后台报错信息提示错误
    markError(data, index) {
      if (!data) {
        // 如果没有报错信息则报未知错误
        this.addErrorTips(index, 0, '未知错误');
        return;
      }
      data.forEach(item => {
        this.addErrorTips(index, item.col, item.tips);
      });
    },
    // 为指定表格项添加错误提示
    addErrorTips(index, col, tips) {
      const value = this.excel_data[index][col];
      if (value.substr) {
        this.$set(this.excel_data[index], col, { tips: [tips], value });
      } else {
        value.tips.push(tips);
        this.$set(this.excel_data[index], col, { tips: value.tips, value: value.value });
      }
    },
    // 自动滚动到错误行
    scrollToError(index, col) {
      if (this.is_scroll) return;
      const row = index % this.page_size;
      if (!this.$refs.tableBody.children[row]) return;
      const el = this.$refs.tableBody.children[row].children[col];
      const tableBox = this.$refs.tableBox;
      tableBox.scrollTo(el.offsetLeft, el.offsetTop);
      this.is_scroll = true;
    },
    // 批量检查包裹
    batchValidatePackage() {
      this.validate_dialog = true;
      this.resetPackageNumber();
      this.validate_result.total = this.excel_data.length;
      this.is_scroll = false;
      this.validate_queue = this.excel_data.map((item, index) => () =>
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
    async validatePackage(data, index) {
      if (data.excel_data.status === 'success') return true;
      this.resetError(data);
      if (!data.excel_data[UID]) {
        // 标识行数据，排序用
        data.excel_data[UID] = _uid++;
      }
      let res;
      try {
        res = await port.validatePatchPackage(data);
      } catch (e) {
        res = e;
      }
      const status = res ? res.status : false;
      if (status) {
        data.excel_data.status = 'success';
        res.data[UID] = data.excel_data[UID]; // 标识提交数据，删除时用
        res.data[IS_NEED_IDCORD_PIC] = !!res.idcard_pic; // 标识需要上传身份证
        this.$set(this.pre_submit_data, data.excel_data[UID], res.data);
      } else {
        data.excel_data.status = 'error';
        this.markError(res && res.data, index);
        res && res.data[0] && this.scrollToError(index, res.data[0].col);
      }
      return status;
    },
    // 重置列表,取消错误提示,准备再次检查
    resetError(data) {
      data.excel_data.forEach((item, ii) => {
        if (typeof item !== 'object') return;
        data.excel_data[ii] = item.value;
      });
    },
    // 上传身份证图片前检查
    beforeUploadIdcard(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      // const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return false;
      }
      return true;
    },
    // 上传身份证完成
    uploadIdcardSuccess(item, key) {
      return res => {
        // 判断item下是否保存重复idcard数据的引用
        // 有的话通过引用设置重复idcard数据的url为相同的值
        if (item[REPEATED_IDCARD_DATA]) {
          Object.values(item[REPEATED_IDCARD_DATA]).forEach(i => {
            this.$set(i.receiver, key, res.data.url);
          });
        }
        this.$set(item.receiver, key, res.data.url);
      };
    },
    // 批量提交订单
    async batchSubmitData() {
      this.submit_loading = true;
      this.submit_dialog = true;
      this.submit_data = this.pre_submit_data.filter(f => f);
      this.submit_data_total = this.submit_data.length;
      while (this.submit_data.length) {
        const data = this.submit_data.splice(0, 10);
        while (data.length) {
          const item = data.shift();
          try {
            await port.addDomesticPackage(item);
          } catch (e) {
            this.$notify({
              title: this.$t('error'),
              message: `收件人为"${item.addressee.fullname}"的包裹添加失败`,
              type: 'error',
              duration: 0
            });
          }
        }
      }
      this.$notify({
        title: this.$t('success'),
        message: '成功提交全部包裹',
        type: 'success'
      });
      this.$router.push({
        name: 'domestic_order_confirm'
      });
      this.submit_dialog = false;
      this.submit_loading = false;
    },
    // 处理任务队列
    handlerQueue() {
      if (!this.validate_queue.length) {
        // 任务队列为空则完成
        this.validate_dialog = false;
        this.is_cancel = false;
        return;
      }
      const callback = this.validate_queue.shift();
      callback().then(this.handlerQueue);
    }
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
  width: 95%;
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
.el-button {
  width: 205px;
  height: 40px;
  font-size: 1rem;
}
.update-time {
  padding: 10px 20px;
  background: #fff1ca;
  line-height: 1.8em;
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
