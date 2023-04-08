<template>
  <van-swipe-cell>
    <div
      class="item_page"
      @click="toRelatedPage('chatPage', router, 500, queryInfo)"
    >
      <div
        class="user_img"
        :class="chatItem.islogin ? 'islogin_true' : 'islogin_false'"
      >
        <van-image
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          :src="require('@/assets/imgs/user_photo/' + chatItem.img + '.png')"
        />
      </div>
      <div class="user_content">
        <div class="content">
          <div class="user_name">
            <span>{{ chatItem.name }}</span>
          </div>
          <div class="time">
            <span>{{ timeInterval(chatItem.time, 0) }}</span>
          </div>
        </div>
        <div class="content">
          <div class="chat_content">
            <span>{{ chatItem.newMsg }}</span>
          </div>
          <div class="tip" :class="chatItem.unreadNum !== 0 ? '' : 'opacity'">
            <span>{{ chatItem.unreadNum }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #right>
      <div class="right_wrap">
        <div class="btn_del" @click="btnDelInfo(chatItem.id)">删除</div>
      </div>
    </template>
  </van-swipe-cell>
</template>

<script>
import { reactive, toRefs } from "vue";
import { toRelatedPage } from "@/router/tool.js";
import { useRouter } from "vue-router";
import { timeInterval } from "@/utils/tool.js";
import { userStore } from "@/store/user.js";

export default {
  props: {
    chatItem: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const uStore = userStore();
    const router = useRouter();
    const state = reactive({
      queryInfo: {
        listId: props.chatItem.id,
        chatId: props.chatItem.userId,
        chatName: props.chatItem.name,
        chatImg: props.chatItem.img,
      },

      timeout: null,
    });

    const btnDelInfo = id => {
      uStore.setChatListSync(id);
    };

    return {
      ...toRefs(state),
      router,
      toRelatedPage,
      timeInterval,
      btnDelInfo
    };
  },
};
</script>

<style lang="less" scoped>
.item_page {
  width: 100%;
  height: 1.5rem;
  display: flex;
  align-items: center;
  .button-ripple();
  .user_img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }
  .islogin_true::after {
    content: "";
    width: 0.45rem;
    height: 0.45rem;
    border: 1px solid #fff;
    background-color: #2ad08b;
    border-radius: 50%;
    position: absolute;
    left: 1rem;
    bottom: 0;
  }
  .islogin_false::after {
    content: "";
    width: 0.45rem;
    height: 0.45rem;
    border: 1px solid #fff;
    background-color: #bcc6d1;
    border-radius: 50%;
    position: absolute;
    left: 1rem;
    bottom: 0;
  }

  .user_content {
    flex: 1;
    position: relative;
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user_name {
        color: @color-chat-title;
        font-size: 0.42rem;
        font-weight: 800;
        margin-bottom: 0.2rem;
        & > span {
          .line-clamp1();
        }
      }
      .time {
        flex-shrink: 0;
        color: @card-color;
        font-size: 0.3rem;
        margin-bottom: 0.2rem;
      }

      .chat_content {
        color: @card-color;
        font-size: 0.3rem;
        line-height: 0.4rem;
        & > span {
          .line-clamp1();
        }
      }
      .tip {
        flex-shrink: 0;
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        margin-left: 0.2rem;
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.45rem;
        color: #fff;
        font-weight: lighter;
        background-color: #ff3d3dd3;
      }
    }
  }
}
.right_wrap{
  width: 1.8rem;
  height: 100%;
  background-color: @btn-delete;
  margin-left: 10px;
  .btn_del{
    width: 100%;
    height: 100%;
    font-size: .4rem;
    color: #fff;
    line-height: 1.5rem;
    text-align: center;
  }
}
.opacity {
  opacity: 0;
}
</style>
