<template>
  <div class="review_student_wrap w1200">
    <div class="table_title w1200">评分列表</div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      tooltip-effect="dark"
    >
      <el-table-column type="index" width="50" label="编号"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="userNo" label="学号"> </el-table-column>
      <el-table-column label="提前分">
        <template slot-scope="scope">
          <div class="pre_score_wrap">
            <el-input
              size="mini"
              v-model="scope.row.preScore"
              class="pre_score_input"
            ></el-input>
            <el-button
              size="mini"
              @click="updatePreScore(scope.row)"
              type="primary"
              >更新</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="总评分"> </el-table-column>
      <el-table-column prop="totalScore" label="已评分数"> </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="scoreEdit(scope.row)" type="primary"
            >评分</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getProgress } from "@/api/user";
import { updatePreScore } from "@/api/upload";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  async created() {
    let progressListRes = await getProgress();
    if (progressListRes.code === 1) {
      let { data } = progressListRes;
      console.log(data);
      data.map((item) => {
        try {
          item.preScore = item.scores[0].preScore;
          item.totalScore = item.scores[0].totalScore;
        } catch (error) {}
      });
      this.tableData = data;
    }
  },
  methods: {
    scoreEdit(rowData) {
      console.log(rowData);
      localStorage.setItem(rowData.userId, JSON.stringify(rowData));
      this.$router.push({
        path: `/competition/studentScore/${rowData.userId}`,
        query: {
          name: rowData.name,
          userNo: rowData.userNo,
        },
      });
    },
    async updatePreScore(rowData) {
      console.log(rowData);
      let res = await updatePreScore({
        userId: rowData.userId,
        score: rowData.preScore,
      });
      if (res.code === 1) {
        this.$message({
          type: "success",
          message: "已更新",
          duration: 3000,
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
          duration: 3000,
        });
      }
    },
  },
};
</script>
<style lang="scss">
.review_student_wrap {
  .table_title {
    line-height: 1.7;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .pre_score_wrap {
    display: flex;
    .pre_score_input {
      margin-right: 10px;
    }
  }
}
</style>