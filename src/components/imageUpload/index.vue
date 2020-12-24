<template>
  <div style="display: flex; flex-direction: column;">
    <el-button size="small" style="width: 120px;" :disabled="disable" @click="toggleShow">
      <slot name="btnTitle"></slot>
    </el-button>
    <my-upload
      :langExt="langInfo"
      :langType="langType"
      field="image"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="show"
      :width="width"
      :height="height"
      :url="api"
      :params="params"
      :headers="headers"
      img-format="png"
    >
    </my-upload>
    <div style="margin: 10px 0 0 0;">
      <img v-if="img" style="width: 150px; height: 150px;" :src="img" />
    </div>
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload';
import baseApi from '@/lib/axios/base_api';

export default {
  props: {
    img: {
      type: String,
      default: ''
    },

    width: {
      type: Number,
      default: 180
    },

    height: {
      type: Number,
      default: 180
    },

    disable: {
      type: Boolean,
      default: false
    },

    langType: {
      type: String,
      default: 'zh'
    }
  },

  components: {
    myUpload
  },

  data() {
    return {
      show: false,
      params: {
        name: 'shopLogo'
      },
      headers: {
        Authorization: this.$store.state.token.token
      },
      imgDataUrl: '',
      temp_img: ''
    };
  },
  computed: {
    langInfo() {
      return {
        preview: this.$t('imagePreview')
      };
    },

    authorization() {
      return this.$store.state.token.token;
    },

    api() {
      return `${baseApi.BASE_URL}upload/image`;
    }
  },

  watcch: {
    show() {
      if (!this.show) {
        this.$emit('update:img', '');
      }
    }
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
    },

    cropSuccess(imgDataUrl) {
      this.temp_img = imgDataUrl;
    },

    cropUploadSuccess(res) {
      this.$emit('uploadSuccessCallBack', res);
      this.$emit('update:img', res.data.url);
    },

    cropUploadFail() {
      console.log('-------- upload fail --------');
    }
  }
};
</script>

<style></style>
