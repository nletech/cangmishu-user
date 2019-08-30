<template>
    <div :class="$style.main">
        <el-tabs tab-position="left" v-model="activeName">
            <el-tab-pane label="联系我们" name="help_tag">
                <div>
                      <el-row>
                          <el-col style="text-align: center;">
                              <div style="font-size: 1.2rem; margin: 0 0 20px 0;"><span>如果您在使用仓秘书的时候有任何疑惑，请用微信扫描下方二维码</span></div>
                              <div>
                                <img src="../../../src/assets/img/help.png" alt="微信二维码">
                              </div>
                          </el-col>
                      </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="第三方接口文档" name="api_tag">
                <div style="margin: 50px 0 0 20px;">
                    <!-- eslint-disable-next-line -->
                    <span style="font-size: 1.2rem;">接口地址:&nbsp;&nbsp;&nbsp;&nbsp;</span><a target="_blank" href="https://www.eolinker.com/#/share/index?shareCode=eDeUap&tdsourcetag=s_pctim_aiomsg">https://www.eolinker.com/#/share/index?shareCode=eDeUap&tdsourcetag=s_pctim_aiomsg</a>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import MdoelForm from '@/components/form';

export default {
  name: 'help',
  components: {
    MdoelForm,
  },
  data() {
    return {
      activeName: 'help_tag',
    };
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.main {
  margin: 50px 0 0 50px;
}
// .help_main {
//   width: 96%;
//   padding: 80px 0 0 0;
//   .help_desc {
//     display: felx;
//     justify-content: center;
//     align-items: center;
//   }
// }
</style>
