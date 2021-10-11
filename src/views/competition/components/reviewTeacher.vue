<template>
  <div class="review_teacher_wrap w1200">
    <el-card class="box-card videro_player_wrap" shadow="hover">
      <div class="video_info_title_wrap">
        <div class="video_info_title">待评审微课教师信息：</div>
      </div>
      <ul class="video_info_wrap">
        <template v-if="currentVideoInfos">
          <!-- <li>currentVideoInfos： {{ currentVideoInfos }}</li> -->
          <li>姓名： {{ currentVideoInfos.name }}</li>
          <li>学校： {{ currentVideoInfos.collegeName }}</li>
        </template>
        <template v-if="videoFileData">
          <!-- <li>videoFileData： {{ videoFileData }}</li> -->
          <li>视频标题： {{ videoFileData.fileTitle }}</li>
          <li>视频介绍： {{ videoFileData.fileInfo }}</li>
        </template>

        <!-- <li>姓名： {{ videoFileData.name }}</li> -->
      </ul>
      <template v-if="currentVideoInfos">
        <div v-if="videoFileData">
          <video
            id="player-container-id"
            preload="auto"
            class="play_video"
            playsinline
            webkit-playinline
            x5-playinline
            v-if="showVideoEl"
          ></video>
        </div>
        <div v-else class="no_video_tip">
          {{ `教师：${this.currentVideoInfos.name} 未上传视频,请为下一位教师评分（点按钮【下一个视频】）` }}
        </div>
      </template>

      <div class="video_control_wrap">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="percentage"
        ></el-progress>
        <div class="next">
          <el-button
            size="small"
            type="success"
            @click="nextVideo"
            :disabled="nextVideoBtnDisabled"
            >下一个视频</el-button
          >
        </div>
      </div>
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
            :disabled="isUpload || !videoFileData"
            >提交评分</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getProgress } from "@/api/user";
