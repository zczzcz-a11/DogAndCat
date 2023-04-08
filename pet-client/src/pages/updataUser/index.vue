<template>
  <div class="page">
    <PageHeadVue :name="pageName" />

    <div class="content_wrap">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field name="userImg" label="头像" :rules="[{ required: false }]">
            <template #input>
              <van-image width="2rem" height="2rem" fit="cover" :src="require('@/assets/imgs/user_photo/' + userImg + '.png')" @click="upDataImg" />
            </template>
          </van-field>

          <van-field v-model="userName" name="userName" label="昵称" placeholder="铲屎官的鼎鼎大名" maxlength="20" :rules="[{ required: true, message: '请填写昵称' }]" />

          <van-field name="userSign" v-model="userSign" rows="2" autosize label="个人签名" type="textarea" maxlength="50" placeholder="书写你的养宠心情" show-word-limit :rules="[{ required: false }]" />
        </van-cell-group>

        <div class="addBtn">
          <van-button round block type="primary" native-type="submit" color="#8d9f5e"> 确认修改 </van-button>
        </div>
      </van-form>
    </div>

    <van-popup v-model:show="selectShow" position="bottom" title="编辑">
      <SelectUserImgVue @close="selectClose" @currentImg="selectImg" :show="selectShow" />
    </van-popup>
  </div>
</template>

<script>
import PageHeadVue from '@/components/PageHead.vue'
import SelectUserImgVue from './components/SelectUserImg'
import { userStore } from '@/store/user.js'
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { back } from '@/router/tool.js'

export default {
  setup() {
    const router = useRouter()
    const uStore = userStore()
    const state = reactive({
      pageName: '编辑信息',
      selectShow: false,
      userImg: 'user_001',
      userName: '',
      userSign: ''
    })

    onMounted(() => {
      const { name, sign, userImg } = uStore.getUserInfo()
      state.userName = name
      state.userSign = sign
      state.userImg = userImg === null || userImg === '' ? 'user_001' : userImg
    })

    const onSubmit = value => {
      uStore
        .setUserInfoSync({
          name: state.userName,
          sign: state.userSign,
          userImg: state.userImg
        })
        .then(res => {
          back(router, 0)
        })
    }

    const upDataImg = () => {
      state.selectShow = true
    }

    const selectClose = e => {
      state.selectShow = e
    }

    const selectImg = e => {
      state.userImg = e
    }

    return {
      ...toRefs(state),
      onSubmit,
      upDataImg,
      selectClose,
      selectImg
    }
  },
  components: {
    PageHeadVue,
    SelectUserImgVue
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: @primary;
  .content_wrap {
    width: 100%;
    height: calc(100% - 1.6rem);
    background-color: #fff;
    border-radius: 32px 32px 0 0;
    border-top: 4px solid #683931;
    padding: 40px 0px;
    box-sizing: border-box;
    position: relative;
    .addBtn {
      width: 90%;
      left: 50%;
      transform: translate(-50%);
      position: absolute;
      bottom: 20px;
    }
  }
}
</style>
