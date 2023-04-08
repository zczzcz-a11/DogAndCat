<template>
  <div class="page">
    <PageHeadVue :name="pageName" />

    <div class="user_wrap">
      <div class="img_wrap">
        <van-image
          width="3rem"
          height="3rem"
          fit="cover"
          :src="require('@/assets/imgs/user_photo/' + userInfo.userimg + '.png')"
        />
        <div class="text_wrap">
          <div class="name">{{userInfo.username}}</div>
          <div class="sign">{{userInfo.usersign}}</div>
        </div>
      </div>

      <div class="button_wrap">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          color="#f8b158"
          @click="toChatPage"
        >
          发消息
        </van-button>
      </div>
    </div>

    <div class="content_wrap">
      <van-tabs
        active="{{ active }}"
        bind:change="onChange"
        type="card"
        swipeable
      >
        <van-tab title="他的">
          <ImgGridVue :petInfo="petInfo" />
        </van-tab>
        <van-tab title="喜欢">
          <ImgGridVue :petInfo="fondInfo"/>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import PageHeadVue from "@/components/PageHead.vue";
import ImgGridVue from "./components/ImgGrid";
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userSpaceById } from '@/axios/index.js';
import { toRelatedPage } from "@/router/tool.js";
import { userStore } from "@/store/user.js";
import { Toast } from 'vant';

export default {
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const uStore = userStore();
    const userId = route.query.userId;
    const state = reactive({
      pageName: "个人空间",
      userInfo: {
        userimg: 'user_001'
      },
      petInfo: [],
      fondInfo: [],
      queryInfo: {},
    });

    const toChatPage = () => {
      const name = uStore.getUserName();
      if(name === state.userInfo.username){
        Toast.fail('不可以向自己发消息');
      }else{
        toRelatedPage('chatPage', router, 500, state.queryInfo);
      }
    }
    
    const userSpaceByIdSync = id => {
      userSpaceById(id).then( res=> {
        state.userInfo = res.data.userInfo;
        state.petInfo = res.data.petInfo;
        state.fondInfo = res.data.fondinfo;
        state.queryInfo = {
          chatId: res.data.userInfo.id,
          chatName: res.data.userInfo.username,
          chatImg: res.data.userInfo.userimg
        };

        uStore.getChatListSync().then(result => {
          if(result){
            const chatList = uStore.getChatList();
            state.queryInfo.listId = '';
            chatList.forEach(item => {
              if(item.userId == state.queryInfo.chatId){
                state.queryInfo.listId = item.id;
              }
            });
          };
        })
      });
    }
    userSpaceByIdSync({userId});


    
    return {
      ...toRefs(state),
      router,      
      toRelatedPage,
      toChatPage,
    };
  },
  components: {
    PageHeadVue,
    ImgGridVue,
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: @primary;
  overflow: scroll;
  .user_wrap {
    width: 100%;
    height: 7rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    animation: circle .6s ease 0.02s 1 alternate;
    .img_wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .van-image {
        margin: 0 auto;
        border-radius: 50%;
        overflow: hidden;
      }
      .text_wrap {
        margin-top: 0.3rem;
        text-align: center;
        .name {
          color: #fff;
          font-size: 0.5rem;
          font-weight: 800;
          line-height: 0.8rem;
          margin: 0 auto;
          max-width: 3rem;
          .line-clamp1();
        }
        .sign {
          max-width: 6rem;
          line-height: 0.32rem;
          font-size: 0.3rem;
          color: #d1e6a1;
          .line-clamp2();
        }
      }
    }
    .button_wrap {
      width: 30%;
      font-size: 0.5rem;
      font-weight: 800;
    }
  }
  .content_wrap {
    width: 100%;
    min-height: calc(100% - 8.6rem);
    background-color: #fff;
    border-radius: 32px 32px 0 0;
    border-top: 4px solid #683931;
    padding: 30px 0px;
    box-sizing: border-box;
    animation: move .7s ease 0s 1 alternate;
    :deep(.van-tabs__wrap) {
      height: 1rem;
      .van-tabs__nav {
        height: 100%;
        padding: 0.1rem;
        box-sizing: border-box;
        border: none;
        background-color: @primary;
        border-radius: 0.5rem;
        .van-tab {
          font-size: 0.4rem;
          font-weight: 800;
          color: #fff;
          border: none;
          letter-spacing: 0.3rem;
          text-indent: 0.3rem;
        }
        .van-tab--active {
          color: @button-bg;
          background-color: #fff;
          border-radius: 0.5rem;
        }
      }
    }
  }
}
@keyframes move {
  0% {
    transform: translateY(30%);
    opacity: .2;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes circle {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
