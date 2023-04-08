<template>
  <div class="content_box">
    <van-row type="flex" justify="space-between" class="title">
      <van-col class="cancel" @click="cencel">取消</van-col>
      <van-col class="sure" @click="saveInfo">确定</van-col>
    </van-row>

    <div class="img_box">
      <div
        class="img_item"
        v-for="item in imgList"
        :key="item"
        :class="currentImg === item ? 'display' : ''"
      >
        <van-image
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          :src="require('@/assets/imgs/user_photo/' + item + '.png')"
          @click="selectImg(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
export default {
  props: {
    show: {
      type: Boolean,
    }
  },
  setup(props, ctx) {
    const state = reactive({
      imgList:[],
      currentImg: '',
    });

    onMounted(() => {
      for (let i = 1; i <= 20; i++) {
        if (i <= 9) state.imgList.push("user_00" + i);
        else state.imgList.push("user_0" + i);
      }
    });

    const cencel = () => {
      ctx.emit("close", false);
    };

    const saveInfo = (value) => {
      ctx.emit("close", false);
      ctx.emit("currentImg", state.currentImg);
    };

    const selectImg = (img) => {
      state.currentImg = img;
    };

    return {
      ...toRefs(state),
      cencel,
      saveInfo,
      selectImg,
    };
  },
};
</script>

<style lang="less" scoped>
.content_box {
  overflow: hidden;
  .title {
    padding: 10px 10px;
    .cancel {
      color: #999;
    }
    .sure {
      color: #1989fa;
    }
  }
  .img_box {
    padding: 20px;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(5, 20%);
    grid-template-rows: repeat(4, 25%);
    grid-row-gap: 0.1rem;
    justify-items: center;
    .img_item {
      width: 1.5rem;
      height: 1.5rem;
      .van-image {
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
}
.display {
  position: relative;
  @keyframes circle {
    0% {
      transform: scale(4);
      opacity: 0.1;
    }
    100% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  &::after {
    content: "";
    width: 1.5rem;
    height: 1.5rem;
    background-color: #8d9f5e;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    border-radius: 50%;
    transform: scale(1.2);
    // opacity: 0;
    animation: circle 0.3s ease 0.02s 1 alternate;
  }
}
</style>
