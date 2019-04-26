<template>
  <div :class="$style.my_authentication" class="my_authentication">
    <div :class="$style.my_authentication_model">
      <div :class="$style.model" class="model">
        <img src="../../assets/img/ck.png">
        <div :class="$style.model_title">
          创建仓库认证
        </div>
        <div :class="$style.model_content">
          <p>如果你拥有自己的仓库，却没有一套管理自己仓库的系统，建议选此认证。</p>
          <p>认证通过后，你可以使用EUT WMS来配置自己的仓库，管理自己的货品出入库，</p>
          <p>如果你有足够大或者多的仓库，还可以创建公共仓库将仓库租给别人。</p>
        </div>
        <div :class="$style.model_button">
          <el-button
          :type="['primary', 'warning', 'success', 'danger']
          [vip_info && vip_info.certification_owner_status]"
          :plain="vip_info && vip_info.certification_owner_status == 1"
          :disabled="owner_status_id !==  0 && owner_status_id !== 3 "
          round
          @click="$router.push({ name: 'authenticationForm' })">
          {{owner_status}}
          </el-button>
        </div>
      </div>
      <div :class="$style.model" class="model">
        <img src="../../assets/img/zp.png">
        <div :class="$style.model_title">
          租赁仓库认证
        </div>
        <div :class="$style.model_content">
          <p>如果你没有自己的仓库，亟需寻找仓库来管理自己的货品出入库，建议选此认证。</p>
          <p>认证通过后，你可以使用EUT WMS向别的仓库拥有者租赁最适合你的仓库来管理你的货品。</p>
        </div>
        <div :class="$style.model_button">
          <el-button
          round
          :type="['primary', 'success', 'success', 'danger'][vip_info.certification_renter_status]"
          :plain="vip_info.certification_renter_status == 1"
          :disabled="renter_status_id !==  0 && renter_status_id !== 3 "
          @click="$router.push({ name: 'addApply' })">
           {{renter_status}}
          </el-button>
        </div>
      </div>
      <!-- <div :class="$style.model" class="model">
        <img src="../../assets/svg/yg.svg">
        <div :class="$style.model_title">
          我是员工
        </div>
        <div :class="$style.model_content">
          <p>如果你是仓库管理中的一员，负责管理仓库的出入库或者其他功能，无需租赁或者创建仓库，那么不需要认证。</p>
          <p>你只要将自己的WMS账户邮箱告诉仓库的使用者就可以帮助他来管理仓库。</p>
        </div>
        <div :class="$style.model_button">
          <el-button round disabled> 无需认证</el-button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'my_authentication',
  computed: {
    vip_info() {
      return this.$store.state.token.vip_info;
    },
    owner_status_id() {
      if (this.$store.state.token.vip_info) {
        return this.$store.state.token.vip_info.certification_owner_status;
      }
      return null;
    },
    owner_status() {
      let text;
      switch (this.$store.state.token.vip_info.certification_owner_status) {
        case 0:
          text = '我要认证';
          break;
        case 1:
          text = '审核中';
          break;
        case 2:
          text = '已认证';
          break;
        case 3:
          text = '未通过,重新审核';
          break;
        default:
          text = '我要认证';
      }
      return text;
    },
    renter_status_id() {
      if (this.$store.state.token.vip_info) {
        return this.$store.state.token.vip_info.certification_renter_status;
      }
      return null;
    },
    renter_status() {
      let text;
      switch (this.$store.state.token.vip_info.certification_renter_status) {
        case 0:
          text = '我要认证';
          break;
        case 1:
          text = '审核中';
          break;
        case 2:
          text = '已认证';
          break;
        case 3:
          text = '未通过,重新审核';
          break;
        default:
          text = '我要认证';
      }
      return text;
    },
  },
};
</script>

<style lang="less" module>
.my_authentication {
  .my_authentication_model {
    margin: 104px 0 0 60%;
    width: 950px;
    transform: translateX(-50%);
    display: flex;
    flex-flow: row wrap;
    .model {
      margin-left:5%;
      width:262px;
      position: relative;
      height:412px;
      background:rgba(255,255,255,1);
      box-shadow:0 2px 18px rgba(109,96,186,0.3);
      img {
        width: 46px;
        position: relative;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
      }
      .model_title {
        font-size: 18px;
        text-align: center;
      }
      .model_content {
        line-height: 23px;
        font-size: 14px;
        width: 205px;
        height: 260px;
        margin: 0 auto;
      }
      .model_button{
        text-align: center;
      }
    }
  }
}
</style>

<style lang="less">
.my_authentication {
  .model {
    .el-button {
      width:160px;
      height:36px;
      line-height: 10px;
    }
    .el-button--primary {
      color: #fff;
      background-color: RGBA(27, 193, 255, 1);
      border-color: RGBA(27, 193, 255, 1);
    }
  }
}
</style>
