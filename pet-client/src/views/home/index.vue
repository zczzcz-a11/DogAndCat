<template>
  <div class="page" ref="pageBox">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <!-- <p>刷新次数: {{ count }}</p> -->

      <!-- <div class="page"> -->
      <div class="search_wrap">
        <div class="search">
          <van-icon name="search" class="search_icon" size="20" />
          <p class="search_text">寻找你喜欢的宠物</p>
        </div>
      </div>

      <div class="header">
        <div class="title">
          <p>Adopt a</p>
          <p>Friend</p>
        </div>
        <div class="header_image">
          <img src="@/assets/icons/home.svg" alt="" />
        </div>
      </div>

      <div class="main_wrap">
        <div class="tab_wrap">
          <p class="title_h1">
            <span class="left">宠物类别</span>
            <span class="right">左滑更多类别</span>
          </p>
          <van-tabs v-model:active="active" background="#fdfdfd" line-width="0px" ref="scroll">
            <van-tab v-for="item in typeMap" :key="item.icon">
              <!-- 宠物种类 -->
              <template #title>
                <div class="icon_wrap" :class="{ iconActive: active == item.type }" @click="cutPetData(item.type)">
                  <i class="iconfont" :class="item.icon"></i>
                  <p>{{ item.name }}</p>
                </div>
              </template>
              <!-- 宠物展示 -->
              <p class="title_h1">
                <span class="left">收养宠物</span>
                <span class="right">{{ item.name }}类</span>
              </p>
              <div class="content_wrap" v-if="refreshPage">
                <div class="item" v-for="item in petInfoList[active].petList" :key="item.petid">
                  <PetCardVue :petItem="item" />
                </div>
              </div>

              <div class="content_sheleton" v-else>
                <SkeletonVue />
              </div>
              <!-- 结束 -->
              <van-divider contentPosition="center" v-if="petInfoList[active].End">已经没有更多了</van-divider>
            </van-tab>
          </van-tabs>
        </div>
      </div>
      <!-- </div> -->

      <div class="load" v-show="petLoad">
        <van-loading size="24px" vertical color="#f8b158">加载中...</van-loading>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import PetCardVue from '@/components/PetCard.vue'
import SkeletonVue from './components/Skeleton.vue'
import { toLoadPetInfo } from '@/axios/index.js'
import { reactive, ref, toRefs, onMounted, computed, onActivated, onDeactivated } from 'vue'
import { Toast, Notify } from 'vant'
import { typeMap } from '@/assets/icons/icon.js'
import { throttle } from '@/utils/tool.js'
import { userStore } from '@/store/user.js'

