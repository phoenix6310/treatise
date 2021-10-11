<template>
  <div class="student_score_info_wrap w1200">
    <el-card class="box-card participant_info_wrap" shadow="hover">
      <ul class="participant_info">
        <li class="info_item">姓名： {{ participantInfo.name }}</li>
        <li class="info_item">学号： {{ participantInfo.userNo }}</li>
      </ul>
    </el-card>
    <el-card class="box-card score_wrap" shadow="hover">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
      >
        <ul class="rule_detail_container">
          <li class="rule_item">
            <div class="rule_item_0">指标</div>
            <div class="rule_item_1">指标说明</div>
            <div class="rule_item_2">分数(分)</div>
          </li>
          <li
            class="rule_item"
            v-for="(ruleItem, index) in ruleForm.entrytVoList"
            :key="`parent-${index}`"
          >
            <div class="rule_item_0">
              <div class="rule_title">
                <span class="rule_name">{{ ruleItem.name }}</span>
                <span>
                  {{ `【0 ~ ${ruleScoreItem[index].templateScore}】` }}
                </span>
              </div>
              <div class="rule_item_total_score">
                总分：{{ ruleScoreItem[index].score }}分
              </div>
            </div>
            <ul>
              <li
                v-for="(innerRuleItem, innerIndex) in ruleItem.children"
                :key="`child-${index}-${innerIndex}`"
                class="rule_inner_item"
              >
                <div class="rule_item_1">
                  <span class="rule_detail">{{ innerRuleItem.name }}</span>
                  <span class="score_scope_wrap">
                    【分数范围：<span class="score_scope">
                      {{
                        innerRuleItem.templateScore >= 0
                          ? `0 ~ ${innerRuleItem.templateScore}`
                          : `${innerRuleItem.templateScore} ~ 0`
                      }} </span
                    >】
                  </span>
                </div>
                <div class="rule_item_2">
                  <el-input
                    v-model="innerRuleItem.score"
                    size="small"
                  ></el-input>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :disabled="isUpload"
            >提交评分</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {uploadScores} from '@/api/upload.js'
export default {
  data() {
    return {
      isUpload: false,
      participantInfo: {},
      ruleForm: {
        entrytVoList: [
          // {
          //   name: "总览",
          //   info: "",
          //   children: [
          //     {
          //       name: "调研报告字数报告在规定字数范围内（5分，图片、表格及参考文献著录不计入字数）",
          //       templateScore: "5",
          //       score: "",
          //       info: "",
          //     },
          //     {
          //       name: "答辩内容严谨连续，见解独到，逻辑清晰，专业度高，并有正确的思想导向",
          //       templateScore: 10,
          //       score: "",
          //       info: "",
          //     },
          //   ],
          // },
          // {
          //   name: "答辩表现",
          //   info: "",
          //   children: [
          //     {
          //       name: "语言规范，口齿清晰，表达准确、流畅、自然",
          //       templateScore: 2,
          //       score: "",
          //       info: "",
          //     },
          //     {
          //       name: "精神饱满，表现恰当",
          //       templateScore: 4,
          //       score: "",
          //       info: "",
          //     },
          //     {
          //       name: "上下场致意，答谢",
          //       templateScore: 2,
          //       score: "",
          //       info: "",
          //     },
          //     {
          //       name: "着装不得体，不自然大方",
          //       templateScore: -2,
          //       score: "",
          //       info: "",
          //     },
          //   ],
          // },
        ],
      },
      rules: {},
      userId: "",
    };
  },
  created() {
    let participantInfo = {};
    let queryData = this.$route.query;
    Object.assign(participantInfo, {
      name: queryData.name,
      userNo: queryData.userNo,
    });
    this.userId = this.$route.params.userId;
    this.participantInfo = participantInfo;
    try {
      let userInfo = JSON.parse(localStorage.getItem(this.userId));
      console.log(userInfo);
      let entrytVoList = [];
      let _entrytVoList = userInfo.scores[0].entrytVoList;
      _entrytVoList.map((wrapRule) => {
        let wrapRuleInfo = {
          name: wrapRule.entryName,
          children: [],
        };
        wrapRule.scoreListVoList.map((innerRule) => {
          let innerRuleInfo = {
            id: innerRule.id,
            name: innerRule.categoryName,
            templateScore: innerRule.templateScore,
            score: innerRule.score,
          };
          wrapRuleInfo.children.push(innerRuleInfo);
        });
        entrytVoList.push(wrapRuleInfo);
      });
      Object.assign(this.ruleForm, {
        entrytVoList,
      });
    } catch (error) {}
  },
  computed: {
    ruleScoreItem() {
      let scores = [];
      this.ruleForm.entrytVoList.map((item) => {
        let templateScore = 0;
        let score = 0;
        item.children.map((innerItem) => {
          if (innerItem.templateScore >= 0) {
            templateScore += +innerItem.templateScore;
          }
          score += +innerItem.score;
        });
        scores.push({
          score,
          templateScore,
        });
      });
      return scores;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
         this.isUpload = true;
          let formData = {
            userId: this.userId,
            datas: [],
          };
          this.ruleForm.entrytVoList.map((wrapItem) => {
            wrapItem.children.map((innerItem) => {
              formData.datas.push({
                id: innerItem.id,
                score: innerItem.score,
              });
            });
          });
          console.log(formData)
          let res = await uploadScores(formData)
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "已提交评分",
              duration: 3000,
            });
            this.$router.push({
              path: "/competition/reviewer",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
              duration: 3000,
            });
            this.isUpload = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.student_score_info_wrap {
  padding-top: 20px;
  padding-bottom: 50px;
  .participant_info_wrap {
    .participant_info {
      list-style: none;
      // margin: 0;
      // padding: 0;
    }
  }
  .score_wrap {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .rule_detail_container {
    .rule_item {
      line-height: 1.4;
      display: flex;
      margin-bottom: 10px;
      .rule_inner_item {
        margin-bottom: 10px;
      }
      .rule_item_0 {
        width: 220px;
      }
      .rule_item_1 {
        width: 500px;
        margin: 0 10px;
      }
      .rule_item_2 {
        width: 220px;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          display: flex;
          .rule_item_1 {
            width: 500px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>