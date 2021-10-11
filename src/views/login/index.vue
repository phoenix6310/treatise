<template>
  <div class="login_wrap">
    <div class="title_wrap">
      <div class="title_cn">知识随需获得，文化深远传播</div>
      <div class="title_en">
        Gain knowledge as long as you want,spread culture sa far as it may
      </div>
    </div>

    <div class="form_wrap">
      <el-form
        ref="loginForm"
        :model="loginForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="邮箱" prop="email">
          <el-row>
            <el-col :span="14"
              ><el-input v-model="loginForm.email"></el-input
            ></el-col>
            <el-col :span="8" :offset="2"
              ><el-button @click="sendCode">发送验证码</el-button></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="loginForm.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('loginForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendEmailCode } from "@/api/user";
export default {
  data() {
    var validateemail = (rule, value, callback) => {
      this.rightEmail = false;
      let reg =
        /^[\_A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的邮箱!"));
      } else {
        this.rightEmail = true;
        callback();
      }
    };
    return {
      rightEmail: false,
      loginForm: {
        email: "",
        code: "",
      },
      rules: {
        email: [{ required: true, validator: validateemail, trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
          formData.append("email", this.loginForm.email.trim());
          formData.append("vcode", this.loginForm.code.trim());
          this.$store
            .dispatch("Login", formData)
            .then((res) => {
              // 登录成功
              console.log(res, 'Login')
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
    async sendCode() {
      if (!this.loginForm.email) {
        this.$message({
          message: "请输入邮箱",
          type: "error",
        });
      } else if (this.rightEmail) {
        // 发送验证码
        console.log("发送验证码", this.loginForm.email);
        let res = await sendEmailCode({
          email: this.loginForm.email.trim(),
          type: 1,
        });
        if (res.code === 1) {
          this.$message({
            type: "success",
            message: `已发送验证码至邮箱：${this.loginForm.email.trim()}`,
            duration: 3000,
          });
        } else {
          this.$message({
            type: "error",
            message: res.message,
            duration: 3000,
          });
          this.isUpload = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login_wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .title_wrap {
    margin-top: -20%;
    margin-right: 10%;
    .title_cn {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .title_en {
    }
  }

  .form_wrap {
    margin-top: -20%;
    width: 500px;
    border: 1px solid #dcdfe6;
    padding: 20px 40px 20px 20px;
    border-radius: 8px;
  }
}
</style>