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
    <!-- 收发件人信息 -->
    <el-row :gutter="10" type="flex" align="middle">
      <el-col :lg="12" justify="space-between">
        <div class="address">
          <label class="label">
            <el-button
              v-show="isSelectSender()"
              size="mini"
              @click="handle_select(0)"
              icon="el-icon-more"
              style="float:right"
            >
            </el-button>
            {{ $t('From') }}
          </label>
          <el-form label-width="80px" v-if="senderInfo.fullname">
            <el-form-item :label="$t('name')" prop="fullname">
              {{ senderInfo.fullname }}
            </el-form-item>
            <el-form-item :label="$t('phone')" prop="phone">
              {{ senderInfo.phone }}
            </el-form-item>
            <el-form-item :label="$t('address')" prop="address">
              {{ senderInfo.address }}
            </el-form-item>
          </el-form>
          <div v-if="!senderInfo.fullname">
            <el-button
              size="large"
              @click="handle_select(0)"
              type="primary"
              plain
              icon="el-icon-s-custom"
            >
              {{ $t('selectSender') }}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :lg="12" justify="space-between">
        <div class="address sender">
          <label class="label">
            <el-button
              :loading="isButtonLoading"
              v-show="isSelectReceiver()"
              size="mini"
              @click="handle_select(1)"
              icon="el-icon-more"
              style="float:right"
            >
            </el-button>
            {{ $t('To') }}
          </label>
          <el-form label-width="80px" v-if="receiverInfo.fullname">
            <el-form-item :label="$t('name')" prop="fullname">
              {{ receiverInfo.fullname }}
            </el-form-item>
            <el-form-item :label="$t('phone')" prop="phone">
              {{ receiverInfo.phone }}
            </el-form-item>
            <el-form-item :label="$t('address')" prop="address">
              {{ receiverInfo.address }}
            </el-form-item>
          </el-form>
          <div v-if="!receiverInfo.fullname">
            <el-button
              size="large"
              :loading="isButtonLoading"
              @click="handle_select(1)"
              type="primary"
              plain
              icon="el-icon-s-custom"
            >
              {{ $t('selectReceiver') }}
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 详细信息弹窗 -->
    <el-dialog
      :title="this.addressText === '发件人' ? $t('sender') : $t('receiver')"
      width="80%"
      :visible.sync="addressDialog"
    >
      <!-- 选择收发件人按钮 -->
      <div class="add_button">
        <el-button
          class="title"
          icon="el-icon-plus"
          :loading="isButtonLoading"
          @click="addSenderAndReceiver()"
          size="large"
        >
          {{ $t('add') }} {{ this.addressText === '发件人' ? $t('sender') : $t('receiver') }}
        </el-button>
      </div>
      <el-table
        :row-style="{ cursor: 'pointer' }"
        :data="address_list_data"
        highlight-current-row
        style="width: 100%; margin: 0 0 10px 0;"
      >
        <el-table-column type="index" width="55" label="#"> </el-table-column>
        <el-table-column
          prop="fullname"
          :label="this.addressText === '发件人' ? $t('sender') : $t('receiver')"
        >
        </el-table-column>
        <el-table-column prop="phone" :label="$t('phone')"> </el-table-column>
        <el-table-column prop="full_address" :label="$t('address')"> </el-table-column>
        <el-table-column :label="$t('operation')" width="240">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-check"
              :loading="isButtonLoading"
              type="primary"
              plain
              @click="handle_confirm_btn(scope.row)"
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
  name: 'senderAndReceiver',
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
      senderInfo: {
        id: '',
        fullname: '',
        address: '',
        phone: ''
      }, // 发件人地址信息
      receiverInfo: {
        id: '',
        fullname: '',
        address: '',
        phone: ''
      }, // 收件人地址信息
      AddressType: 0,
      addressDialog: false,
      address_list_data: []
    };
  },
  computed: {
    addressText() {
      if (!this.AddressType) {
        return '发件人';
      }
      return '收件人';
    }
  },
  methods: {
    isSelectSender() {
      if (this.senderInfo.id === '') {
        return false;
      }
      return true;
    }, // 显示操作发件人图标
    isSelectReceiver() {
      if (this.receiverInfo.id === '') {
        return false;
      }
      return true;
    }, // 显示操作收件人图标
    handlerChangePage(val) {
      if (this.addressText === '发件人') {
        $http
          .checkSenderAddress({
            warehouse_id: this.warehouseId,
            page: val
          })
          .then(res => {
            if (res.status) return;
            this.address_list_data = res.data.data;
            this.params.total = res.data.total;
            this.params.currentPage = res.data.current_page;
          });
      } else if (this.addressText === '收件人') {
        $http
          .checkReceiverAddress({
            warehouse_id: this.warehouseId,
            page: val
          })
          .then(res => {
            if (res.status) return;
            this.address_list_data = res.data.data;
            this.params.total = res.data.total;
            this.params.currentPage = res.data.current_page;
          });
      }
    }, // 分页响应
    addSenderAndReceiver() {
      this.visible_add = true;
    },
    handle_select(tag) {
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
    getSenders() {
      $http.getSenderAddress().then(res => {
        if (res.status) return;
        this.address_list_data = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    }, // 获取发件人列表
    getReceivers() {
      $http.getReceiverAddress().then(res => {
        if (res.status) return;
        this.address_list_data = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    }, // 获取收件人列表
    handle_confirm_btn(row) {
      // this.AddressType 为 0 信息填入发件人, 否则填入收件人
      if (!this.AddressType) {
        this.senderInfo.address = row.full_address;
        this.senderInfo.phone = row.phone;
        this.senderInfo.fullname = row.fullname;
        this.senderInfo.id = row.id;
        this.$emit('sender-and-receiver', { senderId: row.id });
      } else {
        this.receiverInfo.address = row.full_address;
        this.receiverInfo.phone = row.phone;
        this.receiverInfo.fullname = row.fullname;
        this.receiverInfo.id = row.id;
        this.$emit('sender-and-receiver', { receiverId: row.id });
      }
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
      if (this.addressText === '发件人') {
        this.getSenders();
      } else if (this.addressText === '收件人') {
        this.getReceivers();
      }
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
</style>
<style lang="less" module>
.main {
  position: relative;
}
</style>
