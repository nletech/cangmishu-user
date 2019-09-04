<template>
    <div>
        <a class="btn" @click="toggleShow">设置头像</a>
        <my-upload field="img"
              @crop-success="cropSuccess"
              @crop-upload-success="cropUploadSuccess"
              @crop-upload-fail="cropUploadFail"
              v-model="show"
          :width="300"
          :height="300"
          url="/upload"
          :params="params"
          :headers="headers"
          img-format="png"></my-upload>
        <img :src="imgDataUrl">
    </div>
</template>

<script>

export default {
  data() {
    return {
      show: true,
      params: {
        token: '123456798',
        name: 'avatar',
      },
      headers: {
        smail: '*_~',
      },
      imgDataUrl: '',
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------');
      this.imgDataUrl = imgDataUrl;
      console.log(field);
    },
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------');
      console.log(jsonData);
      console.log(`field: ${field}`);
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------');
      console.log(status);
      console.log(`field: ${field}`);
    },
  },
};
</script>

<style lang="less" module>

</style>
