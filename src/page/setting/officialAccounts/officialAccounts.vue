<template>
  <div class="official-accounts">
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-steps direction="vertical" :active="3">
            <el-step>
              <div class="step-height" slot="title">
                <div>第一步打开微信扫一扫</div>
                <div><img class="wechat-scan" src="../../../assets/img/wechat-scan.png" /></div>
              </div>
            </el-step>
            <el-step>
              <div class="step-height" slot="title">
                <div>扫描下面二维码</div>
                <div>
                  <el-image v-if="wechatQrcode" class="wechat-scan" :src="wechatQrcode">
                    <div slot="placeholder" class="image-slot">
                      <div>加载中...</div>
                    </div></el-image
                  >
                </div>
              </div>
            </el-step>
            <el-step title="完成关注与帐号的绑定"> </el-step>
          </el-steps>
        </el-col>
        <el-col :span="10" :offset="2">
          <div class="title">订阅通知消息</div>
          <div v-for="item in subscribeMessagesList" :key="item.type" class="switch">
            <el-switch
              v-model.number="item.status"
              @change="onSubscribeChange"
              inactive-value="0"
              :active-value="1"
            >
            </el-switch>
            <span>{{ item.name }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'officialAccounts',
  data() {
    return {
      value: '',
      subscribeMessagesList: [],
      subscribeTimer: null,
      wechatQrcode: ''
    };
  },
  created() {
    this.getSubscribeMessages();
    this.getOfficialAccountQrCode();
  },
  methods: {
    getOfficialAccountQrCode() {
      $http.getOfficialAccountQrCode().then(res => {
        this.wechatQrcode = res.data.url;
      });
    },
    onSubscribeChange() {
      if (this.subscribeTimer) {
        clearInterval(this.subscribeTimer);
      }
      this.subscribeTimer = setInterval(() => {
        $http
          .setSubscribeMessages('wechat', this.subscribeMessagesList)
          .then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            clearInterval(this.subscribeTimer);
            this.subscribeTimer = null;
          })
          .catch(() => (this.subscribeTimer = null));
      }, 1000);
    },
    getSubscribeMessages() {
      $http.getSubscribeMessages('wechat').then(res => {
        this.subscribeMessagesList = res.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.official-accounts {
  .step-height {
    min-height: 200px;
    .wechat-scan {
      width: 150px;
      height: 150px;
      margin-top: 15px;
      .image-slot {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .switch {
    margin: 20px 0;
    div {
      margin-right: 20px;
    }
  }
}
</style>
