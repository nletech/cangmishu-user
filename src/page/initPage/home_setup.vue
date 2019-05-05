<template>
  <mdoel-form class="home_steup" :class="$style.home_steup">
    <template slot="left">
      <div :class="$style.identity_display">
        <div :class="$style.identity_display_title">
          首页身份信息展示
        </div>
        <div :class="$style.identity_display_container">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="仓库产权方"></el-checkbox>
              <el-checkbox label="商家"></el-checkbox>
              <el-checkbox label="员工"></el-checkbox>
            </el-checkbox-group>
        </div>
      </div>
      <div :class="$style.home_show">
        <div :class="$style.identity_display_title">
          首页展示仓库
        </div>
        <el-select v-model="something" style="width: 100%">
          <el-option label="11" value="1"></el-option>
        </el-select>
      </div>
    </template>
    <template slot="right">
        <div :class="$style.identity_display">
          <div :class="$style.identity_display_title">
            首页展示信息
          </div>
          <div :class="$style.identity_display_container">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="仓库产权方"></el-checkbox>
                <el-checkbox label="商家"></el-checkbox>
                <el-checkbox label="员工"></el-checkbox>
              </el-checkbox-group>
          </div>
        </div>
    </template>
    <div :class="$style.submit" slot="submit">
      <el-button type="danger">提交</el-button>
      <el-button >取消</el-button>
    </div>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';

export default {
  data() {
    return {
      checkList: [],
      something: '',
    };
  },
  components: {
    MdoelForm,
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.home_steup {
  .identity_display_title {
    padding:10px 0 10px 0;
  }
  .identity_display {
    .identity_display_container {
      background: @gray;
      padding: 20px 30px 20px 30px;
    }
  }
  .home_show {
    margin-top: 52px;
  }
  .submit {
    margin: 10px;
    width: 80%;
  }
}
</style>

<style lang="less">
.home_steup {
  .el-checkbox {
    font-weight: bold;
  }
}
</style>
