<template>
  <div class="page_head">
    <div @click="back(router)">
      <i class="iconfont icon-arrowLeft-fill"></i>
    </div>
    <span class="name">{{name}}</span>
  </div>
</template>

<script>
import {back} from '@/router/tool.js';
import { useRouter } from 'vue-router';

export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter();
    return {
      router,
      back
    }
  }
};
</script>

<style lang="less" scoped>
.page_head {
  width: 100%;
  height: 1.6rem;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.5rem;
  color: @color-text-header;
  background-color: @primary;
  i {
    font-size: 0.8rem;
  }
}
</style>
