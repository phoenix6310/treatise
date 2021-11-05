<template>
  <div class="student_wrap w1200">
    <UserInfo :userData="userData" class="user_info_container"></UserInfo>

    <el-card class="upload_wrap box-card" shadow="hover">
      <div class="step_wrap">
        <div class="title">第一步：<span>上传文件</span></div>
      </div>
      <div class="upload_container">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/treatise/coursemanager/upload/file"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :on-exceed="exceed"
          :on-error="onError"
          :fileChange= 'fileChange'
          :on-success="successHandler"
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
      </div>
    </el-card>
    <el-card class="upload_wrap box-card" shadow="hover">
      <div class="step_wrap">
        <div class="title">第二步：<span>上传信息</span></div>
      </div>
      <el-form
        :model="uploadInfo"
        :rules="rules"
        ref="uploadInfo"
        label-width="100px"
        class="upload_info_wrap"
      >
        <el-form-item label="文件标题" prop="fileName">
          <el-input v-model="uploadInfo.fileName" class="file_name" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('uploadInfo')"
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
export default {
  data() {
    return {
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
      uploadInfo: { filePath: "", fileName: "", fileType: 1 },
      rules: {
        fileName: [
          { required: true, message: "请上传文件", trigger: "blur" },
        ],
      },
      isUploadFile: false,
      fileTitle: ''
    };
  },
  computed: {
    ...mapGetters(["userData"]),
  },
  components: {
    UserInfo,
  },
  methods: {
    fileChange(file, fileList){
      console.log(file, fileList)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.uploadInfo);
          let formData = new FormData();
          for (let key in this.uploadInfo) {
            formData.append(key, this.uploadInfo[key]);
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
    submitUpload() {
      this.$refs.upload.submit();
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
      // console.log(res.data, file,file.name.split("."), file.name.split(".").pop());
      if (res.code === 1) {
        Object.assign(this.uploadInfo, {
          filePath: res.data,
          fileName: file.name,
        });
        this.$message({
          message: "已成功上传文件",
          type: "success",
        });
      }else{
        this.$message({
          message: "出错了，请重新上传",
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss">
.student_wrap {
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