<template>
  <div class="page">
    <div class="header">
      <p class="title">聊天</p>
      <van-icon name="search" />
    </div>

    <div class="content_wrap">
      <TransitionGroup name="list">
        <div class="item" v-for="item in chatLst" :key="item">
          <ChatCardVue :chatItem="item" />
        </div>
      </TransitionGroup>

      <van-empty
        class="custom-image"
        :image="require('@/assets/imgs/page/empty.png')"
        description="没有信息汪"
        v-show="chatLst.length === 0 && !Load"
      />

      <div class="load" v-show="Load">
        <van-loading size="24px" vertical color="#f8b158">加载中...</van-loading>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import ChatCardVue from "./components/ChatCard.vue";
import { userStore } from "@/store/user.js";

export default {
  setup(props) {
    const uStore = userStore(); // 仓库的上下文对象
    const state = reactive({
      chatLst: [],
      Load: true,
    });

    uStore.getChatListSync().then(res => {
      if(res){
        const arr = uStore.getChatList();
        state.Load = false;
        state.chatLst = arr.sort((a,b)=>{ return b.time-a.time});
      }
    });


    return {
      ...toRefs(state),
    };
  },
  components: {
    ChatCardVue,
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: calc(100% - 50px);
  background-color: @primary;
  .header {
    width: 100%;
    height: 10%;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    font-size: 0.5rem;
    color: @color-text-header;
  }
  .content_wrap {
    width: 100%;
    height: 90%;
    background-color: #fff;
    border-radius: 32px 32px 0 0;
    padding: 40px 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    border-top: 4px solid #683931;
    .item {
      width: 100%;
      margin-bottom: 20px;
      background-color: #fff;
      // position: relative;
      //   margin-right: .3rem;
    }
  }
}
:deep(.van-empty__image) {
  opacity: 0.3;
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

.load {
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #8d9f5eda;
  border-radius: 0.3rem;

  display: flex;
  justify-content: center;
  align-items: center;
  // color: ;
}
</style>
