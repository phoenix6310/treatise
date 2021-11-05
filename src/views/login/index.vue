<template>
  <div class="login_wrap">
    <div class="login_bg_1">
      <div class="description_container">
        <div class="title">重要通知</div>
        <ul>
          <li>
            为推进川渝高校信息素养大赛的顺利举办，帮助各校图书馆更好地指导学生参赛，组委会将于
            2021年11月2日（星期二）上午9:30举办线上赛前培训。培训将对大赛的知识模块等相关信息作进一步讲解和培训，请各本科活动负责人（联系人或指导教师）届时积极组织本校学生参加会议。为推进川渝高校信息素养大赛的顺利举办，帮助各校图书馆更好地指导学生参赛，组委会将于
            2021年11月2日（星期二）上午9:30举办线上赛前培训。
          </li>
          <li>
            培训将对大赛的知识模块等相关信息作进一步讲解和培训，请各本科活动负责人（联系人或指导教师）届时积极组织本校学生参加会议。为推进川渝高校信息素养大赛的顺利举办，帮助各校图书馆更好地指导学生参赛，组委会将于
            2021年11月2日（星期二）上午9:30举办线上赛前培训。培训将对大赛的知识模块等相关信息作进一步讲解和培训，请各本科活动负责人（联系人或指导教师）届时积极组织本校学生参加会议。
          </li>
        </ul>
      </div>
      <div class="login_container">
        <div class="form_wrap">
          <div class="page_title">登录</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            label-width="80px"
            :rules="rules"
          >
            <el-form-item label="账号" prop="account">
              <el-input
                v-model="loginForm.account"
                placeholder="请输入账号"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="login_btn_container">
                <el-button type="primary" @click="onSubmit('loginForm')"
                  >登录</el-button
                >
                <span
                  class="to_apabi_service"
                  @click="showApabiService = !showApabiService"
                  >联系客服</span
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="apabi_service_wrap" v-show="showApabiService">
          <div class="kaola_qrcode_wrap">
            <img src="@/assets/kaola_qrcode.jpg" alt="" />
          </div>
          <div class="apabi_service">
            <div>扫码关注</div>
            <div>在线客服</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showApabiService: false,
      loginForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    onSubmit(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log("submit!");
          const formData = new FormData();
          formData.append("account", this.loginForm.account.trim());
          formData.append("password", this.loginForm.password.trim());

          console.log(formData);

          this.$store
            .dispatch("Login", formData)
            .then((res) => {
              // 登录成功
              console.log(res, "Login");
              this.$router.push("/competition");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login_wrap {
  height: 100%;
  background-image: url("~@/assets/login/login_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  min-width: 1332px;
  overflow: hidden;
  .login_bg_1 {
    margin: 0 auto;
    width: 1332px;
    height: 674px;
    background-image: url("~@/assets/login/login_bg_1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    bottom: -10px;
    margin-left: -666px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &:after {
      content: "";
      position: absolute;
      width: 756px;
      height: 258px;
      background-image: url("~@/assets/login/login_bg_2.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      bottom: -10px;
      left: 50%;
      margin-left: -420px;
    }
    .description_container {
      width: 730px;
      height: 320px;
      border: 1px solid #fff;
      border-radius: 8px;
      margin-top: -100px;
      color: #fff;
      box-sizing: border-box;
      padding: 0 20px;
      .title {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        line-height: 36px;
      }
      ul {
        list-style: none;
        li {
          text-indent: 2em;
          text-align: justify;
          line-height: 1.7;
        }
      }
    }
    .login_container {
      margin-top: -144px;
      position: relative;
      .form_wrap {
        .page_title {
          font-weight: bold;
          line-height: 2;
          font-size: 20px;
          text-align: center;
          margin-bottom: 10px;
          color: #409eff;
        }
        width: 360px;
        border: 1px solid #dcdfe6;
        padding: 20px 40px 20px 20px;
        border-radius: 8px;
        background-color: #fff;
      }
      .apabi_service_wrap {
        background-color: #fff;
        position: absolute;
        border-radius: 8px;
        right: 0;
        bottom: -200px;
        overflow: hidden;
        .kaola_qrcode_wrap {
          img {
            width: 100px;
            height: 100px;
          }
        }
        .apabi_service {
          text-align: center;
          line-height: 1.6;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  // col-xs
}

@media (min-width: 768px) and (max-width: 991px) {
  // col-sm
}

@media (min-width: 992px) and (max-width: 1199px) {
  // col-md
  .login_wrap {
    .login_container {
    }
  }
}
@media (min-width: 1200px) and (max-width: 1600px) {
  // col-lg
  .login_wrap {
    .login_container {
    }
  }
}
// @media (min-width: 1500px) {
//    // col-lg
// }
</style>

<style lang="scss">
.login_btn_container {
  display: flex;
  justify-content: space-between;
  .to_apabi_service {
    cursor: pointer;
    // background-color: red;
  }
}
</style>