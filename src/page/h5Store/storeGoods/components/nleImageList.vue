<template>
  <div class="nle-images-box">
    <div
        v-for="(item, index) in list"
        :key="item.id"
        :class="inline ? 'show-inline' : 'show-block'">
        <el-card class="image-item">
            <div class="image-item_move">
                <span
                    :class="[inline ? 'el-icon-back' : 'el-icon-top', 'move-left']"
                    v-if="index !== 0"
                    @click="onMove(index, -1)">
                </span>
                <span
                    :class="[inline ? 'el-icon-right' : 'el-icon-bottom', 'move-right']"
                    v-if="index !== list.length - 1"
                    @click="onMove(index, 1)">
                </span>
            </div>
            <div
                class="image-item_title"
                v-if="mainText">
                <span v-if="index === 0">{{ mainText }}</span>
                <span v-else>{{ secondText }}</span>
            </div>
            <i class="el-icon-close image-close" @click="onDelete(index)"></i>
            <img :src="item.url" alt="" class="image">
        </el-card>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'list',
    event: 'onMove',
  },
  props: {
    inline: {
      type: Boolean,
      default: true,
    },
    mainText: {
      type: String,
      default: '',
    },
    secondText: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    onDelete(index) {
      this.list.splice(index, 1);
    },
    onMove(index, step) {
      const item = this.list.splice(index, 1);
      this.list.splice(index + step, 0, item[0]);
      this.$emit('changeItem');
    },
  },
};
</script>
<style scoped>
.nle-images-box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.image-item {
  position: relative;
}
.image-item_title {
  position: absolute;
  top: 30%;
  right: 20px;
}
.image-close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.image {
  width: 120px;
  height: 120px;
}
.show-block {
  margin-top: 10px;
}
.show-inline {
  display: inline-block;
  margin: 10px 15px 0 0;
}
.image-item_move {
  font-size: 18px;
  line-height: 40px;
  align-items: center;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.move-right {
  float: right;
}
.move-left, .move-right {
  cursor: pointer;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, .12);
  font-weight: bold;
}
</style>