export default {
  setup() {
    const uStore = userStore()
    const state = reactive({
      active: 0, // 宠物种类切换
      count: 0, //  下拉刷新的次数
      loading: false, // 下来刷新的状态
      typeMap: typeMap, // 宠物种类

      petInfoList: [
        {
          type: '犬',
          petList: [],
          current: 1,
          End: false
        },
        {
          type: '猫',
          petList: [],
          current: 1,
          End: false
        },
        {
          type: '鸟',
          petList: [],
          current: 1,
          End: false
        },
        {
          type: '兔',
          petList: [],
          current: 1,
          End: false
        },
        {
          type: '鼠',
          petList: [],
          current: 1,
          End: false
        },
        {
          type: '鱼',
          petList: [],
          current: 1,
          End: false
        }
      ],
      limit: 4, // 每页记录数
      petLoad: false, // 加载提示

      rememberScroll: 0, // 当前页面滚动高度
      pageBox: ref(null),
      refreshPage: true // 当前页面是否刷新
    })

    uStore.socketConnect()
    uStore.getChatListSync()
    uStore.getFondInfoSync()

    onMounted(() => {
      state.pageBox.onscroll = throttle(scrollFn, 500)
      reqPetData(state.active)
    })

    onActivated(() => {
      state.pageBox.scrollTop = state.rememberScroll
    })

    onDeactivated(() => {
      state.rememberScroll = state.pageBox.scrollTop
    })

    const onRefresh = () => {
      // 下拉刷新
      state.refreshPage = false
      setTimeout(() => {
        state.refreshPage = true
        Toast('刷新成功')
        state.loading = false
      }, 1000)
    }

    const reqPetData = num => {
      // 请求宠物数据
      if (!state.petInfoList[num].End) {
        let current = state.petInfoList[num].current
        showLoad()
        toLoadPetInfo({
          current: current,
          limits: state.limit,
          type: typeMap[num].name
        }).then(res => {
          if (res.data.length != 0) {
            current++
            state.petInfoList[num].current = current
            state.petInfoList[num].petList.push(...res.data)
          } else {
            state.petInfoList[num].End = true
          }
        })
      }
    }

    const cutPetData = type => {
      // 点击宠物种类列表进行切换，进行初次数据加载
      let len = state.petInfoList[type].petList.length
      if (len == 0) {
        reqPetData(type)
      }
    }

    const scrollFn = () => {
      // 滚动触底事件
      let scrollTop = state.pageBox.scrollTop || state.pageBox.scrollTop
      let clientHeight = state.pageBox.clientHeight
      let scrollHeight = state.pageBox.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        reqPetData(state.active)
      }
    }

    const showLoad = () => {
      // 设置加载图案出现一定时间，防止一闪而过
      state.petLoad = true
      let show = setTimeout(() => {
        state.petLoad = false
        clearTimeout(show)
      }, 1000)
    }

    return {
      ...toRefs(state),
      onRefresh,
      reqPetData,
      cutPetData
    }
  },
  components: {
    PetCardVue,
    SkeletonVue
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: calc(100% - 50px);
  overflow: scroll;
  .header {
    width: 94%;
    border-radius: 0.2rem;
    background-color: @primary;
    display: flex;
    align-items: center;
    margin: 0 0.3rem;
    .title {
      flex: 1;
      font-size: 0.8rem;
      color: @color-text-header;
      text-align: center;
      p:last-child {
        font-size: 0.8rem;
        margin-top: 10px;
        font-weight: lighter;
      }
    }
  }
  .search_wrap {
    width: 100%;
    height: 35px;
    // padding: 0 10px 20px;
    box-sizing: border-box;
    margin: 0.3rem auto;
    padding: 0 0.3rem;
    .search {
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      border-radius: 0.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @color-text-search;
      .search_icon {
        width: 20px;
        height: 20px;
        margin: 15px;
      }
      .search_text {
        flex: 1;
      }
    }
  }
  .main_wrap {
    width: 100%;
    border-radius: 32px 32px 0 0;
    box-sizing: border-box;
    background-color: @primary-bg;
    margin-bottom: 60px;
    .tab_wrap {
      width: 100%;
      :deep(.van-tab__text) {
        border-radius: 3rem;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      }
      :deep(.van-tabs__wrap) {
        height: 1.3rem;
      }
      :deep(.van-tabs__nav) {
        margin-left: -0.4rem;
      }
      .icon_wrap {
        width: 1.6rem;
        height: 1rem;
        border-radius: 3.5rem;
        background-color: #fff;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: #9c9b9a;

        .iconfont {
          width: 0.7rem;
          height: 0.7rem;
          color: #fff;
          background-color: #92783170;
          border-radius: 50%;
          font-size: 0.5rem;
          font-weight: 600;
          text-align: center;
          line-height: 0.7rem;
        }
      }
      .iconActive {
        background-color: @primary;
        color: #fff;
        .iconfont {
          color: #fff;
          background-color: #6672499b;
        }
      }
      .title_h1 {
        margin: 0 0.3rem;
      }
      .content_wrap {
        width: 100%;
        // display: flex;
        // flex-wrap: wrap;
        overflow: scroll;
        display: grid;
        grid-template-columns: 50% 50%;
        justify-items: center;
        .item {
          width: 91%;
          margin-bottom: 20px;
        }
      }

      .footer_wrap {
        text-align: center;
        color: #9c9b9a;
      }
    }
  }
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
