<template>
  <div :class="$style.no_authentication">
    <div :class="$style.authentication_text">
      <p>
        欢迎使用 <br />
        EUT商家仓库管理系统
      </p>
      <p>恭喜！您的租赁仓库认证已经通过！现在您可以点击
        <router-link :to="{naem: 'StoreLeases'}">
          仓库租赁</router-link>来租赁仓库，管理货品啦！</p>
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
