<template>
  <div class="content_list">
    <div class="content" v-if="petInfoList.length !== 0">
      <div
        class="item_wrap"
        v-for="(item, index) in petInfoList"
        :key="item.petid"
      >
        <van-swipe-cell>
          <div class="item">
            <div class="item_img">
              <!-- <img :src="item.petimg" alt="" class="petimg"> -->
              <van-image
                width="3.1rem"
                height="3.1rem"
                fit="cover"
                :src="item.petimg"
                show-loading
              />
            </div>
            <div class="item_content">
              <div class="wrap_left">
                <p class="name">{{ item.petname }}</p>
                <p class="type">{{ item.petbreed }}</p>
                <p class="age">{{ item.petage }}岁</p>
              </div>
              <div class="wrap_right">
                <div>
                  <i
                    class="iconfont"
                    :class="item.petsex == '1' ? 'icon-nan' : 'icon-nv'"
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <template #right>
            <div class="right_wrap">
              <div class="btn_del" @click="btnDelInfo(index)">删除</div>
              <div class="btn_exit" @click="btnExitSonw(index)">编辑</div>
            </div>
          </template>
        </van-swipe-cell>
      </div>
    </div>

    <van-empty
      class="custom-image"
      :image="require('@/assets/imgs/page/empty.png')"
      description="这里什么也没有汪"
      v-else
    />

    <van-popup v-model:show="exitShow" position="bottom" title="编辑">
      <ExitPetInfoVue @close="exitClose" :show="exitShow" />
    </van-popup>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import ExitPetInfoVue from "./ExitPetInfo.vue";
import { userStore } from "@/store/user.js";
import { Dialog, Toast } from "vant";

export default {
  props: {
    petInfoList: {
      type: Array,
      default: []
    }
  },
  setup(props) {
    const uStore = userStore(); // 仓库的上下文对象
    const state = reactive({
      collect: false, // 收藏状态
      exitShow: false, // 宠物信息编辑界面
      // petInfoList: [], // 用户宠物信息列表
      selectItem: {}, // 选择某一只宠物进行信息修改
    });

    const cardColl = () => {
      // 点击心形收藏改变样式
      state.collect = !state.collect;
    };

    const btnDelInfo = index => {
      // 删除宠物信息
      Dialog.confirm({
        message: "确定要删除宠物消息吗？",
      }).then(() => {
        uStore.deletePetInfo(index);
      });
    };

    const btnExitSonw = index => {
      // 显示宠物信息修改面板
      state.exitShow = true;
      // console.log(index);
      uStore.setExitIndex(index);
      // state.selectItem = item
    };

    const exitClose = (e) => {
      state.exitShow = e;
    };

    return {
      ...toRefs(state),
      cardColl,
      btnExitSonw,
      exitClose,
      btnDelInfo,
    };
  },
  components: {
    ExitPetInfoVue,
  },
};
</script>

<style lang="less" scoped>
.content_list {
  width: 100%;
  height: 100%;
  background-color: @primary-bg;
  overflow-y: scroll;
  
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .item_wrap{
      width: 90%;
      box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
      margin-bottom: .3rem;
      border-radius: 18px;
      overflow: hidden;
      .item {
        width: 100%;
        background-color: @primary-bg;
        display: flex;
        .item_img {
          width: 3.1rem;
          height: 3.1rem;
          margin-right: 0.3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 0.4rem;
          background-color: @primary-bg;
        }
        .item_content {
          flex: 1;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          .wrap_left {
            max-width: 3.6rem;
            font-size: 0.4rem;
            color: @card-color;
            line-height: 0.6rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .name {
              font-size: 0.5rem;
              line-height: 1.2rem;
              color: #242424;
              font-weight: bold;
            }
            .type {
              margin-top: 0.6rem;
            }
          }
          .wrap_right {
            width: 0.8rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 0.5rem;
            text-align: center;
            margin: 0.3rem;
            .icon-nan {
              color: #54b0dc;
            }
            .icon-nv {
              color: @btn-delete;
            }
            .iconColl1 {
              color: #d8d8d8;
            }
            .iconColl2 {
              color: #ff6969;
            }
          }
        }
        .van-swipe-cell__right {
          display: flex;
          flex-direction: column;
          .van-button {
            color: #000;
          }
        }
      }

      .right_wrap {
        height: 3.1rem;
        color: @color-text-header;
        padding: 0.3rem;
        text-align: center;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        div {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          font-size: 0.3rem;
          line-height: 1rem;
        }
        .btn_exit {
          background-color: #54b0dc;
        }
        .btn_del {
          background-color: @btn-delete;
        }
      }
    }
  }
}

.iconfont {
  font-size: 0.75rem;
}

:deep(.van-empty__image) {
  opacity: 0.3;
}
</style>
