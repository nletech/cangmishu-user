<template>
  <el-dialog  title="查看入库单"
              :fullscreen="true"
              @close="close"
              @update:visible="$emit('update:visible', $event)"
              :visible="visible">
              <div v-html="content" v-if="visible">
              </div>
              <el-row>
                      <el-col :span="4" :offset="10">
                              <el-button  @click="handleDownload"
                                          style="background-color: #5745c5;
                                          color: #fff;">
                                          下载入库单
                              </el-button>
                      </el-col>
              </el-row>
  </el-dialog>
</template>

<script>
import Axios from 'axios';
/* eslint-disable */
import $http from '@/api';
import baseApi from '@/lib/axios/base_api'
import getListData from '@/mixin/list';
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  props: {
    visible: Boolean,
    // inboundInfo: Object,
    id: Number,
  },
  mounted() {
    this.pdf = `${baseApi}/batch/7/download`
    console.log(this.pdf, 'axios');
  },
  data() {
    return {
      pdf: '',
      content: '',
      pdfUrl: `${Axios}/batch/${this.id}/pdf.pdf`,
      inboundInfo: {},
      inboundList: [],
      batch_id: '',
      tableLoading: false,
      order_status_list: [],
      warehouse_name: '',
      distributor_name: '',
      category_name: '',
      total_need_num: '',
    };
  },
  components: {
    buttonPagination,
  },
  mixins: [getListData],
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    api() {
      return this.$store.state.token.token.substring(7) ;
    },
  },
  watch: {
    warehouseId() {
      this.getList();
      // this.getTypeList();
    },
    id: {
      handler(value) {
        this.getList();
      },
      deep: true,
    },
  },
  methods: {
    close() {
      // this.page_params.page = 1;
    },
    getList() {
      if (!this.id || !this.warehouseId) return;
      this.params.warehouse_id = this.warehouseId
      $http.previewInbound(this.id).then((res) => {
        this.content = res;
      });
    },
    handleDownload() {
      $http.downloadInbound(this.id).then((res) => {
        // console.log(res, 'res');
        this.$message({
          message: '下载成功!',
          type: 'success',
          showClose: true,
        });
        window.open(`${baseApi}/batch/${this.id}/download?api_token=${this.api}&lang`);
      });
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
