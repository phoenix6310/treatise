<template>
  <div class="navbar">
    <div class="head-right">
      <div class="user-log-out" v-if='roles.length'>
        <div class="user-log-out-btn" @click="logout">退出</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["roles"])
  },
  methods: {
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/mixin.scss';
.navbar {
  top: 0;
  height: 60px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  background-color: #6164ff;
  color: #ffffff;
  .bar-logo {
    float: left;
    width: 30px;
    height: 30px;
    margin-left: 60px;
    margin-top: 14px;
  }
  .bar-title {
    float: left;
    // width: 180px;
    height: 25px;
    margin-top: 18px;
    font-size: 18px;
    line-height: 25px;
    font-family: PingFangSC-Medium;
    color: #ffffff;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  // 报名参赛
  .head-right {
    @include clearfix;
    float: right;
    font-size: 14px;
    margin-top: 18px;
    .sign-up-for-competion {
      float: left;
      margin-right: 30px;
      cursor: pointer;
      .sufc-btn{
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 40px;
        background-color: #FFAD44;
      }
    }
    .show-user-name{
      float: left;
      line-height: 30px;
      margin-right: 30px;
      cursor: pointer;
      @include clearfix;
      .user-logo{
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: middle;
        margin-right: 4px
      }
      .user-name{
        float: right;
      }
    }
    .user-log-out{
      float: left;
      line-height: 30px;
      margin-right: 30px;
      cursor: pointer;
      @include clearfix;
      img{
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: middle;
        margin-right: 4px
      }
      .user-log-out-btn{
        float: right;
      }
    }
  }
}
</style>

