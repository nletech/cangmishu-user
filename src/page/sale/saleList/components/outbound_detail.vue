<template>
  <el-dialog
    :title="$t('outboundDetial')"
    width="90%"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
  >
    <el-tabs v-model="activeName" @tab-click="handlerTabClick" stretch type="border-card">
      <el-tab-pane name="out">
        <div id="iframeHtml" v-if="visible"></div>
        <el-row>
          <el-col :span="2" :offset="11">
            <el-button
              :disabled="disable"
              :loading="isButtonLoading"
              @click="handleDownload('out')"
              style="background-color: #5745c5;
                                color: #fff;"
            >
              {{ $t('downloadOutbound') }}
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
  name: 'outbound-order-detail',
  props: {
    visible: Boolean,
    id: Number
  },
  data() {
    return {
      pdfData: '',
      disable: false,
      activeName: 'out'
    };
  },
  mounted() {
    this.activeName = 'out';
    this.getList('out');
  },
  watch: {
    id: {
      handler() {
        this.activeName = 'out';
        this.getList('out');
      },
      immediate: true
    }
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    api() {
      return this.$store.state.token.token.substring(7);
    }
  },
  methods: {
    getList(template) {
      if (!this.id || !this.warehouseId) return;
      // eslint-disable-next-line
      this.$nextTick(() => {
        const iframeHtml = document.getElementById('iframeHtml');
        const iframe = createAnChildNode('iframe', {
          frameBorder: '0',
          width: '100%',
          height: '500',
          src: `${baseApi.BASE_URL}order/${this.id}/pdf/${template}?api_token=${this.api}`
        });
        iframeHtml.appendChild(iframe);
      });
    },

    handlerTabClick(tab) {
      switch (+tab.index) {
        case 0: // 销售单
          this.getList('out');
          // eslint-disable-next-line
          return;
        default:
          // eslint-disable-next-line
          return;
      }
    },
    handleDownload(template) {
      window.open(
        `${baseApi.BASE_URL}order/${this.id}/download/${template}/?api_token=${this.api}&lang`
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

<style lang="less" module>
.systemInfo {
  margin: 0 0 30px 0;
}
.img {
  margin: 0 20px 0 0;
}
.contact {
  font-weight: bold;
  line-height: 35px;
  margin-bottom: 20px;
}
.desc_detail {
  font-weight: bold;
  margin-top: 20px;
  .desc_remark {
    word-wrap: none;
  }
  .desc_main {
    text-align: left;
  }
}
</style>
