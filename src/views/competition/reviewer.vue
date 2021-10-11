<template>
  <div class="viewer_wrap">
    <div class="reviewer_info_wrap w1200">
      <UserInfo :userData="userData" class="user_info_container"></UserInfo>
    </div>
    <div class="table_title w1200">评分列表</div>
    <component :is="componentId"></component>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ReviewStudent from "./components/reviewStudent.vue";
import ReviewTeacher from "./components/reviewTeacher.vue";
import UserInfo from "./components/info.vue";
export default {
  data() {
    return {
      componentId: "",
    };
  },
  
  components: {
    ReviewStudent,
    ReviewTeacher,
    UserInfo,
  },
  mounted() {
    if (this.userData.dissData.type === 1) {
      this.componentId = ReviewStudent;
    } else {
      this.componentId = ReviewTeacher;
    }
  },
  computed: {
    ...mapGetters(["userData"]),
  },
};
</script>

<style lang="scss">
.viewer_wrap {
  .reviewer_info_wrap {
    margin-top: 20px;
  }
  .table_title {
    line-height: 1.7;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>