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
    <button @click="download">下载</button>
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
    download() {
      axios({
        method: "get",
        url: `http://1400170034.vod2.myqcloud.com/faeed456vodcq1400170034/cb30b2e53701925925544045906/KpqAA95eaPkA.mp4?t=615feb8f&rlimit=2&us=2435931290295340269&sign=1c5cc64d4428e7dff452bca760951d77`,
        // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
        responseType: "blob",
      }).then((res) => {
        if (!res) {
          return;
        }
        // 将lob对象转换为域名结合式的url
        let blobUrl = window.URL.createObjectURL(res.data);
        let link = document.createElement("a");
        document.body.appendChild(link);
        link.style.display = "none";
        link.href = blobUrl;
        // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
        link.download = "下载文件.csv";
        // 自触发click事件
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      });
    },
    vExampleUpload: function () {
      var self = this;
      var mediaFile = this.$refs.vExampleFile.files[0];

      var uploader = this.tcVod.upload({
        mediaFile: mediaFile,
      });
      console.log(uploader, "uploaderuploader");
      uploader.on("media_progress", function (info) {
        uploaderInfo.progress = info.percent;
      });
      uploader.on("media_upload", function (info) {
        uploaderInfo.isVideoUploadSuccess = true;
      });

      let { videoFile } = uploader;
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