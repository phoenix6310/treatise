<template>
  <div class="teacher_wrap w1200">
    <div class="competion_info_wrap">
      <div class="competition_name">
        {{ userData.dissName }}
      </div>
      <div class="upload_file_deadline" v-if="userData.dissData">
        {{ dateToSecond(userData.dissData.uploadTime) }}
      </div>
    </div>

    <div class="info_wrap">
      <el-card class="upload_wrap" shadow="hover">
        <div class="card_title">文档上传</div>
        <el-upload
          ref="upload"
          action="#"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="fileChange"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选择文件</el-button
          >
          <div slot="tip" class="el-upload__tip">
            文件要求：
            <ul class="file-tip">
              <li>视频格式：{{ acceptVedioTypes.join("、") }}</li>
              <li>文件格式：{{ acceptWordTypes.join("、") }}</li>
              <li>单文件大小：不大于{{ fileLimit / (1024 * 1024) }}M</li>
            </ul>
          </div>
        </el-upload>
        <!-- 提交 -->
        <el-button
          size="small"
          type="primary"
          class="upload_info_btn"
          :disabled="disabledUploadBtn"
          @click="submitForm"
          >提交</el-button
        >
      </el-card>
      <el-card class="rule_wrap" shadow="hover">
        <div class="card_title rule_title">竞赛规则</div>
        <div
          class="rule_content"
          v-if="userData.dissData"
          v-html="userData.dissData.rule"
        ></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TcVod from "vod-js-sdk-v6";
