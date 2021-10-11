<template>
  <div class="user_info_wrap">
    <el-card class="box-card" shadow="hover">
      <div class="info_title">
        账号信息：
      </div>
      <ul class="info_container">
        <li>姓名： {{ userData.name }}</li>
        <li v-if="userData.userType === 1">学号： {{ userData.userNo }}</li>
        <li v-if="userData.userType === 2">编号： {{ userData.userNo }}</li>
        <li>院校： {{ userData.collegeName }}</li>
        <li>竞赛名称： {{ userData.dissName }}</li>
        <!-- <li>
          评分规则:
          <span class="rule_wrap">
            点击阅读<span class="hightLight">《评分规则》</span></span
          >
        </li> -->
        <li v-if="userData.userType === 1 || userData.userType === 2">
          已上传文件： {{ historyFileName }}
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
export default {
  props: ["userData"],
  computed: {
    historyFileName() {
      if (this.userData.fileData && this.userData.fileData[0]) {
        return this.userData.fileData[0].fileName;
      } else {
        return "暂未上传";
      }
    },
  },
};
</script>
<style lang="scss">
.user_info_wrap {
  .info_container {
    list-style: none;
    li {
      line-height: 1.6;
      .rule_wrap {
        cursor: pointer;
        .hightLight {
          color: #6164ff;
        }
      }
    }
  }
}
</style>