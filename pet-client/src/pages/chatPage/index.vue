<template>
  <div class="page">
    <div class="header">
      <div @click="back(router)">
        <i class="iconfont icon-arrowLeft-fill"></i>
      </div>
      <div class="name_wrap">
        <span>{{ chatName }}</span>
      </div>
      <div class="tool_wrap">
        <i class="iconfont icon-diandian"></i>
      </div>
    </div>

    <div class="content_wrap" ref="contentScroll">
      <ChatListVue :recordList="recordList" />
    </div>

    <div class="footer">
      <div class="item">
        <van-icon name="smile" />
      </div>
      <div class="item">
        <van-icon name="add" />
      </div>
      <div class="input_wrap">
        <van-cell-group>
          <van-field v-model="value" cursor-spacing="50" auto-focus @focus="inputClick" @click-input="inputClick" @keyup.enter.native="send" />
        </van-cell-group>
      </div>
      <div class="item input_btn" :class="value !== '' ? 'currentInput' : ''" @click="send">
        <van-icon name="guide-o" />
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { toRelatedPage, back } from '@/router/tool.js'
import { useRoute, useRouter } from 'vue-router'
import ChatListVue from './components/ChatList.vue'
import { userStore } from '@/store/user.js'

export default {
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const uStore = userStore()
    const { chatId, chatName, chatImg } = route.query
    const state = reactive({
      value: '',
      contentScroll: ref(null),
      recordList: []
    })

    uStore.setChatInfo(route.query).then(res => {
      if (res) {
        const list = uStore.getChatMessageList()
        list.forEach(item => {
          item.btnDelete = false
        })
        state.recordList = list
      }
    })

    onUnmounted(() => {
      uStore.setChatListUnreadNew()
      uStore.setUnreadSum()
    })

    const send = () => {
      const data = {
        chatlistid: uStore.getChatInfoListId(),
        msg: state.value,
        mtime: `${new Date().getTime()}`,
        receiver: uStore.getChatInfoName(),
        receiverid: uStore.getChatInfoId(),
        sender: uStore.getUserName(),
        senderid: uStore.getUserId(),
        senderimg: uStore.getUserImg()
      }
      uStore.setChatMessageList(data)
      state.value = ''
    }

    const inputClick = () => {
      state.contentScroll.scrollTop = state.contentScroll.scrollHeight
    }

    return {
      ...toRefs(state),
      router,
      toRelatedPage,
      send,
      back,
      chatName,
      inputClick
    }
  },
  components: {
    ChatListVue
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 1.6rem;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.5rem;
    color: @color-text-header;
    & > div > i {
      color: @card-color;
      font-size: 0.6rem;
    }
    .name_wrap {
      color: @color-chat-title;
      font-size: 0.55rem;
    }
  }
  .content_wrap {
    flex: 1;
    height: calc(100% - 1.6rem - 60px);
    background-color: @chat-bg;
    // overflow: scroll;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
  }
  .footer {
    width: 100%;
    height: 60px;
    padding: 0.2rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .item {
      width: 1rem;
      font-size: 0.8rem;
      color: @primary;
    }
    .currentInput {
      display: block !important;
      animation: btn 0.5s ease;
    }

    .input_btn {
      display: none;
    }
    .input_wrap {
      flex: 1;
      overflow: hidden;
      .van-cell-group {
        .van-cell {
          border-radius: 1rem;
          background-color: @chat-bg;
        }
      }
      .van-cell-group::after {
        border: none;
      }
      margin-right: 0.3rem;
    }
  }
}
@keyframes btn {
  0% {
    width: 0;
    transform: translateX(30%);
    opacity: 0.2;
  }
  100% {
    width: 1rem;
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
