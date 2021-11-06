<template>
  <div class="viewer_wrap">
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
}
</style>