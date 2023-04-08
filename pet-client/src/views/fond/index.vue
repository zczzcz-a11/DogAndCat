<template>
  <div class="page">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <div class="header">
        <p class="title">喜爱</p>
        <van-icon name="search" />
      </div>

      <div class="content_wrap">
        <van-sticky>
          <div class="tool_wrap">
            <van-dropdown-menu active-color="#f8b158">
              <van-dropdown-item v-model="type" :options="optionType" />
              <van-dropdown-item v-model="sort" :options="optionSort" />
            </van-dropdown-menu>
          </div>
        </van-sticky>

        <div class="content" v-if="petFondList.length !== 0 && refreshPage">
          <div class="item" v-for="item in petFondList" :key="item.petid">
            <PetCardVue :petItem="item" :petCollect="false" @open="sheetOpen" />
          </div>
        </div>

        <div class="content_sheleton" v-else-if="!refreshPage">
          <SkeletonVue />
        </div>

        <van-empty class="custom-image" :image="require('@/assets/imgs/page/empty.png')" description="没有什么也没有汪" v-else-if="petFondList.length == 0" />
      </div>
    </van-pull-refresh>

    <van-action-sheet :show="show" :actions="actions" @cancel="onClose" @select="onSelect" cancel-text="取消" />
  </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import PetCardVue from '@/components/PetCard.vue'
import { userStore } from '@/store/user.js'
import { Dialog, Toast } from 'vant'
import SkeletonVue from '@/views/home/components/Skeleton.vue'

export default {
  setup(props) {
    const uStore = userStore()
    const state = reactive({
      loading: false, // 下来刷新的状态
      optionType: [
        { text: '全部', value: 'all' },
        { text: '类别：犬', value: '犬' },
        { text: '类别：猫', value: '猫' },
        { text: '类别：鸟', value: '鸟' },
        { text: '类别：兔', value: '兔' },
        { text: '类别：鼠', value: '鼠' },
        { text: '类别：鱼', value: '鱼' }
      ],
      optionSort: [
        { text: '时间排序', value: 'time' },
        { text: '喜爱排序', value: 'fond' }
      ],
      type: 'all',
      sort: 'time',
      petFondList: [],
      show: false,
      actions: [
        {
          name: '取消喜爱'
        }
      ],
      actionPetId: '',
      refreshPage: true // 当前页面是否刷新
    })

    let list = []

    const setPetFondList = list => {
      state.petFondList =
        state.type === 'all'
          ? list
          : list.filter(value => {
              return value.petcategory === state.type
            })
    }

    const initFondList = () => {
      uStore.getFondInfoSync().then(res => {
        list = uStore.getFondInfo()
        setPetFondList(list)
      })
    }

    initFondList()

    watch(
      [() => state.type, () => state.sort],
      (newVal, oldVal) => {
        list = uStore.getFondInfo()
        if (newVal[1] === 'time') {
          list = list.sort((a, b) => {
            return b.ctime - a.ctime
          })
        }
        setPetFondList(list)
      },
      { deep: true, immediate: true }
    )

    const sheetOpen = e => {
      state.show = e.type
      state.actionPetId = e.petid
    }

    const onClose = () => {
      state.show = false
    }

    const onSelect = e => {
      if (e.name === '取消喜爱') {
        Dialog.confirm({
          message: '确定将宠物移除吗？'
        })
          .then(() => {
            // console.log(state.actionPetId);
            uStore.setUserCollect(state.actionPetId)
            const type = state.type
            state.type = '0'
            state.type = type
            state.show = false
          })
          .catch(() => {
            state.show = false
          })
      }
    }

    const onRefresh = () => {
      // 下拉刷新
      initFondList()
      state.refreshPage = false
      setTimeout(() => {
        const type = state.type
        state.type = '0'
        state.type = type
        state.refreshPage = true
        Toast('刷新成功')
        state.loading = false
      }, 1000)
    }

    return {
      ...toRefs(state),
      onClose,
      onSelect,
      sheetOpen,
      onRefresh
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
  background-color: @primary;
  .header {
    width: 100%;
    height: 60px;
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
    min-height: calc(100vh - 110px);
    background-color: #fff;
    border-radius: 32px 32px 0 0;
    overflow: hidden;
    border-top: 4px solid #683931;
    .tool_wrap {
      margin-bottom: 15px;
      :deep(.van-dropdown-menu__title) {
        color: @card-color;
      }
    }
    .content {
      width: 100%;
      overflow: scroll;
      display: grid;
      grid-template-columns: 50% 50%;
      justify-items: center;
      margin-bottom: 60px;
      .item {
        width: 91%;
        margin-bottom: 20px;
      }
    }
    .content_sheleton {
      width: 100%;
      height: calc(100vh - 158px);
    }
  }
}
:deep(.van-empty__image) {
  opacity: 0.3;
}
:deep(.van-pull-refresh__head) {
  color: #fff;
}
:deep(.van-loading) {
  & > span {
    color: #fff;
  }
}
</style>
