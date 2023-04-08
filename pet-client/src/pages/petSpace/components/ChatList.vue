<template>
  <div class="list_page" @click="initBtnDelete">
    <TransitionGroup name="list">
      <div
        class="list_item"
        v-for="(item, index) in recordList"
        :key="item"
        :class="item.sender === userName ? 'list_item_user' : ''"
      >
        <div class="user_img">
          <van-image
            width="1.2rem"
            height="1.2rem"
            fit="cover"
            :src="
              require('@/assets/imgs/user_photo/' + item.senderimg + '.png')
            "
          />
        </div>
        <div class="chat_content" @touchstart="touchstart(index)">
          <div class="time_wrap">
            <span>{{ timeInterval(item.mtime, 1) }}</span>
          </div>
          <div class="content_wrap">
            <span>{{ item.msg }}</span>
            <!-- <span>{{recordList}}</span> -->
          </div>
        </div>
        <div class="tool_wrap" v-if="item.btnDelete" @click="deleteRecode(item.chatrecordid)">
          <span>删除</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import { userStore } from "@/store/user.js";
import { timeInterval } from "@/utils/tool.js";

export default {
  props: {
    recordList: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    const uStore = userStore();
    const state = reactive({
      userName: uStore.getUserName(),
      btnDelete: false
    });

    const touchstart = index => {
      const timeout = setTimeout(() => {
        props.recordList[index].btnDelete = true;
      }, 1000)
      // clearTimeout(timeout);
    };

    const initBtnDelete = () => {
      props.recordList.forEach(item => {
        item.btnDelete = false;
      })
    };

    const deleteRecode = recordid => {
      uStore.deleteRecordSync(recordid);
    };

    return {
      ...toRefs(state),
      timeInterval,
      touchstart,
      initBtnDelete,
      deleteRecode
    };
  },
};
</script>

<style lang="less" scoped>
.list_page {
  width: 100%;
  min-height: 100%;
  padding: 0.3rem 0.1rem;
  box-sizing: border-box;
  .list_item {
    width: 100%;
    margin-bottom: 0.39rem;
    display: flex;
    .user_img {
      width: 1.2rem;
      height: 1.2rem;
      flex: 0 0 1.2rem;
      margin: 0 0.3rem;
      border-radius: 50%;
      overflow: hidden;
    }
    .chat_content {
      max-width: 57%;
      background-color: #fff;
      padding: 0.3rem;
      border-radius: 0 0.35rem 0.35rem 0.35rem;
      position: relative;
      .time_wrap {
        color: @card-color;
        font-size: 0.2rem;
        margin-bottom: 0.1rem;
      }
      .content_wrap {
        color: @color-chat-title;
        font-size: 0.4rem;
        & > span {
          line-height: 0.46rem;
          display: inline-block;
          word-break: break-all;
          white-space: normal;
        }
        // text-overflow: ellipsis;
      }
    }
    .tool_wrap{
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 .3rem;
      &>span{
        text-align: center;
        display: inline-block;
        width: 0.9rem;
        font-size: .3rem;
        line-height: .4rem;
        color: #fff;
        padding: .2rem .3rem;
        border-radius: .3rem;
        background-color:@btn-delete;
        
      }
    }
  }
  .list_item_user {
    flex-direction: row-reverse;
    .chat_content {
      border-radius: 0.35rem 0 0.35rem 0.35rem;
      background-color: @primary;
      .time_wrap {
        color: @color-text-header;
      }
      .content_wrap {
        color: #fff;
      }
    }
  }
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active {
  transition: all 0.5s ease;
}
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
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
</style>
