<template>
  <page-model title="注册" :type="tips">
      <el-tabs
          stretch
          v-model="activeName"
          style="position: relative; top: -40px;">
          <el-tab-pane label="邮箱注册" name="email">
              <el-form
                    ref="registerEmail"
                    :model="form"
                    :rules="rules"
                    :class="$style.input_item">
                    <el-form-item
                        :class="$style.item_email">
                          <el-input  placeholder="请输入邮箱"
                                      v-model="form.email"
                                      size="small">
                                      <template slot="append">
                                          <span
                                              style="cursor: pointer;"
                                              @click="flag && sendVerificationCodeForEmail(form.email, true)">
                                              {{sendVerCode}}
                                          </span>
                                      </template>
                          </el-input>
                    </el-form-item>
                    <div :class="$style.item_picture" :style="style.OperateStyleEmailPicture">
                        <div :class="$style.item_picture_main">
                            <div :class="$style.item_picture_title">
                                <span style="font-size: 1.3rem;">
                                  请输入图片验证码
                                </span>
                            </div>
                            <div :class="$style.item_picture_input">
                                <el-input v-model="verifyPhone.captcha" size="small" style="width: 230px; position: relative; left: 10px;">
                                    <template slot="append">
                                      <i @click="sendVerificationCodeForEmail(form.email, false)" class="el-icon-refresh"></i>
                                    </template>
                                </el-input>
                                <img :src="vEmailPicture" style=" width:100px; height: 30px; position: absolute; top: 46px; left: 250px;" />
                            </div>
                            <el-row  :class="$style.item_picture_btn">
                                <el-col :span="2" :offset="14">
                                    <el-button :loading="isButtonLoading()" size="small" @click="handlerCloseVerifyBox">取消</el-button>
                                </el-col>
                                <el-col :span="2" :offset="3">
                                    <el-button :loading="isButtonLoading()" size="small" @click="handlerGetEmailCode">确定</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <el-form-item
                        prop="code"
                        :class="$style.item_verificationCode">
                        <el-input
                            v-model="form.code"
                            type="text"
                            placeholder="请输入验证码"
                            size="small">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        :class="$style.item_password"
                        prop="password">
                        <el-input
                            v-model="form.password"
                            :type="input_type ? 'password' : 'text'"
                            placeholder="请输入登录密码"
                            size="small">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="warehouse_name"
                        :class="$style.item_warehouseName">
                        <el-input
                            placeholder="请输入仓库名称"
                            type="text"
                            v-model="form.warehouse_name"
                            size="small">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="warehouse_area">
                        <el-input
                            v-model="form.warehouse_area"
                            placeholder="请输入仓库面积"
                            size="small">
                            <template slot="append">平方米</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        :class="$style.save_user_info">
                        <div  :class="$style.item_user_info">
                            <el-checkbox  v-model="keep">
                                <p>
                                    <span>我同意</span>
                                    <span  @click="user_agreement_dialog" :class="$style.user_agreement">用户协议</span>
                                </p>
                            </el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item class="user_login_button">
                        <el-button
                            :loading="isButtonLoading()"
                            @click="goRegister('email')"
                            type="primary">
                            注册
                        </el-button>
                    </el-form-item>
                    <el-button
                          type="text"
                          class="user_account_exist"
                          @click="$router.push({name: 'login'})">
                          我有账号
                    </el-button>
              </el-form>
          </el-tab-pane>
          <!-- 手机 -->
          <el-tab-pane label="手机号码注册" name="phone">
              <el-form
                  ref="register"
                  :model="formPhone"
                  :rules="rules"
                  :class="$style.input_item">
                  <el-form-item
                      :class="$style.item_phone">
                      <el-input
                          placeholder="请输入手机号码"
                          v-model="formPhone.mobile"
                          maxlength="11"
                          size="small">
                          <template slot="append">
                              <el-button
                                  :loading="isButtonLoading()"
                                  type="text"
                                  style="cursor: pointer; padding: 12px"
                                  @click="flag && sendVerificationCodeForPhone(formPhone.mobile, true)">
                                  {{sendVerCodePhone}}
                              </el-button>
                          </template>
                      </el-input>
                  </el-form-item>
                  <div :class="$style.item_picture" :style="style.OperateStylePhonePicture">
                      <div :class="$style.item_picture_main">
                          <div :class="$style.item_picture_title">
                              <span style="font-size: 1.3rem;">
                                请输入图片验证码
                              </span>
                          </div>
                          <div :class="$style.item_picture_input">
                              <el-input v-model="verifyPhone.captcha" size="small" style="width: 230px; position: relative; left: 10px;">
                                  <template slot="append">
                                    <i
                                        @click="sendVerificationCodeForPhone(formPhone.mobile, false)"
                                        class="el-icon-refresh">
                                    </i>
                                  </template>
                              </el-input>
                              <img style=" width:100px; height: 30px; position: absolute; top: 46px; left: 250px;" :src="vPicture" />
                          </div>
                          <el-row  :class="$style.item_picture_btn">
                              <el-col :span="2" :offset="14">
                                  <el-button :loading="isButtonLoading()" size="small" @click="handlerCloseVerifyBox">取消</el-button>
                              </el-col>
                              <el-col :span="2" :offset="3">
                                  <el-button :loading="isButtonLoading()" size="small" @click="handlerGetPhoneCode">确定</el-button>
                              </el-col>
                          </el-row>
                      </div>
                  </div>
                  <el-form-item
                      prop="code"
                      :class="$style.item_verificationCode">
                      <el-input
                          v-model="formPhone.code"
                          type="text"
                          placeholder="请输入验证码"
                          size="small">
                      </el-input>
                  </el-form-item>
                  <el-form-item
                      :class="$style.item_password"
                      prop="password">
                      <el-input
                          v-model="formPhone.password"
                          :type="input_type ? 'password' : 'text'"
                          placeholder="请输入登录密码"
                          size="small">
                      </el-input>
                  </el-form-item>
                  <el-form-item
                      prop="warehouse_name"
                      :class="$style.item_warehouseName">
                      <el-input
                          placeholder="请输入仓库名称"
                          type="text"
                          v-model="formPhone.warehouse_name"
                          size="small">
                      </el-input>
                  </el-form-item>
                  <el-form-item
                      prop="warehouse_area">
                      <el-input
                          v-model="formPhone.warehouse_area"
                          placeholder="请输入仓库面积"
                          size="small">
                          <template slot="append">平方米</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item
                      :class="$style.save_user_info">
                      <div  :class="$style.item_user_info">
                          <el-checkbox  v-model="keep">
                              <p>
                                  <span>我同意</span>
                                  <span
                                      @click="user_agreement_dialog"
                                      :class="$style.user_agreement">
                                      用户协议
                                  </span>
                              </p>
                          </el-checkbox>
                      </div>
                  </el-form-item>
                  <el-form-item class="user_login_button">
                      <el-button
                          :loading="isButtonLoading()"
                          @click="goRegister('phone')"
                          type="primary">
                          注册
                      </el-button>
                  </el-form-item>
                  <el-button
                      class="user_account_exist"
                      type="text"
                      :loading="isButtonLoading()"
                      @click="$router.push({name: 'login'})">
                      我有账号
                  </el-button>
              </el-form>
          </el-tab-pane>
      </el-tabs>
      <el-dialog  title="用户协议"
                  width="80%"
                  align="center"
                  :append-to-body="true"
                  :visible.sync="showInfo"
                  @close="handlerClose">
                  <p style="text-align: left;">
                        <span>一、总则</span><br />
                        &nbsp;&nbsp;1.1 仓秘书的所有权和运营权归湖南恩尔伊网络科技有限公司所有。<br />
                        &nbsp;&nbsp;1.2 用户在注册之前，应当仔细阅读本协议，并同意遵守本协议后方可成为注册用户。一旦注册成功，则用户与仓秘书之间自动形成协议关系，用户应当受本协议的约束。用户在使用特殊的服务或产品时，应当同意接受相关协议后方能使用。 <br />
                        &nbsp;&nbsp;1.3 本协议则可由仓秘书随时更新，用户应当及时关注并同意本站不承担通知义务。本站的通知、公告、声明或其它类似内容是本协议的一部分。<br />
                        二、服务内容<br />
                        &nbsp;&nbsp;2.1 仓秘书的具体内容由本站根据实际情况提供。<br />
                        &nbsp;&nbsp;2.2 本站仅提供相关的网络服务，除此之外与相关网络服务有关的设备(如个人电脑、手机、及其他与接入互联网或移动网有关的装置)及所需的费用(如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费)均应由用户自行负担。<br />
                        三、用户帐号<br />
                        &nbsp;&nbsp;3.1 经本站注册系统完成注册程序并通过身份认证的用户即成为正式用户，可以获得本站规定用户所应享有的一切权限。 <br />
                        &nbsp;&nbsp;3.2 用户需按照根据真实内容注册。用户有义务保证密码和帐号的安全，用户利用该密码和帐号所进行的一切活动引起的任何损失或损害，由用户自行承担全部责任，本站不承担任何责任。如用户发现帐号遭到未授权的使用或发生其他任何安全问题，应立即修改帐号密码并妥善保管，如有必要，请通知本站。
                        因黑客行为或用户的保管疏忽导致帐号非法使用，本站不承担任何责任。<br />
                        四、使用规则<br />
                        &nbsp;&nbsp;4.1 遵守中华人民共和国相关法律法规，包括但不限于《中华人民共和国计算机信息系统安全保护条例》、《计算机软件保护条例》、《最高人民法院关于审理涉及计算机网络著作权纠纷案件适用法律若干问题的解释(法释[2004]1号)》、
                        《全国人大常委会关于维护互联网安全的决定》、《互联网电子公告服务管理规定》、《互联网新闻信息服务管理规定》、《互联网著作权行政保护办法》和《信息网络传播权保护条例》等有关计算机互联网规定和知识产权的法律和法规、实施办法。 <br />
                        &nbsp;&nbsp;4.2 用户对其自行发表、上传或传送的内容负全部责任，所有用户不得在本站任何页面发布、转载、传送含有下列内容之一的信息，否则本站有权自行处理并不通知用户：<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(1)违反宪法确定的基本原则的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(2)危害国家安全，泄漏国家机密，颠覆国家政权，破坏国家统一的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(3)损害国家荣誉和利益的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(4)煽动民族仇恨、民族歧视，破坏民族团结的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(5)破坏国家宗教政策，宣扬邪教和封建迷信的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(6)散布谣言，扰乱社会秩序，破坏社会稳定的；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(7)散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(8)侮辱或者诽谤他人，侵害他人合法权益的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(9)煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(10)以非法民间组织名义活动的；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(11)含有法律、行政法规禁止的其他内容的。<br />
                        &nbsp;&nbsp;4.3 用户承诺对其发表或者上传于本站的所有信息(即属于《中华人民共和国著作权法》规定的作品，包括但不限于文字、图片、音乐、电影、表演和录音录像制品和电脑程序等)均享有完整的知识产权，或者已经得到相关权利人的合法授权；
                        如用户违反本条规定造成本站被第三人索赔的，用户应全额补偿本站一切费用(包括但不限于各种赔偿费、诉讼代理费及为此支出的其它合理费用)； <br />
                        &nbsp;&nbsp;4.4 当第三方认为用户发表或者上传于本站的信息侵犯其权利，并根据《信息网络传播权保护条例》或者相关法律规定向本站发送权利通知书时，用户同意本站可以自行判断决定删除涉嫌侵权信息，除非用户提交书面证据材料排除侵权的可能性，本站将不会自动恢复上述删除的信息；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(1)不得为任何非法目的而使用网络服务系统； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(2)遵守所有与网络服务有关的网络协议、规定和程序；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(3)不得利用本站进行任何可能对互联网的正常运转造成不利影响的行为； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(4)不得利用本站进行任何不利于本站的行为。<br />
                        &nbsp;&nbsp;4.5 如用户在使用网络服务时违反上述任何规定，本站有权要求用户改正或直接采取一切必要的措施(包括但不限于删除用户张贴的内容、暂停或终止用户使用网络服务的权利)以减轻用户不当行为而造成的影响。<br />
                        五、隐私保护<br />
                        5.1 本站不对外公开或向第三方提供单个用户的注册资料及用户在使用网络服务时存储在本站的非公开内容，但下列情况除外：<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(1)事先获得用户的明确授权； <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(2)根据有关的法律法规要求；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(3)按照相关政府主管部门的要求；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(4)为维护社会公众的利益。<br />
                        &nbsp;&nbsp;5.2 本站可能会与第三方合作向用户提供相关的网络服务，在此情况下，如该第三方同意承担与本站同等的保护用户隐私的责任，则本站有权将用户的注册资料等提供给该第三方。<br />
                        &nbsp;&nbsp;5.3 在不透露单个用户隐私资料的前提下，本站有权对整个用户数据库进行分析并对用户数据库进行商业上的利用。<br />
                        六、版权声明<br />
                        &nbsp;&nbsp;6.1 本站的文字、图片、音频、视频等版权均归湖南恩尔伊网络科技有限公司享有或与作者共同享有，未经本站许可，不得任意转载。 <br />
                        &nbsp;&nbsp;6.2 本站特有的标识、版面设计、编排方式等版权均属湖南恩尔伊网络科技有限公司享有，未经本站许可，不得任意复制或转载。 <br />
                        &nbsp;&nbsp;6.3 使用本站的任何内容均应注明“来源于仓秘书”及署上作者姓名，按法律规定需要支付稿酬的，应当通知本站及作者及支付稿酬，并独立承担一切法律责任。<br />
                        &nbsp;&nbsp;6.4 本站享有所有作品用于其它用途的优先权，包括但不限于网站、电子杂志、平面出版等，但在使用前会通知作者，并按同行业的标准支付稿酬。<br />
                        &nbsp;&nbsp;6.5 本站所有内容仅代表作者自己的立场和观点，与本站无关，由作者本人承担一切法律责任。 <br />
                        &nbsp;&nbsp;6.6 恶意转载本站内容的，本站保留将其诉诸法律的权利。<br />
                        七、责任声明<br />
                        &nbsp;&nbsp;7.1 用户明确同意其使用本站网络服务所存在的风险及一切后果将完全由用户本人承担，仓秘书对此不承担任何责任。 <br />
                        &nbsp;&nbsp;7.2 本站无法保证网络服务一定能满足用户的要求，也不保证网络服务的及时性、安全性、准确性。 <br />
                        &nbsp;&nbsp;7.3 本站不保证为方便用户而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由本站实际控制的任何网页上的内容，本站不承担任何责任。<br />
                        &nbsp;&nbsp;7.4 对于因不可抗力或本站不能控制的原因造成的网络服务中断或其它缺陷，本站不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。<br />
                        &nbsp;&nbsp;7.5 对于站向用户提供的下列产品或者服务的质量缺陷本身及其引发的任何损失，本站无需承担任何责任：<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(1)本站向用户免费提供的各项网络服务；<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(2)本站向用户赠送的任何产品或者服务。<br />
                        &nbsp;&nbsp;7.6 本站有权于任何时间暂时或永久修改或终止本服务(或其任何部分)，而无论其通知与否，本站对用户和任何第三人均无需承担任何责任。<br />
                        八、附则<br />
                        &nbsp;&nbsp;8.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。 <br />
                        &nbsp;&nbsp;8.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。<br />
                        &nbsp;&nbsp;8.3 本协议解释权及修订权归湖南恩尔伊网络科技有限公司所有。<br />
                  </p>
      </el-dialog>
  </page-model>