import { autograph, uploadFile, uploadInfos } from "@/api/upload.js";
import axios from "axios";
import dayjs from "dayjs";
export default {
  data() {
    return {
      fileList: [],
      uploaderInfos: [],
      showNext: false,
      rules: {
        fileTitle: [
          { required: true, message: "请输入视频名称", trigger: "blur" },
        ],
        fileInfo: [
          { required: true, message: "请输入视频介绍", trigger: "blur" },
        ],
      },
      fullFileName: "",
      fileLimit: 200 * 1024 * 1024,
      // WMV、RM、MOV、MPEG、MP4、3GP、FLV、AVI、RMVB、TS、ASF、MPG、WEBM、MKV 、M3U8、WM、ASX、RAM、MPE、VOB、DAT、MP4V、M4V、F4V、MXF、QT、OGG
      acceptVedioTypes: ["MP4"],
      acceptWordTypes: ["PDF", "DOCX", "DOC"],
      // 允许上传视频数
      allowVedioNum: 1,
      init: true,
    };
  },
  async created() {
    let { data } = await autograph();
    this.tcVod = new TcVod({
      getSignature: () => data,
    });
    if (this.init) {
      this.init = false;
      let historyFiles = this.userData.fileData;
      if (historyFiles.length) {
        let fileList = [];
        historyFiles.map((fileInfo) => {
          fileList.push({
            filePath: fileInfo.filePath,
            fileType: fileInfo.fileType,
            name: fileInfo.fileName,
            percentage: 100,
            status: "success",
            uid: fileInfo.id,
          });
        });

        this.fileList = fileList;
      }
    }
  },
  computed: {
    ...mapGetters(["userData"]),
    disabledUploadBtn() {
      let flag = false;
      let length = this.fileList.length;
      if (length) {
        for (let i = 0; i < length; i++) {
          if (this.fileList[i].status !== "success") {
            flag = true;
            break;
          }
        }
      } else {
        flag = true;
      }
      return flag;
    },
  },
  methods: {
    dateToSecond(dataTime) {
      return dayjs(+dataTime).format("YYYY-MM-DD HH:mm:ss");
    },
    // 提交文件信息
    async submitForm() {
      let infos = [];
      this.fileList.map((item) => {
        let info = {
          filePath: item.filePath,
          fileName: item.name,
          fileInfo: "",
          fileTitle: "",
          fileType: item.fileType,
        };

        infos.push(info);
      });
      let res = await uploadInfos(infos);

      if (res && res.code === 1) {
        this.$message({
          type: "success",
          message: "已上传",
          duration: 3000,
        });
        this.$store.dispatch("GetInfo");
      }
    },
    // 获取腾讯云签名
    getAntiLeechUrl(videoUrl, callback) {
      return axios
        .post(
          "https://demo.vod2.myqcloud.com/ugc-upload/",
          JSON.stringify({
            Action: "GetAntiLeechUrl",
            Url: videoUrl,
          })
        )
        .then(function (response) {
          return response.data.data.url;
        });
    },
    // 获取文件类型
    fileType(fileName) {
      return fileName.split(".").pop().toUpperCase();
    },
    // 文件改变时，验证文件大小，允许上传的文件根据文件类型上传至不同地方
    fileChange(file, fileList) {
      let fileIndex = fileList.length - 1;
      let lastFile = fileList[fileIndex];
      const fileType = this.fileType(file.name);
      console.log(`fileType:${fileType}`);
      if (lastFile.size > this.fileLimit) {
        // 验证文件大小
        this.$message({
          type: "error",
          message: `单文件最大${this.fileLimit / (1024 * 1024)}M`,
          duration: 3000,
        });
        fileList.pop();
      } else if (this.acceptWordTypes.indexOf(fileType) !== -1) {
        // 验证是否是acceptWordTypes, 上传文件
        this.uploadFile(lastFile.raw, fileIndex);
      } else if (this.acceptVedioTypes.indexOf(fileType) !== -1) {
        // 验证是否是acceptVedioTypes, 上传视频
        this.vedioUpload(lastFile, fileIndex);
      } else {
        this.$message({
          type: "error",
          message: `请上传允许的文件格式`,
          duration: 3000,
        });
        fileList.pop();
      }
      this.fileList = fileList;
    },
    //  非视频文件的上传进度
    onUploadProgress(fileIndex) {
      return (progressEvent) => {
        let percentage = parseInt(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        // console.log(`fileIndex:${fileIndex}-${percentage}%`, progressEvent);
        // console.log(percentage)
        let fileInfo = this.fileList[fileIndex];
        Object.assign(fileInfo, { percentage, status: "uploading" });
        // this.fileList.splice(fileIndex, 1, fileInfo);
      };
    },
    uploadFile(file, fileIndex) {
      let formData = new FormData();
      formData.append("file", file);
      uploadFile(formData, this.onUploadProgress(fileIndex))
        .then((res) => {
          console.log("uploadFile", res);
          if (res.code === 1) {
            // 文件上传成功
            let fileInfo = this.fileList[fileIndex];
            // 改变文件上传状态
            Object.assign(fileInfo, {
              status: "success",
              filePath: res.data,
              fileType: 1,
            });
          }
        })
        .catch((err) => {
          console.log("uploadFile-err", err);
        });
    },
    handleRemove(file, fileList) {
      // console.log("remove", file, fileList);
      // 更新文件列表
      this.fileList = fileList;
    },
    vedioUpload(fileInfo, fileIndex) {
      var self = this;
      let fileId = "";
      // console.log(9999, fileInfo);

      var mediaFile = fileInfo.raw;
      var uploader = self.tcVod.upload({
        mediaFile: mediaFile,
      });
      uploader.on("media_progress", function (info) {
        uploaderInfo.progress = info.percent;
        let fileInfo = self.fileList[fileIndex];
        Object.assign(fileInfo, {
          percentage: info.percent * 100,
          status: "uploading",
        });
      });
      uploader.on("media_upload", function (info) {
        uploaderInfo.isVideoUploadSuccess = true;
      });
      let { videoFile } = uploader;
      console.log(uploader, videoFile, "uploader");

      var uploaderInfo = {
        index: this.uploaderInfos.length,
        videoInfo: uploader.videoInfo,
        isVideoUploadSuccess: false,
        isVideoUploadCancel: false,
        progress: 0,
        fileId: "",
        videoUrl: "",
        cancel: function () {
          uploaderInfo.isVideoUploadCancel = true;
          uploader.cancel();
        },
      };

      this.uploaderInfos.push(uploaderInfo);

      uploader
        .done()
        .then(function (doneResult) {
          console.log("doneResult", doneResult);
          fileId = uploaderInfo.fileId = doneResult.fileId;
          return self.getAntiLeechUrl(doneResult.video.url);
        })
        .then(function (videoUrl) {
          uploaderInfo.videoUrl = videoUrl;
          let filePathInfo = {
            fileId: fileId,
            fileUrl: videoUrl,
          };
          // 文件上传成功
          let fileInfo = self.fileList[fileIndex];
          // 改变文件上传状态
          Object.assign(fileInfo, {
            status: "success",
            filePath: JSON.stringify(filePathInfo),
            fileType: 2,
          });
          self.showNext = true;
        });
    },
  },
};
</script>
<style lang="scss">
.teacher_wrap {
  .competion_info_wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    .competition_name {
      font-size: 24px;
    }
    .upload_file_deadline {
      color: #ff2300;
      font-size: 18px;
    }
  }
  .user_info_container {
    margin-top: 20px;
  }
  .info_wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .upload_wrap {
      box-sizing: border-box;
      width: 720px;
      .title {
        line-height: 1.6;
        margin-bottom: 8px;
      }
      .upload_info_wrap {
        margin-top: 10px;
        .file_name {
          width: 300px;
        }
      }
      .upload_info_btn {
        margin-top: 10px;
      }
    }
    .rule_wrap {
      width: 460px;
      box-sizing: border-box;

      .rule_content {
      }
    }
    .card_title {
      font-size: 18px;
      color: #409eff;
      margin-bottom: 10px;
    }
  }
}
</style>