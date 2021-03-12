<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <el-dialog
    :title="$t('viewInboundList')"
    width="90%"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
  >
    <el-tabs @tab-click="handlerTabClick" v-model="activeName" stretch type="border-card">
      <el-tab-pane
        v-for="(item, id) of tabs"
        :key="id"
        :label="$t(`${item.label}`)"
        :name="item.name"
      >
        <div id="iframeHtml" v-if="activeName === `${item.name}`"></div>
        <el-row>
          <el-col :span="2" :offset="11">
            <el-button
              :disabled="disable"
              :loading="isButtonLoading"
              @click="handleDownload(`${item.name}`)"
              style="background-color: #5745c5;
                                color: #fff;"
            >
              {{ $t('download') }}{{ $t(item.label) }}
            </el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { createAnChildNode } from '@/lib/utils/index';
import baseApi from '@/lib/axios/base_api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  props: {
    visible: Boolean,
    id: Number
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          label: 'Inbound',
          name: 'entry'
        },
        {
          id: 2,
          label: 'PurchaseOrder',
          name: 'purchase'
        },
        {
          id: 3,
          label: 'Inboundbatchnumber',
          name: 'batchno'
        }
      ],
      pdfData: '',
      content: '',
      disable: false,
      activeName: 'entry'
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    api() {
      return this.$store.state.token.token.substring(7);
    }
  },
  created() {
    this.getList('entry');
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
      deep: true
    }
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
      // eslint-disable-next-line
      this.$nextTick(() => {
        const iframeHtml = document.getElementById('iframeHtml');
        if (iframeHtml) {
          for (let i = 0; i < iframeHtml.childNodes.length; i += 1) {
            iframeHtml.removeChild(iframeHtml.childNodes[i]);
          }
        }
        const iframe = createAnChildNode('iframe', {
          width: '100%',
          height: '500',
          frameBorder: '0',
          src: `${baseApi.BASE_URL}batch/${this.id}/pdf/${template}?api_token=${this.api}`
        });
        iframeHtml.appendChild(iframe);
      });
    },
    handleDownload(template) {
      window.open(
        `${baseApi.BASE_URL}batch/${this.id}/download/${template}/?api_token=${this.api}&lang`
      );
      this.disable = true;
      const timer = setTimeout(() => {
        this.disable = false;
        clearTimeout(timer);
      }, 500);
    }
  }
};
</script>

<style module>
.content_box {
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
.inbound_info {
  padding-left: 20px;
}
</style>
