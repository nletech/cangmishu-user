<template>
          <div>
              <el-row :class="$style.help_main">
                      <el-col style="text-align: center;">
                          <div style="font-size: 1.2rem; margin: 0 0 20px 0;"><span>如果您在使用仓秘书的时候有任何疑惑，请用微信扫描下方二维码</span></div>
                          <div><img src="../../../src/assets/img/help.png" alt="微信二维码"></div>
                      </el-col>
                </el-row>
          </div>
</template>

<script>
import MdoelForm from '@/components/form';

export default {
  name: 'help',
  components: {
    MdoelForm,
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';

.help_main {
  width: 96%;
  padding: 80px 0 0 0;
  .help_desc {
    display: felx;
    justify-content: center;
    align-items: center;
  }
}
</style>
