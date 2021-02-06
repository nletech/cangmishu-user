<script>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
export default {
  created() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({ path: `/${path}`, query });
  },
  render(h) {
    return h(); // avoid warning message
  }
};
</script>
