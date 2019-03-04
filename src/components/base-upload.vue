<template>
  <div class="base-upload">
    <div class="img-upload">
      <div class="img-wrapper">
        <img v-if="coverUrl" :src="coverUrl" alt="">
        <img v-else-if="oldCoverUrl" :src="oldCoverUrl" alt="">
        <img v-else src="//fakeimg.pl/120x120" alt="">
      </div>
      <div class="handler">
        <slot></slot>
        <Upload
          ref="baseUpload"
          style="margin-top: 20px"
          v-show="!uploading"
          name="files"
          :show-upload-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          accept="image/*"
          :format="['jpg','jpeg','png']"
          :on-format-error="FormatError"
          action="https://www.topasst.com/cms/file/uploadFile"
        >
          <Button  type="primary" ghost icon="ios-cloud-upload-outline">{{btnTip}}</Button>
        </Upload>
        <Button v-show="uploading" type="primary" ghost loading icon="ios-cloud-upload-outline">{{btnTip}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import { message } from '../common/js/mixins.js'

  export default {
    props: {
      oldCoverUrl: {
        type: String,
        default: ''
      },
      btnTip: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        coverUrl: '',
        file: null,
        uploading: false,
        addHeaders: null
      }
    },
    mixins: [message],
    methods: {
      handleBeforeUpload(file) {
        this.file = file
        this.uploading = true
      },
      uploadSuccess(data) {
        this.coverUrl = 'https://www.topasst.com/images/' + data.data
        this.uploading = false
        this.$emit('uploadSuccess', data)
      },
      uploadError() {
        this.uploading = false
      },
      FormatError() {
        this.uploading = false
        this.warningInfo('图片格式不正确')
      },
      MaxSize() {
        this.uploading = false
        this.warningInfo('图片大小超出限制')
      },
      clearCover() {
        this.coverUrl = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .img-upload {
    display: flex;
    align-items: center;
    margin: 20px 0;
    .img-wrapper {
      position: relative;
      flex-basis: 120px;
      width: 120px;
      height: 120px;
      overflow: hidden;
      background: #ccc;
      img {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .handler {
      padding-left: 15px;
      &-tip {
        margin-bottom: 5px;
        color: #555;
        font-size: 16px;
      }
    }
  }
</style>
