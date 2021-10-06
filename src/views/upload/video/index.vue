<template>
  <div>
    video upload
    <form ref="vExample">
      <input
        type="file"
        style="display: none"
        ref="vExampleFile"
        @change="vExampleUpload"
      />
    </form>
    <button @click="vExampleAdd">直接上传</button>

    <div class="row" id="resultBox">
      <!-- 上传信息组件	 -->
      <div class="uploaderMsgBox" v-for="uploaderInfo in uploaderInfos">
        <div v-if="uploaderInfo.videoInfo">
          视频名称：{{
            uploaderInfo.videoInfo.name + "." + uploaderInfo.videoInfo.type
          }}； 上传进度：{{ Math.floor(uploaderInfo.progress * 100) + "%" }}；
          fileId：{{ uploaderInfo.fileId }}； 上传结果：{{
            uploaderInfo.isVideoUploadCancel
              ? "已取消"
              : uploaderInfo.isVideoUploadSuccess
              ? "上传成功"
              : "上传中"
          }}；
          <br />
          地址：{{ uploaderInfo.videoUrl }}；
          <a
            href="javascript:void(0);"
            class="cancel-upload"
            v-if="
              !uploaderInfo.isVideoUploadSuccess &&
              !uploaderInfo.isVideoUploadCancel
            "
            @click="uploaderInfo.cancel()"
            >取消上传</a
          ><br />
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
  </div>
</template>

<script>
import { autograph } from "@/api/upload.js";
import axios from "axios";
import TcVod from "vod-js-sdk-v6";
export default {
  data() {
    return {
      uploaderInfos: [],
    };
  },
  async created() {
    let { data } = await autograph();
    console.log(data);
    this.tcVod = new TcVod({
      getSignature: () => data,
    });
  },
  methods: {
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
    vExampleAdd: function () {
      this.$refs.vExampleFile.click();
    },
    vExampleUpload: function () {
      var self = this;
      var mediaFile = this.$refs.vExampleFile.files[0];

      var uploader = this.tcVod.upload({
        mediaFile: mediaFile,
      });
      console.log(uploader, 'uploaderuploader')
      uploader.on("media_progress", function (info) {
        uploaderInfo.progress = info.percent;
      });
      uploader.on("media_upload", function (info) {
        uploaderInfo.isVideoUploadSuccess = true;
      });

      let {videoFile} = uploader
      console.log(uploader, videoFile, "uploader");

      var uploaderInfo = {
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

          uploaderInfo.fileId = doneResult.fileId;

          return self.getAntiLeechUrl(doneResult.video.url);
        })
        .then(function (videoUrl) {
          uploaderInfo.videoUrl = videoUrl;
          self.$refs.vExample.reset();
        });
    },
  },
};
</script>

<style lang="scss">
.uploaderMsgBox {
  width: 100%;
  border-bottom: 1px solid #888;
}
#resultBox {
  width: 100%;
  height: 300px;
  border: 1px solid #888;
  padding: 5px;
  overflow: auto;
  margin-bottom: 20px;
}
</style>