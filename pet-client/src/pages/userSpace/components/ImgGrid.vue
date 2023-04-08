<template>
  <van-grid class="img_box" column-num="3" v-if="petInfo.length !== 0">
    <van-grid-item use-slot v-for="item in petInfo" :key="item" @click="toDetails(item)">
      <van-image width="2.7rem" height="2.7rem" fit="cover" :src="item.petimg" show-loading />
    </van-grid-item>
  </van-grid>

  <van-empty class="custom-image" :image="require('@/assets/imgs/page/empty.png')" description="这里什么也没有汪" v-else />
</template>

<script>
import { toRelatedPage } from '@/router/tool.js'
import { useRouter } from 'vue-router'

export default {
  props: {
    petInfo: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter()

    const toDetails = item => {
      // 跳转宠物详情页面
      const { petid, hostid } = item
      toRelatedPage('petSpace', router, 500, { petid, hostid })
    }

    return {
      toDetails
    }
  }
}
</script>

<style lang="less" scoped>
.img_box {
  padding: 0.2rem;
  box-sizing: border-box;
  :deep(.van-grid-item__content) {
    width: 100%;
    padding: 0.2rem;
    .van-image {
      border-radius: 0.5rem;
      overflow: hidden;
      // animation: move 4s ease 0.02s 1 alternate;
    }
  }
  :deep([class*='van-hairline']:after) {
    border: none;
  }
}
:deep(.van-empty__image) {
  opacity: 0.3;
}

@keyframes move {
  0% {
    transform: translateY(10%);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
