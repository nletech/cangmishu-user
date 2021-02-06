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
  <div>
    <el-popover placement="bottom" v-model="popoverVisible" trigger="manual">
      <el-table
        :data="clientSearchResult"
        v-loading="loading"
        @row-click="handlePopoverSelectClient"
      >
        <el-table-column width="150" property="fullname" label="姓名"></el-table-column>
        <el-table-column width="120" property="phone" label="电话"></el-table-column>
        <el-table-column width="400" property="address" label="地址"></el-table-column>
      </el-table>
      <el-input
        class="popover-input"
        v-model="clientKeyword"
        slot="reference"
        @input="querySearchClient"
        placeholder="请输入客户关键词"
      >
        <el-button slot="append" icon="el-icon-user-solid" @click="handleSelect(1)"></el-button>
      </el-input>
    </el-popover>
    <!-- 详细信息弹窗 -->
    <el-dialog :title="$t('receiver')" width="80%" :visible.sync="addressDialog">
      <!-- 选择收发件人按钮 -->
      <div class="add_button">
        <el-button
          class="title"
          icon="el-icon-plus"
          :loading="isButtonLoading"
          @click="addSenderAndReceiver()"
          size="large"
        >
          {{ $t('receiver') }}
        </el-button>
      </div>
      <el-table
        :row-style="{ cursor: 'pointer' }"
        :data="clientSearchResult"
        highlight-current-row
        style="width: 100%; margin: 0 0 10px 0;"
      >
        <el-table-column type="index" width="55" label="#"> </el-table-column>
        <el-table-column prop="fullname" :label="$t('receiver')"></el-table-column>
        <el-table-column prop="phone" :label="$t('phone')"> </el-table-column>
        <el-table-column prop="full_address" :label="$t('address')"> </el-table-column>
        <el-table-column :label="$t('operation')" width="240">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-check"
              :loading="isButtonLoading"
              type="primary"
              plain
              @click="handleConfirmBtn(scope.row)"
              >{{ $t('confirm') }}</el-button
            >
            <el-button
              icon="el-icon-edit"
              :loading="isButtonLoading"
              @click="handle_edit_btn(scope.row)"
              >{{ $t('edit') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="4" :offset="16">
          <pagination-public :params="params" @changePage="handlerChangePage"> </pagination-public>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 编辑收发件人信息 -->
    <edit
      v-show="visibleFlag"
      :visibleFlag="visibleFlag"
      :addressText="addressText"
      :row_data="row_data"
      @update:visibleFlag="handleVisible($event)"
    >
    </edit>
    <!-- 添加收发件人信息 -->
    <add
      v-if="visible_add"
      :visible_add="visible_add"
      :addressText="addressText"
      @update:visible_add="handleAddVisible($event)"
    >
    </add>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import Edit from './senderAndReceiverEdit';
import Add from './senderAndReceiveAdd';

export default {
  name: 'receiverInput',
  mixins: [mixin],
  components: {
    Edit,
    Add,
    paginationPublic
  },
  data() {
    return {
      params: {
        total: 0
      },
      visible_add: false, // 添加
      visibleFlag: false, // 编辑
      row_data: {}, // 行数据
      receiverInfo: {
        id: '',
        fullname: '',
        address: '',
        phone: ''
      }, // 收件人地址信息
      AddressType: 0,
      addressDialog: false,
      clientSearchResult: [],
      clientKeyword: '',
      popoverVisible: false,
      loading: false
    };
  },
  computed: {
    addressText() {
      return '收件人';
    }
  },
  methods: {
    querySearchClient(val) {
      $http
        .getReceiverAddress({
          keywords: val
        })
        .then(res => {
          this.popoverVisible = true;
          this.clientSearchResult = res.data.data;
        });
    },

    handlePopoverSelectClient(row) {
      this.popoverVisible = false;
      this.handleConfirmBtn(row);
    },
    isSelectReceiver() {
      if (this.receiverInfo.id === '') {
        return false;
      }
      return true;
    }, // 显示操作收件人图标
    handlerChangePage(val) {
      $http
        .checkReceiverAddress({
          warehouse_id: this.warehouseId,
          page: val
        })
        .then(res => {
          if (res.status) return;
          this.clientSearchResult = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页响应
    addSenderAndReceiver() {
      this.visible_add = true;
    },
    handleSelect(tag) {
      this.addressDialog = true;
      if (tag === 0) {
        this.AddressType = 0;
        this.getSenders();
      } // 获取发件人
      if (tag === 1) {
        this.AddressType = 1;
        this.getReceivers();
      } // 获取收件人
    },
    getReceivers() {
      $http.getReceiverAddress().then(res => {
        if (res.status) return;
        this.clientSearchResult = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    }, // 获取收件人列表
    handleConfirmBtn(row) {
      this.clientKeyword = row.fullname;
      this.receiverInfo.address = row.full_address;
      this.receiverInfo.phone = row.phone;
      this.receiverInfo.fullname = row.fullname;
      this.receiverInfo.id = row.id;
      this.$emit('receiver-input-callback', { receiverId: row.id });
      this.addressDialog = false; // 关闭弹窗
    }, // 确定
    handle_edit_btn(row) {
      this.visibleFlag = true;
      this.row_data = row;
    }, // 编辑
    handleVisible(val) {
      this.visibleFlag = val;
      if (!this.AddressType) {
        this.getSenders();
      } else {
        this.getReceivers();
      }
    },
    handleAddVisible(val) {
      this.visible_add = val;
      this.getReceivers();
    }
  }
};
</script>

<style scoped>
.address {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  min-height: 280px;
}
.title {
  float: right;
  margin: 0 0 10px 0;
}
.popover-input {
  width: 300px;
}
</style>
<style lang="less" module>
.main {
  position: relative;
}
</style>
