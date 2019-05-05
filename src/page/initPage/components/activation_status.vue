<template>
  <div :class="$style.no_authentication">
    <div :class="$style.authentication_text">
      <p>
        欢迎使用 <br />
        EUT商家仓库管理系统
      </p>
      <p>您未激活邮箱，尚不能进行任何认证操作，也不能加入他人员工组。请先激活登录邮箱。</p>
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
    color: @red;
  }
}
</style>
