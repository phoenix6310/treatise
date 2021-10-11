<template>
  <div class="review_teacher_wrap w1200">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      tooltip-effect="dark"
    >
      <el-table-column prop="date" label="编号" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getProgress } from "@/api/user";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  async created() {
    let progressListRes = await getProgress();
    if (progressListRes.code === 1) {
      const { data } = progressListRes;
      console.log(data);
    }
  },
};
</script>
<style lang="scss">
</style>