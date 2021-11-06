<template>
  <div class="navbar">
    <div class="navbar_container">
      <div class="app_title">川渝信息素养省赛专用系统</div>
      <div class="head_right">
        <div class="user-log-out" v-if="roles.length">
          <div class="user_info_wrap">
            <span class="user_info_title">
              选手信息：
              <span class="user_name">
                {{ userData.name }}
              </span>
              <span class="user_NO">
                {{ userData.userNo }}
              </span>
              <span class="user_school">
                {{ userData.collegeName }}
              </span>
              <span class="user_province">
                {{ userData.proviceName }}
              </span>
            </span>
          </div>
          <div class="user-log-out-btn" @click="logout">退出</div>
        </div>
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
    ...mapGetters(["roles", "userData"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/mixin.scss";
.navbar {
  top: 0;
  height: 60px;
  line-height: 60px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  background: linear-gradient(90deg, #4baffc, #469bfd, #3b69ff);
  color: #ffffff;
  .navbar_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px;
  }
  .head_right {
    line-height: 24px;
    .user-log-out {
      .user-log-out-btn {
        cursor: pointer;
      }
    }
  }
}
</style>

