<template>
  <div class="teacher_wrap w1200">
    <UserInfo :userData="userData" class="user_info_container"></UserInfo>
    <el-card class="upload_wrap box-card" shadow="hover">
      <div class="step_wrap">
        <div class="title">第一步：<span>上传文件</span></div>
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="#"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :on-exceed="exceed"
        :on-error="onError"
        :on-success="successHandler"
        :http-request="vedioUpload"
        :on-change="fileChange"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
          :disabled="isUploadFile"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          :disabled="isUploadFile"
          >上传文件</el-button
        >
        <!-- <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
      </el-upload>
      <div class="row">
        <!-- 上传信息组件	 -->
        <div
          class="uploaderMsgBox"
          v-for="uploaderInfo in uploaderInfos"
          :key="uploaderInfo.index"
        >
          <div v-if="uploaderInfo.videoInfo">
            <span
              >视频名称：{{
                uploaderInfo.videoInfo.name + "." + uploaderInfo.videoInfo.type
              }}；
            </span>
            <span
              >上传进度：{{
                Math.floor(uploaderInfo.progress * 100) + "%"
              }}；</span
            >
            <!-- <span>fileId：{{ uploaderInfo.fileId }}； </span> -->
            <span
              >上传结果：{{
                uploaderInfo.isVideoUploadCancel
                  ? "已取消"
                  : uploaderInfo.isVideoUploadSuccess
                  ? "上传成功"
                  : "上传中"
              }}；</span
            >
            <!-- <br />
          地址：{{ uploaderInfo.videoUrl }}； -->
            <a
              href="javascript:void(0);"
              class="cancel-upload"
              v-if="
                !uploaderInfo.isVideoUploadSuccess &&
                !uploaderInfo.isVideoUploadCancel
              "
              @click="uploaderInfo.cancel()"
              >取消上传</a
            >
          </div>

          <div v-if="uploaderInfo.coverInfo">
            封面名称：{{ uploaderInfo.coverInfo.name }}； 上传进度：{{
              Math.floor(uploaderInfo.coverProgress * 100) + "%"
            }}； 上传结果：{{
              uploaderInfo.isCoverUploadSuccess ? "上传成功" : "上传中"
            }}；
            <br />
            地址：{{ uploaderInfo.coverUrl }}；
            <br />
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="upload_wrap box-card" shadow="hover">
      <div class="step_wrap">
        <div class="title">第二步：<span>上传信息</span></div>
      </div>
      <el-form
        :model="videoInfo"
        :rules="rules"
        ref="videoInfo"
        label-width="100px"
        class="upload_info_wrap"
      >
        <el-form-item label="视频标题" prop="fileTitle">
          <el-input v-model="videoInfo.fileTitle" class="file_name"></el-input>
        </el-form-item>
        <el-form-item label="视频介绍" prop="fileInfo">
          <el-input
            v-model="videoInfo.fileInfo"
            size="small"
            type="textarea"
            maxlength="100"
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('videoInfo')"
            >上传</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserInfo from "./components/info.vue";
import { uploadInfo } from "@/api/upload";
import TcVod from "vod-js-sdk-v6";
import { autograph } from "@/api/upload.js";
import axios from "axios";
export default {
  data() {
    return {
      fileList: [],
      isUploadFile: false,
      _fileList: [],
      uploaderInfos: [],
      videoInfo: {
        filePath: "",
        fileName: "",
        fileInfo: "",
        fileType: 2,
        fileTitle: ''
      },
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
    };
  },
  computed: {
    ...mapGetters(["userData"]),
  },
  components: {
    UserInfo,
  },
  async created() {
    let { data } = await autograph();
    this.tcVod = new TcVod({
      getSignature: () => data,
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.videoInfo);
          let formData = new FormData();
          for (let key in this.videoInfo) {
            formData.append(key, this.videoInfo[key]);
          }
          let res = await uploadInfo(formData);

          if (res && res.code === 1) {
            this.$message({
              type: "success",
              message: "已上传",
              duration: 3000,
            });
            this.$store.dispatch("GetInfo");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
    fileChange(file, fileList) {
      this._fileList = fileList;
      Object.assign(this.videoInfo, {
        fileName: file.name,
      });
      console.log(file, fileList, this.videoInfo);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    exceed(files, fileList) {
      this.$message({
        message: "单次只能上传一个文件",
        type: "error",
      });
      console.log(files, fileList);
    },
    onError(err, file, fileList) {
      this.$message({
        message: `[code-${err.status}]:${JSON.parse(err.message).message}`,
        type: "error",
        duration: 5 * 1000,
      });
    },
    successHandler(res, file, fileList) {
      console.log("successHandler", res, file, fileList);
    },
    vedioUpload() {
      var self = this;
      const fileInfo = self._fileList[0];
      let fileId = "";
      // console.log(9999, fileInfo);

      var mediaFile = fileInfo.raw;
      var uploader = self.tcVod.upload({
        mediaFile: mediaFile,
      });
      uploader.on("media_progress", function (info) {
        uploaderInfo.progress = info.percent;
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

          //
          let filePathInfo = {
            fileId: fileId,
            fileUrl: videoUrl,
          };
          Object.assign(self.videoInfo, {
            filePath: JSON.stringify(filePathInfo),
          });
          self.showNext = true;
        });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
  },
};
</script>
<style lang="scss">
.teacher_wrap {
  .user_info_container {
    margin-top: 20px;
  }
  .upload_wrap {
    margin-top: 40px;
    padding: 16px 0 16px 40px;
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
  }
}
</style>