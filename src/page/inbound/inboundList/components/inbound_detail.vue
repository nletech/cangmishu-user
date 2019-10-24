<template>
  <el-dialog  :title="$t('viewInboundList')"
              width="90%"
              @update:visible="$emit('update:visible', $event)"
              :visible="visible">
              <el-tabs
                @tab-click="handlerTabClick"
                v-model="activeName"
                stretch
                type="border-card">
                <el-tab-pane :label="$t('Inbound')" name="entry">
                    <div v-html="content" v-if="visible">
                    </div>
                    <el-row>
                        <el-col :span="2" :offset="11">
                            <el-button
                                :disabled="disable"
                                :loading="isButtonLoading()"
                                @click="handleDownload('entry')"
                                style="background-color: #5745c5;
                                color: #fff;">
                                {{$t('DownloadInbound')}}
                            </el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane :label="$t('PurchaseOrder')" name="purchase">
                    <div v-html="content" v-if="visible">
                    </div>
                    <el-row>
                        <el-col :span="2" :offset="11">
                            <el-button
                                :loading="isButtonLoading()"
                                :disabled="disable"
                                @click="handleDownload('purchase')"
                                style="background-color: #5745c5;
                                color: #fff;">
                                {{$t('DownloadPurchaseOrder')}}
                            </el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane :label="$t('Inboundbatchnumber')" name="batchno">
                    <div v-html="content" v-if="visible">
                    </div>
                    <el-row>
                        <el-col :span="2" :offset="11">
                            <el-tooltip :content="$t('printTips')" placement="top">
                                  <el-button
                                      :disabled="disable"
                                      :loading="isButtonLoading()"
                                      @click="handleDownload('batchno')"
                                      style="background-color: #5745c5;
                                      color: #fff;">
                                      {{$t('DondownLoadInboundbatchnumber')}}
                                  </el-button>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </el-tab-pane>
              </el-tabs>
  </el-dialog>
</template>

<script>
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  props: {
    visible: Boolean,
    id: Number,
  },
  mounted() {
    this.pdf = `${baseApi}/batch/7/download`;
  },
  data() {
    return {
      pdf: '',
      content: '',
      disable: false,
      activeName: 'entry',
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    api() {
      return this.$store.state.token.token.substring(7);
    },
  },
  watch: {
    warehouseId() {
      this.activeName = 'entry';
      this.getList('entry');
    },
    id: {
      handler() {
        this.activeName = 'entry';
        this.getList('entry');
      },
      deep: true,
    },
  },
  methods: {
    handlerTabClick(tab) {
      switch (+tab.index) {
        case 0: // 入库单
          this.getList('entry');
          return;
        case 1: // 采购单
          this.getList('purchase');
          return;
        case 2: // 入库批次号
          this.getList('batchno');
          // eslint-disable-next-line
          return;
        default:
          // eslint-disable-next-line
          return;
      }
    },
    getList(template) {
      if (!this.id || !this.warehouseId) return;
      $http.previewInbound(this.id, template).then((res) => {
        this.content = res;
      });
    },
    handleDownload(template) {
      window.open(`${baseApi}batch/${this.id}/download/${template}/?api_token=${this.api}&lang`);
      this.disable = true;
      const timer = setTimeout(() => {
        this.disable = false;
        clearTimeout(timer);
      }, 500);
    },
  },
};
</script>

<style module>
.content_box{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.download {
  margin-top: 50px;
}
.inboundimg {
  width: 300px;
  height: 60px;
}
</style>

<style lang="less" scoped>
@import '../../../../less/public_variable.less';

.inbound_info {
  padding-left: 20px;
}
</style>
