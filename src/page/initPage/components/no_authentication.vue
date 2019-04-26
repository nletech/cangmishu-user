<template>
  <div :class="$style.no_authentication">
    <div :class="$style.authentication_text">
      <p>
        欢迎使用 <br />
        EUT商家仓库管理系统
      </p>
      <p>恭喜你！现在你已经是EUT WMS大家庭的一员了，你可以使用你的EUT WMS账号
        <router-link :to="{ name: 'myAuthentication' }">申请认证</router-link>来创建和申请仓库</p>
      <p>当然，你也可以<span>免认证</span>
      直接被仓库管理员邀请添加至员工表来帮助管理仓库</p>
      <el-button
      type="danger"
      @click="$router.push({ name: 'myAuthentication' })"
      round>我要认证</el-button>
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
      font-weight: bold;
    }
  }
  p:nth-child(3) {
    font-size: 18px;
    span {
      color: @gree;
      font-weight: bold;
    }
  }
}
</style>
