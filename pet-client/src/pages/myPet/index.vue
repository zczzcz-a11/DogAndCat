<template>
  <div class="page">
    <PageHeadVue :name="pageName" />

    <div class="content_wrap">
      <PetListVue :petInfoList="petInfoList" />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import PetListVue from './components/PetList.vue'
import PageHeadVue from '@/components/PageHead.vue'
import { userStore } from '@/store/user.js'

export default {
  setup(props) {
    const uStore = userStore() // 仓库的上下文对象
    const state = reactive({
      pageName: '我的宠物',
      petInfoList: [] // 用户宠物信息列表
    })

    state.petInfoList = uStore.getPetInfo()

    return {
      ...toRefs(state)
    }
  },
  components: {
    PetListVue,
    PageHeadVue
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: @primary;
  .header {
    width: 100%;
    height: 10%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.5rem;
    color: @color-text-header;
    i {
      font-size: 0.8rem;
    }
  }
  .content_wrap {
    width: 100%;
    height: calc(100% - 2.3rem);
    background-color: @primary-bg;
    border-radius: 32px 32px 0 0;
    border-top: 4px solid #683931;
    padding-top: 0.7rem;
    // box-sizing: border-box;
    position: relative;
  }
}
</style>