import { uploadScores, updateReviewVideoProgress } from "@/api/upload.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      fileId: "",
      ocwPlayer: null,
      ruleForm: {
        entrytVoList: [
          {
            name: "总览",
            info: "",
            children: [
              {
                name: "调研报告字数报告在规定字数范围内（5分，图片、表格及参考文献著录不计入字数）",
                templateScore: "5",
                score: "",
                info: "",
              },
              {
                name: "答辩内容严谨连续，见解独到，逻辑清晰，专业度高，并有正确的思想导向",
                templateScore: 10,
                score: "",
                info: "",
              },
            ],
          },
          {
            name: "答辩表现",
            info: "",
            children: [
              {
                name: "语言规范，口齿清晰，表达准确、流畅、自然",
                templateScore: 2,
                score: "",
                info: "",
              },
              {
                name: "精神饱满，表现恰当",
                templateScore: 4,
                score: "",
                info: "",
              },
              {
                name: "上下场致意，答谢",
                templateScore: 2,
                score: "",
                info: "",
              },
              {
                name: "着装不得体，不自然大方",
                templateScore: -2,
                score: "",
                info: "",
              },
            ],
          },
        ],
      },
      rules: {},
      isUpload: false,
      nextVideoBtnDisabled: false,
      showVideoEl: true,
      currentIndex: 0,
      initIndex: 0,
      appID: "1258658963",
    };
  },
  async created() {
    // this.updateReviewVideoProgress();
    let progressListRes = await getProgress();
    if (progressListRes.code === 1) {
      let { data: dataList } = progressListRes;
      console.log(dataList);
      dataList.map((item) => {
        item.isCompelete = false;
      });
      this.dataList = dataList;
      // 初始化进度
      this.initIndex = this.currentIndex = this.userData.progress;
      if (this.currentVideoInfos) {
        console.log(this.currentVideoInfos);
        let fileInfo = this.currentVideoInfos.fileData[0];
        if (fileInfo) {
          this.fileId = JSON.parse(fileInfo.filePath).fileId;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["userData"]),
    dataListLength() {
      return this.dataList.length;
    },
    currentVideoInfos() {
      if (this.dataListLength) {
        return this.dataList[this.currentIndex];
      } else {
        return null;
      }
    },
    videoFileData() {
      if (this.currentVideoInfos) {
        return this.currentVideoInfos.fileData[0];
      } else {
        return null;
      }
    },
    percentage() {
      if (this.dataListLength) {
        return parseInt(((this.currentIndex + 1) * 100) / this.dataListLength);
      } else {
        return 0;
      }
    },
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
  watch: {
    fileId(newFileId) {
      console.log(newFileId);
      if (newFileId) {
        // if (this.ocwPlayer) {
        //   // this.ocwPlayer.dispose();
        //   this.showVideoEl = false;
        //   this.showVideoEl = true;
        // }
        this.$nextTick(() => {
          this.startPlay(newFileId);
          this.updateEntrytVoList();
        });
      }
    },
  },
  methods: {
    updateReviewVideoProgress() {
      let progressFormData = new FormData();
      progressFormData.append("progress", ++this.currentIndex);
      updateReviewVideoProgress(progressFormData);
    },
    nextVideo() {
      this.currentIndex += 1;
      let fileInfo = this.currentVideoInfos.fileData[0];
      console.log(this.currentIndex, fileInfo);

      if (fileInfo) {
        this.fileId = JSON.parse(fileInfo.filePath).fileId;
        if (this.currentIndex == this.dataList.length - 1) {
          this.nextVideoBtnDisabled = true;
        }
      } else {
        this.$message({
          type: "error",
          message: `教师：${this.currentVideoInfos.name} 未上传视频`,
          duration: 3000,
        });
      }
    },
    updateEntrytVoList() {
      let entrytVoList = [];
      let _entrytVoList = this.currentVideoInfos.scores[0].entrytVoList;
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
    },
    startPlay(fileId) {
      if (this.initIndex === this.currentIndex) {
        this.ocwPlayer = TCPlayer("player-container-id", {
          // player-container-id 为播放器容器ID，必须与html中一致
          fileID: fileId, // 请传入需要播放的视频filID 必须
          appID: this.appID, // 请传入点播账号的appID 必须
          // autoplay: true, //是否自动播放
          //definition: '40',  //指定播放参数为40的清晰度视频
          plugins: {
            ContinuePlay: {
              //开启续播功能
              //auto: true //是否在视频播放后自动续播
              text: "上次播放至", //[可选]提示文案
              //btntext: '恢复播放' // [可选]按钮文案
            },
          },
          controlBar: {
            currentTimeDisplay: true,
          },
          //其他参数请在开发文档中查看    地址：https://cloud.tencent.com/document/product/266/14603
        });
      } else {
        if (!this.ocwPlayer) {
          this.ocwPlayer = TCPlayer("player-container-id", {
            // player-container-id 为播放器容器ID，必须与html中一致
            fileID: fileId, // 请传入需要播放的视频filID 必须
            appID: this.appID, // 请传入点播账号的appID 必须
            // autoplay: true, //是否自动播放
            //definition: '40',  //指定播放参数为40的清晰度视频
            plugins: {
              ContinuePlay: {
                //开启续播功能
                //auto: true //是否在视频播放后自动续播
                text: "上次播放至", //[可选]提示文案
                //btntext: '恢复播放' // [可选]按钮文案
              },
            },
            controlBar: {
              currentTimeDisplay: true,
            },
            //其他参数请在开发文档中查看    地址：https://cloud.tencent.com/document/product/266/14603
          });
        } else {
          this.ocwPlayer.loadVideoByID({ fileID: fileId, appID: this.appID });
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.isUpload = true;
          let formData = {
            userId: this.currentVideoInfos.userId,
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
          console.log(formData);
          // return;
          let res = await uploadScores(formData);
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "已提交评分",
              duration: 3000,
            });
            // 保存进度
            this.updateReviewVideoProgress();
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
  beforeRouteLeave(to, from, next) {
    this.ocwPlayer.dispose();
    next();
  },
};
</script>
<style lang="scss">
.review_teacher_wrap {
  padding-bottom: 50px;
  .videro_player_wrap {
    margin: 20px 0;
  }
  .video_info_wrap {
    list-style: none;
  }
  .no_video_tip{
    color: #f56c6c;
    margin-bottom: 20px;
  }
  .play_video {
    width: 1160px;
    height: 674px;
    margin-bottom: 20px;
  }
  .next {
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
    .el-button {
    }
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