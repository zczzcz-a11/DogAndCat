<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page">
    <div class="header">
      <div class="info_img">
        <div class="img_wrap">
          <van-image
            width="2rem"
            height="2rem"
            fit="cover"
            :src="require('@/assets/imgs/user_photo/' + userInfo.img + '.png')"
          />
        </div>
      </div>
      <div class="info_content">
        <div class="info_name">
          <span class="name">{{ userInfo.name }}</span>
          <van-icon name="vip-card-o" color="#f8b158" size=".8rem" />
        </div>
        <div class="info_brief">
          <span>{{ userInfo.sign }}</span>
        </div>
      </div>
      <div
        class="info_space"
        @click="toRelatedPage('userSpace', router, 0, queryInfo)"
      >
        <span>个人空间 ></span>
      </div>
    </div>

    <div class="content_wrap">
      <div class="main">
        <div
          class="item"
          v-for="item in pageInfo"
          :key="item"
          @click="toRelatedPage(item.url, router)"
        >
          <van-icon :name="item.name" color="#8d9f5e" />
          <p>{{ item.content }}</p>
        </div>

        <div class="item" @click="toExit">
          <van-icon name="warning-o" color="#8d9f5e" />
          <p>退出</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { toRelatedPage } from "@/router/tool.js";
import { useRouter } from "vue-router";
import { userStore } from "@/store/user.js";
import { Dialog } from "vant";

export default {
  beforeCreate() {
    const uStore = userStore(); // 仓库的上下文对象
    if (uStore.getUserName() === "") {
      uStore.getUserInfoSync();
    }
  },
  setup() {
    const uStore = userStore(); // 仓库的上下文对象
    const router = useRouter(); // 得到路由实例

    const state = reactive({
      // userInfo: {}
      pageInfo: [
        {
          name: "records",
          content: "编辑信息",
          url: "/updatauser",
        },
        {
          name: "like-o",
          content: "我的宠物",
          url: "/mypet",
        },
        {
          name: "add-o",
          content: "添加宠物",
          url: "/add",
        },
        {
          name: "question-o",
          content: "帮助",
          url: "/",
        },
      ],
      queryInfo: {
        userId: uStore.getUserId(),
      },
    });

    onMounted(() => {
      if (uStore.getPetInfo().length === 0) {
        uStore.getPetInfoSync();
      }
    });

    const toUserInfo = () => {
      console.log("修改个人信息");
    };

    const toUserPet = () => {
      // console.log('我的宠物');
      router.push("/mypet");
    };

    const toAddPet = () => {
      // console.log('添加宠物');
      router.push("/add");
    };

    const toHelp = () => {
      console.log("帮助");
    };

    const toExit = () => {
      // console.log('退出');
      Dialog.confirm({
        message: "确定要退出登录吗？",
      }).then(() => {
        uStore.emptyState();
        uStore.socketDisconnect();
        router.push("/login");
      });
    };

    const userInfo = computed(() => {
      let name = uStore.getUserName();
      let img = uStore.getUserImg();
      let sign = uStore.getUserSign();
      if (img === "" || img === null) img = "user_001";
      if (sign === "" || sign === null) sign = "今日份营业汪 ! ! !";
      return { name, img, sign };
    });

    return {
      ...toRefs(state),
      toUserInfo,
      toUserPet,
      toAddPet,
      toHelp,
      toExit,
      toRelatedPage,
      router,
      userInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: @primary;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    // height: 25%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
    color: @color-text-header;
    .info_img {
      // margin: 0 auto;
      .img_wrap {
        width: 2rem;
        height: 2rem;
        border: 2px solid #fff;
        border-radius: 10px;
        overflow: hidden;

        display: flex;
        justify-content: center;
        align-items: center;
        .img {
          width: 110%;
        }
      }
    }
    .info_content {
      flex: 1;
      margin-left: 15px;
      .info_name {
        padding-bottom: 0.2rem;
        display: flex;
        align-items: center;
        .name {
          font-size: 0.5rem;
          font-weight: 800;
          margin-right: 0.3rem;
          max-width: 3rem;
          .line-clamp1();
        }
      }
      .info_brief {
        font-size: 0.2rem;
        line-height: 0.4rem;
        font-weight: lighter;
        max-width: 4.5rem;
        .line-clamp2();
      }
    }
    .info_space {
      display: flex;
      align-items: center;
      margin-left: 10px;
      & > span {
        font-size: 0.33rem;
        font-weight: 600;
      }
    }
  }
  .content_wrap {
    width: 100%;
    flex: 1;
    background-color: @primary-bg;
    border-radius: 32px 32px 0 0;
    border-top: 4px solid #683931;
    padding: 40px 10px;
    box-sizing: border-box;
    .main {
      width: 100%;
      .item {
        display: flex;
        font-size: 0.7rem;
        padding: 0.4rem 0.4rem;
        box-sizing: border-box;
        .button-ripple();
        p {
          color: #1e1e1e;
          font-size: 0.5rem;
          line-height: 0.7rem;
          margin-left: 0.3rem;
        }
      }
    }
  }
}
</style>
