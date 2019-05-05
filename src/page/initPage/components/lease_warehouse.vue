<template>
  <div :class="$style.no_authentication">
    <div :class="$style.authentication_text">
      <p>
        欢迎使用 <br />
        EUT商家仓库管理系统
      </p>
      <p>恭喜你！现在你已经是NLE WMS大家庭的一员了。你的租赁仓库认证申请正在审核中，请耐心等待。您可以前往
        <router-link :to="{name: 'myAuthentication'}">
          我的WMS-我的认证</router-link>查看认证详情</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'no_authentication',
};
</script>

<style module lang="less">
@import '../../../less/public_variable.less';
.no_authentication {
  .authentication_text {
    margin-left: 81px;
    padding-top: 84px;
  }
  p:nth-child(1) {
    font-size: 48px;
    font-weight: bold;
  }
  p:nth-child(2) {
    font-size: 18px;
    a {
      color: @red;
      text-decoration: none;
    }
  }
}
</style>