</template>
<script>
import { OnlyNumber } from '@/lib/validateForm';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import PageModel from './components/page_model';


export default {
  components: {
    PageModel,
  },
  mixins: [mixin],
  data() {
    const vCode = (rule, value, callback) => {
      const val = String(value).replace(/\s+/g, '').split(''); // 先去掉所有空格 然后将字符串转换成数组
      if (val.length === 0) {
        return callback(Error('验证码不能为空'));
      } else if (val.length !== 6 && !OnlyNumber(val)) {
        return callback(Error('验证码必须是六位数的数字'));
      }
      return callback();
    };
    const vEmail = (rule, value, callback) => {
      // eslint-disable-next-line
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!reg.test(value)) {
        return callback(Error('请输入正确的邮箱'));
      }
      if (value === '') {
        return callback(Error('邮箱不能为空'));
      }
      return callback();
    };
    const vPassword = (rule, value, callback) => {
      const val = String(value).replace(/\s+/g, '').split(''); // 先去掉所有空格 然后将字符串转换成数组
      if (val.length === 0) {
        return callback(Error('密码不能为空'));
      } else if (val.length !== 0 && val.length < 6) {
        return callback(Error('密码至少为6位字符'));
      }
      return callback();
    };
    const vWarehouseName = (rule, value, callback) => {
      if (value === '') {
        return callback(Error('仓库名称不能为空'));
      }
      return callback();
    };
    const vWarehouseArea = (rule, value, callback) => {
      if (!value) {
        return callback(Error('仓库面积不能为空'));
      } else if (!OnlyNumber(value)) {
        return callback(Error('仓库面积只能为数字'));
      }
      return callback();
    };
    return {
      rules: {
        email: [
          { validator: vEmail, required: true, tigger: 'bulr' },
        ],
        code: [
          { validator: vCode, required: true, tigger: 'bulr' },
        ],
        password: [
          { validator: vPassword, required: true, tigger: 'bulr' },
        ],
        // password_confirmation: [
        //   { validator: vPasswordConfirmation, required: true, tigger: 'bulr' },
        // ],
        warehouse_name: [
          { validator: vWarehouseName, required: true, trigger: 'blur' },
        ],
        warehouse_area: [
          { validator: vWarehouseArea, required: true, trigger: 'blur' },
        ],
      },
      tips: false,
      showInfo: false,
      input_type: true, // 密码显示开关
      keep: false, // 同意用户协议 默认为 true
      sendVerCode: '发送验证码',
      sendVerCodePhone: '发送短信验证码',
      flag: true, // 禁用发送验证码标志，默认为 true
      activeName: 'email',
      form: {
        type: 'email',
        email: '', // 用户邮箱
        code: '', // 验证码
        password: '', // 密码
        warehouse_name: '', // 仓库名称
        warehouse_area: '', // 仓库面积
      },
      formPhone: {
        type: 'mobile',
        code: '', // 验证码
        password: '', // 密码
        warehouse_name: '', // 仓库名称
        warehouse_area: '', // 仓库面积
        mobile: '', // 用户手机号
      },
      vPicture: '',
      vEmailPicture: '',
      verifyCode: '',
      style: {
        OperateStylePhonePicture: {
          display: 'none',
        },
        OperateStyleEmailPicture: {
          display: 'none',
        },
      },
      verifyPhone: {
        captcha_key: '', // 图片验证(后台返回)
        captcha: '', // 图片验证码(填写的)
      },
    };
  },
  computed: {
    visible() {
      if (this.form.email) {
        return true;
      }
      this.$message({
        type: 'error',
        message: '请输入邮箱',
      });
      return false;
    },
  },
  watch: {
    activeName() {
      this.style.OperateStylePhonePicture.display = 'none';
      this.verifyPhone.captcha_key = '';
      this.verifyPhone.captcha = '';
    },
  },
  methods: {
    handlerGetPhoneCode() {
      if (this.checkInputPhone(this.formPhone.mobile)) {
        const info = {
          mobile: this.formPhone.mobile,
          captcha_key: this.verifyPhone.captcha_key,
          captcha: this.verifyPhone.captcha,
        };
        $http.getVerificationPhoneCode(info)
          .then((res) => {
            if (!res.status) return;
            this.$message({
              type: 'success',
              message: '发送成功，请查收!',
            });
            this.style.OperateStylePhonePicture.display = 'none';
          });
      }
    },
    handlerGetEmailCode() {
      if (this.checkInputEmail(this.form.email)) {
        const info = {
          email: this.form.email,
          captcha_key: this.verifyPhone.captcha_key,
          captcha: this.verifyPhone.captcha,
        };
        $http.getVerificationEmailCode(info)
          .then((res) => {
            if (!res.status) return;
            this.$message({
              type: 'success',
              message: '发送成功，请查收!',
            });
            this.style.OperateStyleEmailPicture.display = 'none';
          });
      }
    },
    handlerCloseVerifyBox() {
      this.style.OperateStylePhonePicture.display = 'none';
      this.style.OperateStyleEmailPicture.display = 'none';
      this.verifyPhone.captcha = '';
    },
    handlerOpenCaptcha(flag) {
      $http.openCaptcha().then((res) => {
        this.vPicture = '';
        this.vEmailPicture = '';
        if (flag === 'phone') {
          this.vPicture = res.data.captcha; // 显示图片
        }
        if (flag === 'email') {
          this.vEmailPicture = res.data.captcha; // 显示图片
        }
        this.verifyPhone.captcha_key = res.data.captcha_key; // 缓存 key
      });
    }, // 验证码
    handlerClose() {
      this.keep = true;
    },
    user_agreement_dialog() {
      this.showInfo = true;
      this.keep = true;
    }, // 处理用户协议弹窗
    goRegister(flag) {
      if (flag === 'phone') {
        this.$refs.register.validate((valid) => {
          if (valid) {
            if (!this.keep) {
              this.$message({
                type: 'error',
                message: '用户协议必选!',
              });
              return;
            }
            $http.register(this.formPhone)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '注册成功!',
                });
                // 跳转到登陆页
                this.$router.replace({
                  name: 'login',
                });
              });
          }
        });
      }
      if (flag === 'email') {
        this.$refs.registerEmail.validate((valid) => {
          if (valid) {
            if (!this.keep) {
              this.$message({
                type: 'error',
                message: '用户协议必选!',
              });
              return;
            }
            $http.register(this.form)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '注册成功!',
                });
                // 跳转到登陆页
                this.$router.replace({
                  name: 'login',
                });
              });
          }
        });
      }
    }, // 登录
    /**
     * 发送验证码
     * 大致思路：
     * post表单请求,获取响应之后判断 status值，然后进行定时操作
     */
    sendVerificationCodeForEmail(val, flag) {
      if (flag) {
        if (this.style.OperateStyleEmailPicture.display === 'block') {
          return;
        }
      }
      if (this.checkInputEmail(val)) {
        this.style.OperateStyleEmailPicture.display = 'block';
        this.handlerOpenCaptcha('email');
      }
    },
    sendVerificationCodeForPhone(val, flag) {
      if (flag) {
        if (this.style.OperateStylePhonePicture.display === 'block') {
          return;
        }
      } // flag 用于区分获取图片验证码的情形， true为电话 input框的操作， false 为图片验证码弹窗的操作
      if (this.checkInputPhone(val)) {
        this.style.OperateStylePhonePicture.display = 'block';
        this.handlerOpenCaptcha('phone');
        // $http.getVerificationEmailCode({ email: this.form.email })
        //   .then((res) => {
        //     // 计时函数
        //     function timer60s(that) {
        //       // 进入定时阶段，无法响应点击事件
        //       that.flag = false;
        //       // 定时 60s
        //       let time = 60;
        //       // eslint-disable-next-line
        //       let timer = null;
        //       timer = setInterval(() => {
        //         time -= 1;
        //         // 实时文字显示
        //         that.$data.sendVerCode = `${time}s 后，重新获取`;
        //         if (time === 0) {
        //           // 计时完毕,清除定时器
        //           clearInterval(timer);
        //           // 开放点击事件
        //           that.flag = true;
        //           // 更新显示文字
        //           that.$data.sendVerCodePhone = '发送短信验证码';
        //         }
        //       }, 1000);
        //     }
        //     // 验证码发送成功
        //     if (+res.status === 0) {
        //       // 开始计时
        //       const that = this;
        //       timer60s(that);
        //     }
        //   });
      }
    },
    checkInputPhone(val) {
      if (!val) {
        this.$message({
          type: 'error',
          message: '请输入手机号',
        });
        return;
      }
      if (!OnlyNumber(val) || !(`${val}`.length === 11)) {
        this.$message({
          type: 'error',
          message: '请输入正确的手机号',
        });
        return;
      }
      return true;
    },
    checkInputEmail(val) {
      if (!this.form.email) {
        this.$message({
          type: 'error',
          message: '请输入邮箱',
        });
        return;
      }
      // eslint-disable-next-line
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!reg.test(val)) {
        this.$message({
          type: 'error',
          message: '请输入正确的邮箱',
        });
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="less" module>
@import '../../less/public_variable.less';

.input_item {
  margin-top: 10px;
  .item_email {
    margin-top: -8px;
  }
  .item_phone {
    margin-top: -8px;
  }
  .item_picture {
    width: 357px;
    height: 180px;
    background-color: rgb(243, 243, 236);
    position: absolute;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    top: 40px;
    left: 0;
    z-index: 9999;
    animation: bounce-in .5s ease-in-out;
    @keyframes bounce-in {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.5);
      }
      100% {
        transform: scale(1);
      }
    }
    .item_picture_main {
      position: relative;
    }
    .item_picture_title {
      text-align: center;
      margin: 25px 0 0 0;
    }
    .item_picture_input {
      margin: 20px 0 0 0;
    }
    .item_picture_btn {
      margin: 22px 0 0 0;
    }
  }
  .item_verificationCode {
    margin-top: -8px;
  }
  .item_password {
    margin-top: -8px;
  }
  .item_passwordConfirmation {
    margin-top: -8px;
  }
  .item_warehouseName {
    margin-top: -8px;
  }
  .item_warehouseSpace {
    margin-top: -8px;
  }
  .save_user_info {
    position: relative;
    top: -10px;
    .item_user_info {
        display: flex;
        flex-flow: row wrap;
        .user_agreement {
          color: @ThemeColor;
        }
    }
  }
}

</style>
<style lang="less">
.user_account_exist {
  position: relative;
  top: -30px;
  font-size: 18px;
  color: #5745C5;
  width: 100%;
  text-align: center;
  font-weight:400;
  line-height:24px;
  cursor: pointer;
}
.user_login_button {
  position: relative;
  top: -30px;
}
</style>
<style>
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }

</style>
